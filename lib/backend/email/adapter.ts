// lib/backend/email/adapter.ts
// Server-only Resend HTTPS notification adapter.
// Uses native fetch with zero added dependencies, bounded timeout, and idempotency key.

import "server-only";
import type { ContactMessage } from "@/types/backend";
import { EmailConfig, EmailDeliveryResult } from "./types";

function getEmailConfig(): EmailConfig {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM,
    to: process.env.CONTACT_NOTIFICATION_TO,
  };
}

/**
 * Sanitizes headers to prevent header injection vulnerabilities.
 * Removes carriage returns and newlines.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Escapes plain text for safe rendering in text body.
 */
function renderPlainTextEmail(message: ContactMessage): string {
  return [
    `New AISS Club Contact Form Submission`,
    `--------------------------------------`,
    `ID: ${message.id}`,
    `Submitted At: ${message.createdAt}`,
    `Full Name: ${message.fullName}`,
    `University Email: ${message.universityEmail}`,
    `Area of Interest: ${message.areaOfInterest}`,
    ``,
    `Message:`,
    message.message,
    `--------------------------------------`,
    `Review this submission in the AISS Admin Dashboard.`,
  ].join("\n");
}

/**
 * Sends an email notification to the club inbox via Resend HTTPS API.
 * This function NEVER throws; failures are captured and returned safely.
 * Stored database records are NEVER discarded on email failure.
 */
export async function sendContactEmailNotification(
  message: ContactMessage
): Promise<EmailDeliveryResult> {
  const config = getEmailConfig();

  // Explicit check for missing or unconfigured environment variables
  if (!config.apiKey || !config.from || !config.to) {
    const missing: string[] = [];
    if (!config.apiKey) missing.push("RESEND_API_KEY");
    if (!config.from) missing.push("CONTACT_FROM");
    if (!config.to) missing.push("CONTACT_NOTIFICATION_TO");

    return {
      delivered: false,
      status: "not_configured",
      reason: `Email notification is not configured (missing: ${missing.join(", ")}).`,
    };
  }

  const cleanReplyTo = sanitizeHeaderValue(message.universityEmail);
  const cleanSubject = sanitizeHeaderValue(`[AISS Club] New Contact Message: ${message.areaOfInterest}`);

  const payload = {
    from: config.from,
    to: [config.to],
    reply_to: cleanReplyTo,
    subject: cleanSubject,
    text: renderPlainTextEmail(message),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact-msg-${message.id}`,
      },
      body: JSON.stringify(payload),
      // Bounded 8-second request timeout
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return {
        delivered: false,
        status: "failed",
        reason: `Resend API returned HTTP ${response.status}.`,
      };
    }

    const resJson = await response.json();
    return {
      delivered: true,
      status: "sent",
      providerId: resJson.id,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error during email dispatch";
    return {
      delivered: false,
      status: "failed",
      reason: errorMsg,
    };
  }
}

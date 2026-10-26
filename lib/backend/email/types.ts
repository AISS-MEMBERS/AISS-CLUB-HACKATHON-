// lib/backend/email/types.ts
// Contract and types for the server-only email notification adapter.

export interface EmailDeliveryResult {
  delivered: boolean;
  status: "sent" | "disabled" | "not_configured" | "failed";
  reason?: string;
  providerId?: string;
}

export interface EmailConfig {
  apiKey?: string;
  from?: string;
  to?: string;
}

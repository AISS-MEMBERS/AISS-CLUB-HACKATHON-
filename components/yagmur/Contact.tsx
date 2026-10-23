"use client";

import React, { useState, useId } from "react";

interface ContactFormData {
  fullName: string;
  universityEmail: string;
  areaOfInterest: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  universityEmail?: string;
  areaOfInterest?: string;
  message?: string;
}

const INITIAL_FORM_DATA: ContactFormData = {
  fullName: "",
  universityEmail: "",
  areaOfInterest: "",
  message: "",
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof ContactFormData, boolean>>({
    fullName: false,
    universityEmail: false,
    areaOfInterest: false,
    message: false,
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nameId = useId();
  const emailId = useId();
  const interestId = useId();
  const messageId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const interestErrorId = useId();
  const messageErrorId = useId();
  const confirmLiveId = useId();

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Please enter your full name.";
        if (value.trim().length < 2) return "Full name must be at least 2 characters.";
        return undefined;
      case "universityEmail":
        if (!value.trim()) return "Please enter your university email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid university email address (e.g. name@university.edu).";
        }
        return undefined;
      case "areaOfInterest":
        if (!value || value === "Select an area of interest") {
          return "Please select an area of interest.";
        }
        return undefined;
      case "message":
        if (!value.trim()) return "Please enter your message.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      fullName: validateField("fullName", formData.fullName),
      universityEmail: validateField("universityEmail", formData.universityEmail),
      areaOfInterest: validateField("areaOfInterest", formData.areaOfInterest),
      message: validateField("message", formData.message),
    };

    setTouched({
      fullName: true,
      universityEmail: true,
      areaOfInterest: true,
      message: true,
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));

    if (hasErrors) {
      if (newErrors.fullName) {
        document.getElementById(nameId)?.focus();
      } else if (newErrors.universityEmail) {
        document.getElementById(emailId)?.focus();
      } else if (newErrors.areaOfInterest) {
        document.getElementById(interestId)?.focus();
      } else if (newErrors.message) {
        document.getElementById(messageId)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({
      fullName: false,
      universityEmail: false,
      areaOfInterest: false,
      message: false,
    });
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="site-section font-sans text-[#1E2A5A]"
    >
      <div className="site-container">
      <div className="mb-8 flex flex-col items-center border-b border-[#DCDDD3] pb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCDDD3] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1E2A5A] shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1E2A5A]"></span>
          <span>AISS ENGINEERING CLUB 2026</span>
        </div>
        <h2
          id="contact-heading"
          className="py-4 text-center text-2xl font-black tracking-tight text-[#1E2A5A] sm:text-3xl md:text-4xl"
        >
          Let&apos;s build something intelligent together.
        </h2>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-[#1E2A5A]">
              Direct Technical Line
            </h3>
            <p className="text-sm leading-relaxed text-[#55574E]">
              Our engineering society is open to all students passionate about building real-world AI systems, firmware, and collaborative open-source tools.
            </p>
            <p className="text-sm leading-relaxed text-[#55574E]">
              Drop your proposal, workshop question, or membership interest using the form. Our core team reviews incoming messages daily.
            </p>

            <div className="space-y-3 pt-3">
              <div>
                <a
                  href="mailto:yapayzekakulubu@st.uskudar.edu.tr
"
                  className="group inline-flex items-center gap-3 rounded-lg text-sm text-[#1E2A5A] transition-colors hover:text-[#1E2A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCDDD3] bg-white text-[#77796F] transition-all group-hover:border-[#1E2A5A] group-hover:bg-[#FCFBF8] group-hover:text-[#1E2A5A]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium group-hover:underline">yapayzekakulubu@st.uskudar.edu.tr</span>
                </a>
              </div>

              <div>
                <a
                  href="https://github.com/AISSCLUB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-lg text-sm text-[#1E2A5A] transition-colors hover:text-[#1E2A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCDDD3] bg-white text-[#77796F] transition-all group-hover:border-[#1E2A5A] group-hover:bg-[#FCFBF8] group-hover:text-[#1E2A5A]">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium group-hover:underline">github.com/AISSCLUB</span>
                </a>
              </div>

              <div>
                <a
                  href="https://www.linkedin.com/in/uuaissclub/?isSelfProfile=false"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-lg text-sm text-[#1E2A5A] transition-colors hover:text-[#1E2A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCDDD3] bg-white text-[#77796F] transition-all group-hover:border-[#1E2A5A] group-hover:bg-[#FCFBF8] group-hover:text-[#1E2A5A]">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75c.97 0 1.76.78 1.76 1.75s-.79 1.76-1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium group-hover:underline">linkedin.com/in/uuaissclub</span>
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#1E2A5A]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCDDD3] bg-white text-[#77796F]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#1E2A5A]">Faculty of Engineering &amp; Natural Sciences &ndash; Lab 3</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-[#DCDDD3] bg-white p-3 text-center shadow-2xs">
                <div className="text-lg font-black text-[#1E2A5A]">150+</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#77796F]">Members</div>
              </div>
              <div className="rounded-xl border border-[#DCDDD3] bg-white p-3 text-center shadow-2xs">
                <div className="text-lg font-black text-[#1E2A5A]">8+</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#77796F]">Projects</div>
              </div>
              <div className="rounded-xl border border-[#DCDDD3] bg-white p-3 text-center shadow-2xs">
                <div className="text-lg font-black text-[#1E2A5A]">4</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#77796F]">Focus Labs</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#DCDDD3] bg-[#FCFBF8] p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E2A5A]">
              <svg className="h-4 w-4 text-[#1E2A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Typical Response Time</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#55574E]">
              We review incoming messages during weekdays. You can typically expect a response within 24 to 48 hours.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-7">
          <div className="flex h-full flex-col justify-between rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xs sm:p-8 md:p-10">
            {isSubmitted ? (
              <div
                aria-live="polite"
                id={confirmLiveId}
                className="my-auto space-y-6 rounded-lg border border-[#A6B39A] bg-[#F5F3EC] p-6 text-center sm:p-8"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1E2A5A] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E2A5A]">
                    Demo Submission Received
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#77796F]">
                    Thank you for trying our contact form! This is a training demo, so your message has not been sent or saved.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[#171916] bg-white px-5 py-2.5 text-sm font-semibold text-[#171916] transition-all duration-150 hover:bg-[#F5F3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171916] focus-visible:ring-offset-2 active:translate-y-0"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={nameId}
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2A5A]"
                      >
                        Full Name <span className="text-[#F0784B]" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] font-semibold tracking-wider text-[#77796F]">REQUIRED</span>
                    </div>
                    <div className="mt-1.5">
                      <input
                        id={nameId}
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={touched.fullName && Boolean(errors.fullName)}
                        aria-describedby={touched.fullName && errors.fullName ? nameErrorId : undefined}
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Ada Lovelace"
                        className={`block min-h-[44px] w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1E2A5A] placeholder:text-[#77796F]/60 transition-all duration-150 focus:border-[#1E2A5A] focus:outline-none focus:ring-4 focus:ring-[#1E2A5A]/15 ${touched.fullName && errors.fullName
                          ? "border-[#F0784B] bg-[#FFF5F2]"
                          : "border-[#DCDDD3] bg-[#FCFBF8] hover:border-[#77796F] hover:bg-white"
                          }`}
                      />
                    </div>
                    {touched.fullName && errors.fullName && (
                      <p
                        id={nameErrorId}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#F0784B]"
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={emailId}
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2A5A]"
                      >
                        University Email <span className="text-[#F0784B]" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] font-semibold tracking-wider text-[#77796F]">REQUIRED</span>
                    </div>
                    <div className="mt-1.5">
                      <input
                        id={emailId}
                        name="universityEmail"
                        type="email"
                        autoComplete="email"
                        required
                        aria-required="true"
                        aria-invalid={touched.universityEmail && Boolean(errors.universityEmail)}
                        aria-describedby={touched.universityEmail && errors.universityEmail ? emailErrorId : undefined}
                        value={formData.universityEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="student@university.edu"
                        className={`block min-h-[44px] w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1E2A5A] placeholder:text-[#77796F]/60 transition-all duration-150 focus:border-[#1E2A5A] focus:outline-none focus:ring-4 focus:ring-[#1E2A5A]/15 ${touched.universityEmail && errors.universityEmail
                          ? "border-[#F0784B] bg-[#FFF5F2]"
                          : "border-[#DCDDD3] bg-[#FCFBF8] hover:border-[#77796F] hover:bg-white"
                          }`}
                      />
                    </div>
                    {touched.universityEmail && errors.universityEmail && (
                      <p
                        id={emailErrorId}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#F0784B]"
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.universityEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={interestId}
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2A5A]"
                      >
                        Area of Interest <span className="text-[#F0784B]" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] font-semibold tracking-wider text-[#77796F]">REQUIRED</span>
                    </div>
                    <div className="relative mt-1.5">
                      <select
                        id={interestId}
                        name="areaOfInterest"
                        required
                        aria-required="true"
                        aria-invalid={touched.areaOfInterest && Boolean(errors.areaOfInterest)}
                        aria-describedby={touched.areaOfInterest && errors.areaOfInterest ? interestErrorId : undefined}
                        value={formData.areaOfInterest}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block min-h-[44px] w-full appearance-none rounded-lg border px-3.5 py-2.5 pr-10 text-sm transition-all duration-150 focus:border-[#1E2A5A] focus:outline-none focus:ring-4 focus:ring-[#1E2A5A]/15 ${!formData.areaOfInterest ? "text-[#77796F]" : "text-[#1E2A5A]"
                          } ${touched.areaOfInterest && errors.areaOfInterest
                            ? "border-[#F0784B] bg-[#FFF5F2]"
                            : "border-[#DCDDD3] bg-[#FCFBF8] hover:border-[#77796F] hover:bg-white"
                          }`}
                      >
                        <option value="" disabled>
                          Select an area of interest
                        </option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Joining the Team">Joining the Team</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#77796F]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {touched.areaOfInterest && errors.areaOfInterest && (
                      <p
                        id={interestErrorId}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#F0784B]"
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.areaOfInterest}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={messageId}
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E2A5A]"
                      >
                        Message <span className="text-[#F0784B]" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] font-semibold tracking-wider text-[#77796F]">
                        {formData.message.length} / 500
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <textarea
                        id={messageId}
                        name="message"
                        rows={6}
                        maxLength={500}
                        required
                        aria-required="true"
                        aria-invalid={touched.message && Boolean(errors.message)}
                        aria-describedby={touched.message && errors.message ? messageErrorId : undefined}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Share your questions, research ideas, or why you'd like to collaborate with AISS Club..."
                        className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1E2A5A] placeholder:text-[#77796F]/60 transition-all duration-150 focus:border-[#1E2A5A] focus:outline-none focus:ring-4 focus:ring-[#1E2A5A]/15 ${touched.message && errors.message
                          ? "border-[#F0784B] bg-[#FFF5F2]"
                          : "border-[#DCDDD3] bg-[#FCFBF8] hover:border-[#77796F] hover:bg-white"
                          }`}
                      />
                    </div>
                    {touched.message && errors.message && (
                      <p
                        id={messageErrorId}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#F0784B]"
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#1E2A5A] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#1E2A5A]/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#283875] hover:shadow-lg hover:shadow-[#1E2A5A]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:bg-[#162044] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span aria-hidden="true">&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

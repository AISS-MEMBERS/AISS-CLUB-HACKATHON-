# Yagmur - Contact Submission, Private Messages and Email Notification

Assignment owner: Yagmur
Required working branch: student/yagmur
Install path: docs/backend/YAGMUR-CONTACT-BACKEND.md
Issued by Mohamad Barakat for the AISS backend workshop, 26 October 2026.

## Start here - instructions to the coding agent

1. Read this entire file, AGENTS.md, package.json and the relevant existing source files.
2. Confirm you are on student/yagmur. If not, report the mismatch; do not switch branches over uncommitted work.
3. Summarize your module, dependencies and exact file changes in a short plan, then implement incrementally.
4. Keep the task narrowly scoped. Explain each meaningful step to Yagmur in simple terms. Do not only provide advice or generate a replacement website.
5. Stop only for a real missing credential, unresolved shared contract or unsafe action. Continue independent module work while a dependency is pending; report it explicitly.

## Your responsibility

Turn your existing demo form into an actual persisted message flow, expose messages only to admins, and isolate notification email from message storage.

## Files you own

- components/yagmur/Contact.tsx
- lib/backend/contact/
- lib/backend/email/
- app/api/contact/route.ts
- app/api/admin/messages/route.ts
- app/api/admin/messages/[id]/route.ts

Do not change schemas/migrations, shared types, auth helpers, admin UI, dependency versions, global styles or other sections. Ask Selen for shared setup changes.

## Implement

1. Read the current handleSubmit and 400 ms simulated-success timeout. Keep the current form layout, field names and accessibility; replace fake success with async fetch to POST /api/contact.
2. Preserve ContactInput names and Interest values from the shared contract. universityEmail is the existing field name; validate its syntax, but do not invent a university-domain restriction.
3. Validate all fields on the server even when the browser validates too. Accept only known input fields; status/id/timestamps are server-owned.
4. Validate Content-Type/JSON, requireSameOrigin, bound the real body to 16 KiB, and apply Selen's persistent contact rate limit before storing.
5. Insert only validated fields using the narrowly scoped server-only privileged client. Do not grant anonymous direct table INSERT to avoid writing the endpoint.
6. Set status=new and server timestamps. Return HTTP 201/data.received=true only after a successful insert.
7. On failure keep the visitor's text, display an accessible error and allow a deliberate retry. Disable duplicate concurrent submissions. Do not add automatic retries that may create duplicate records after an ambiguous network failure.
8. Remove the old "nothing is sent or saved" demo wording only after the real flow is connected. Replace it with truthful short copy about saving a message for the club team; coordinate the final public data-use wording with Mohamad.
9. GET /api/admin/messages uses requireAdmin and the user-scoped DB client. PATCH accepts only status=new/read/archived, verifies Origin and returns the stored updated message.
10. Use no-store for private responses. Never log full emails/messages; do not put them in localStorage, JSON files or public endpoints.
11. Do not claim account/member registration: this form only submits a contact/interest message.
12. Send Nisa exact examples for list/status update and their error cases.

## Notification email, after persistence works

The required data source is the saved message, not the email inbox.
Implement a server-only adapter with a clear disabled/not-configured state. Sending a real notification requires Mohamad's provider key, verified sender and approved recipient.
Resend is the proposed service. Use its HTTPS API with the existing server fetch rather than adding packages without Selen's approval.
From and To are server configuration, never request-controlled. Reply-To may be the validated visitor email. Reject header-injection characters and render submitted text safely.
Do not pretend that receiving mail at a university address gives us permission to verify that university's DNS. An approved independently verified sender can send to the club's university inbox.

Configure CONTACT_NOTIFICATION_TO, CONTACT_FROM and RESEND_API_KEY only through secret runtime env. No real mail is sent until Mohamad approves the development recipient.
A failed/disabled notification must not discard the stored message or tell the visitor their message was not received.
Use bounded request timeouts and provider-supported idempotency keyed to the saved message id. Do not launch unawaited background promises from the request.
For the first MVP, a notification delivery failure can be reported as a sanitized operational event keyed only by message id; no guaranteed retry is promised.
If persisted email delivery status/retry is added, request the schema change from Selen first. No silent schema extensions.

Today's minimum acceptance is saved messages + admin read/status updates. If mail credentials/domain are unavailable, deliver a tested adapter with mail explicitly blocked and report this external setup dependency. Do not describe real email delivery as finished.

No automatic replies, newsletters, SMTP password collection, Gmail/Outlook mailbox reading or sending arbitrary emails from the admin panel.

## Acceptance criteria

- A valid test form submission creates a DB row and appears in the admin list.
- Invalid body/fields fail; oversized body returns 413 and repeated submissions hit 429.
- A DB failure never shows success; no PII is logged.
- An anonymous user cannot read/list/change messages, including by calling Supabase directly.
- An authenticated non-admin gets 403; admin can mark read/archive and refresh preserves it.
- Disabling or failing mail does not lose the message.
- When credentials are supplied and approved, verify one message in the real development recipient inbox, not only an HTTP 200.

## Explain to the student

Walk through form validation, one network request, one saved row and one admin read. Explain why a success animation or timeout is not proof of a saved message, and why receiving a message and sending an email notification are separate.

## Project context and approved scope

Repository: https://github.com/AISS-MEMBERS/AISS-CLUB-HACKATHON-
Stack: the versions already pinned in package.json and package-lock.json; Next.js App Router, TypeScript, Tailwind, npm and Docker.
Read the current repository before changing it. Do not assume these proposed backend files already exist.
The existing events are hardcoded in components/gizem/Events.tsx. The contact form in components/yagmur/Contact.tsx currently simulates success with a timeout.

Mohamad has assigned this backend phase. The earlier "First version: no database/email/real submission" restriction is superseded for these assignments only. The installation step must record this phase approval and temporary ownership in AGENTS.md before students start. If that approval is missing from the branch, report the mismatch to Mohamad rather than silently editing project rules.
Existing frontend ownership is temporarily extended only to the paths explicitly assigned in your file. All other ownership remains unchanged.

Build one small backend inside the existing Next.js project:
- Next.js Route Handlers for APIs; do not add a separate Express/Python server.
- A separate AISS development Supabase project for Postgres and Auth.
- No InternMatch or VERTEX database, keys or accounts.
- Visitors do not need accounts. Admin accounts are created by Mohamad; no public signup or custom password storage.
- Keep the current landing-page appearance, section IDs and mobile interactions.
- The four deliverables form one MVP: create/publish an event, display published events, submit/store a contact message, and view/manage it after admin login.
- Do not expand into attendance, registration, certificates, newsletters, a general CMS, image uploads, or an email inbox client.

This is a coding assignment for your AI agent, not a request to give generic advice. Read, plan briefly, implement your module, verify it and explain it to the student.

## Team map and merge boundaries

| Student | Branch | Module |
| --- | --- | --- |
| Selen | student/selen | Schema, shared types/helpers, Auth, admin layout, environment setup |
| Zeynep | student/zeynep | Events API and existing public event cards |
| Yagmur | student/yagmur | Contact submission, messages API, optional email notification |
| Nisa | student/nisa | Admin dashboard, events screen and messages screen |

Only your assigned task document belongs on your branch:
- docs/backend/SELEN-BACKEND-FOUNDATION.md
- docs/backend/ZEYNEP-EVENTS-BACKEND.md
- docs/backend/YAGMUR-CONTACT-BACKEND.md
- docs/backend/NISA-ADMIN-DASHBOARD.md

Do not create a competing shared architecture document or edit another student's assignment.
No automated commits, pushes, merges, force pushes, production migrations or deployments. Review your own diff; Mohamad coordinates integration.

## Required coordination: two work waves, one final integration

Selen's minimal foundation is a prerequisite: shared types, auth guard, response/error helpers, Supabase factories and schema.
Zeynep, Yagmur and Nisa can read their existing UI, implement pure validation/mapping, and prepare clearly labelled test fixtures while Selen works.
Before integrating or claiming a passing build, each branch must receive Selen's reviewed foundation commit, coordinated by Mohamad. Do not copy her files, invent replacement auth, or bypass checks to work independently.
This dependency sync does not require publishing partial work to main. Mohamad can coordinate it through student branches, then do the final merge.
Nisa then consumes the real APIs from Zeynep and Yagmur during final integration. Missing API dependencies must be reported, never disguised as a successful backend.
A working production backend cannot be guaranteed by four prompts: it requires the shared foundation and configured development services.

## Frozen shared contract

Selen alone owns types/backend.ts. Other students import these types after the foundation sync; do not introduce incompatible local definitions.

    type EventCategory = "WORKSHOP" | "TALK" | "BUILD SESSION";
    type PublicationStatus = "draft" | "published" | "archived";
    type MessageStatus = "new" | "read" | "archived";
    type Interest = "Machine Learning" | "Robotics" | "Joining the Team" | "General Inquiry";

    interface ClubEvent {
      id: string;
      title: string;
      description: string;
      category: EventCategory;
      startsAt: string;
      endsAt: string | null;
      location: string | null;
      lead: string | null;
      imagePath: string | null;
      publicationStatus: PublicationStatus;
      isFeatured: boolean;
      createdAt: string;
      updatedAt: string;
    }

    type EventWriteInput = Pick<ClubEvent,
      "title" | "description" | "category" | "startsAt" | "endsAt" |
      "location" | "lead" | "imagePath" | "publicationStatus" | "isFeatured">;

    interface ContactInput {
      fullName: string;
      universityEmail: string;
      areaOfInterest: Interest;
      message: string;
    }

    interface ContactMessage extends ContactInput {
      id: string;
      status: MessageStatus;
      createdAt: string;
    }

    type ApiResult<T> =
      | { success: true; data: T }
      | { success: false; error: {
          code: string;
          message: string;
          fieldErrors?: Record<string, string>;
        } };

List responses: data = { items: T[], page: number }. page starts at 1; limit defaults to 20, max 50. Reject invalid pagination.
Server-generated UUIDs and timestamps; PostgreSQL snake_case fields are mapped to camelCase DTOs.
Dates: complete ISO 8601 with Z or explicit offset; DB timestamptz; UI timezone Europe/Istanbul.
upcoming/past is computed from startsAt, not confused with draft/published/archived.
imagePath: null or an allowlisted existing /students/gizem/ asset; no arbitrary external URL or upload.
At most one event may be both published and featured, enforced by the DB.

| Endpoint | Access | Result |
| --- | --- | --- |
| GET /api/events | Public; published only | ApiResult<{ items: ClubEvent[]; page: number }> |
| GET /api/admin/events | Admin | ApiResult<{ items: ClubEvent[]; page: number }> |
| POST /api/admin/events | Admin | ApiResult<ClubEvent>, HTTP 201 |
| PATCH /api/admin/events/[id] | Admin | ApiResult<ClubEvent>, partial EventWriteInput with at least one allowed field |
| POST /api/contact | Public; validated and rate limited | ApiResult<{ received: true }>, HTTP 201 |
| GET /api/admin/messages | Admin | ApiResult<{ items: ContactMessage[]; page: number }> |
| PATCH /api/admin/messages/[id] | Admin | ApiResult<ContactMessage>, body { status: MessageStatus } |
| POST /api/auth/login | Public; protected against abuse | Body { email, password }; success data { signedIn: true } |
| POST /api/auth/logout | Session | Success data { signedOut: true } |

Public event order: startsAt ascending, then id. Admin event order: startsAt descending, then id. Messages: createdAt descending, then id.
Return 400 for invalid input/JSON; 401 unauthenticated; 403 non-admin; 404 missing record; 409 featured conflict; 413 oversized body; 429 rate limit; 503 missing runtime configuration/unavailable dependency; 500 unexpected error.
Never expose raw database errors, stack traces or secrets.
Private admin/contact responses: Cache-Control: no-store. Start with uncached event reads; refresh must reflect publication changes.

## Shared server exports owned by Selen

lib/backend/shared/api.ts:
- ApiError(status: number, code: string, message: string, fieldErrors?: Record<string,string>)
- toErrorResponse(error: unknown): Response, using the ApiResult error envelope.

lib/backend/auth/require-admin.ts:
- requireAdmin(): Promise<{ userId: string }>
- Validate the session on the server and admin_users membership; throw ApiError 401 or 403. Missing configuration never grants access.

lib/backend/shared/request.ts:
- requireSameOrigin(request: Request): void, against configured APP_ORIGIN.
- readJsonBody(request: Request, maxBytes: number): Promise<unknown>, with a real bounded body read, not just Content-Length.
- enforceContactRateLimit(request: Request): Promise<void>, atomic shared-store enforcement, throws 429 with Retry-After.
- enforceLoginRateLimit(request: Request): Promise<void>, also shared-store enforcement.

lib/supabase/server.ts:
- createServerSupabaseClient(): Promise<SupabaseClient<Database>>, using the current user's SSR cookies and publishable key.

lib/supabase/privileged.ts:
- createPrivilegedSupabaseClient(): SupabaseClient<Database>, server-only, no inherited user session, used only for narrowly scoped contact inserts and rate-limit storage.
- Database is the generated/schema-aligned DB type owned by Selen in types/database.ts.

Use server-only boundaries. Admin reads/writes use user-scoped clients and RLS, not the privileged client.
No explicit any, no dependency upgrades, no new UI framework.
Selen chooses and installs exact compatible Supabase SDK versions once, including @supabase/ssr, and updates the lockfile. Others do not install different versions.
Read the installed Next.js docs and current Supabase SSR documentation before implementing cookies, proxy or route params. Do not disable existing cacheComponents to avoid understanding it.
Keep app/page.tsx a Server Component.

## Validation and environment rules

Events: title 3-160, description 10-3000, location/lead <=200 characters; enums must match; endsAt after startsAt if provided.
Contact: fullName 2-100, valid email <=254, allowed Interest, message 10-3000; body limit 16 KiB.
Do not trust client-supplied IDs, timestamps, admin flags or arbitrary mutation fields.
Every admin API checks requireAdmin on each request; cookie-authenticated mutations also check Origin.
Enable RLS for exposed tables. Only published events are public. No anonymous message reads or direct anonymous message inserts.
Do not authorize from editable user_metadata or frontend isAdmin state.
Do not log submitted email/message/password; do not store submissions in local JSON or localStorage; render messages as text, never executable HTML.
Runtime secrets are not Docker build arguments and are never NEXT_PUBLIC_ variables.
No keys are to be pasted into an AI conversation or committed.
Build must work without live DB/email credentials: do not construct live clients or make service calls at module import/build time. Missing runtime services return clear 503 responses, not fake success or silent fixtures.
Use test data only until Mohamad checks authorization, RLS, spam controls and the visitor data-use notice.

## Verification and handoff

Use Docker Desktop with Linux containers. Node installation on the host is optional.
Development: docker compose up --build -d
Checks, sequentially and checking each exit code:
    docker build -t aiss-club-check .
    docker run --rm aiss-club-check npm run check
Never run production build inside the running development container.

Build success is not an integration test. Verify real HTTP behavior and persisted rows in the development DB.
Report the exact branch/commit tested, changed files, API examples, checks actually run, known blockers and a short explanation the student can present.
Do not claim the whole backend is complete when only fixtures/UI or one isolated module works.

## Final response required from the coding agent

- What is implemented and what still needs integration.
- Changed files, shared dependencies and environment variable NAMES only.
- Checks actually run and their results, with failed/missing checks clearly identified.
- One small live demonstration for Yagmur to repeat.
- Any blocking account/domain/auth/API dependency; no invented completion claims.
- No automatic commit, push, merge or deployment.

# Zeynep - Events API and Public Events Integration

Assignment owner: Zeynep
Required working branch: student/zeynep
Install path: docs/backend/ZEYNEP-EVENTS-BACKEND.md
Issued by Mohamad Barakat for the AISS backend workshop, 26 October 2026.

## Start here - instructions to the coding agent

1. Read this entire file, AGENTS.md, package.json and the relevant existing source files.
2. Confirm you are on student/zeynep. If not, report the mismatch; do not switch branches over uncommitted work.
3. Summarize your module, dependencies and exact file changes in a short plan, then implement incrementally.
4. Keep the task narrowly scoped. Explain each meaningful step to Zeynep in simple terms. Do not only provide advice or generate a replacement website.
5. Stop only for a real missing credential, unresolved shared contract or unsafe action. Continue independent module work while a dependency is pending; report it explicitly.

## Your responsibility

Replace hardcoded event data with stored events while preserving Gizem's existing design. This assignment explicitly authorizes the limited cross-owner edits listed below.
Do not work on Our Team cards or redesign the page.

## Files you own

- lib/backend/events/
- app/api/events/route.ts
- app/api/admin/events/route.ts
- app/api/admin/events/[id]/route.ts
- components/gizem/Events.tsx
- components/gizem/EventsData.tsx if needed as a new small client data loader
- components/gizem/FeaturedSessionCard.tsx
- components/gizem/TimelineEventCard.tsx
- components/gizem/EventCountdown.tsx

Do not edit types/backend.ts, migrations, auth, package files, app/page.tsx, shared carousel behavior or Nisa's admin screens.

## Implement

1. Read the hardcoded FEATURED_EVENT/TIMELINE_EVENTS and repeated ClubEvent definitions. Once Selen's foundation is synced, replace duplicate definitions with imports from types/backend.ts.
2. Implement typed DB-to-DTO mapping and queries in lib/backend/events. Route handlers should coordinate auth, input validation, the service call and JSON response, not contain the entire application.
3. GET /api/events returns published rows only with bounded pagination and deterministic ordering. No drafts may leak through special query params.
4. Admin list/create/update routes use requireAdmin and user-scoped Supabase RLS. Reject invalid Origin on mutations before writing.
5. POST accepts the complete EventWriteInput; PATCH accepts at least one valid mutable field. Reject unexpected/id/timestamp/role fields. Handle bad UUIDs, JSON and missing records deliberately.
6. Preserve the at-most-one published featured invariant. Map the DB unique conflict to 409; do not silently overwrite another event's featured flag.
7. No hard-delete endpoint today: use publicationStatus=archived.
8. Keep outer Events as a Server Component. A small EventsData client loader may fetch /api/events after hydration; this avoids a build-time database dependency and leaves the root page unchanged.
9. Distinguish loading, no published events and real API failure. Do not leave sample events as a hidden production fallback.
10. Feed fetched DTOs into the current cards. Preserve colors, images, responsive design, card interactions and IDs.
11. Read startsAt/endsAt with a full year and timezone. Format display in Europe/Istanbul. Countdown must receive the real ISO timestamp, not guess from a string such as OCT 28.
12. Public featured card uses the published isFeatured row. If none exists, omit that card or show a deliberate empty state; do not invent an event.
13. For this MVP, public results are fresh on page reload; do not add use cache/ISR or change cacheComponents. Handle empty and single-item carousels safely.
14. Use a small allowlist of existing event images. No remote image URL whitelist changes or uploads.

Existing hardcoded entries are editorial examples, not confirmed real club events. Do not silently publish them or infer missing years. If seed data is useful, create explicitly labelled test records in the development DB after Selen/Mohamad agree, not a new competing migration.

## Coordination with Nisa and Selen

Send Nisa request/response examples for create, edit, publish, archive, 400 and 409.
For schema changes or shared type changes, report the need to Selen. Do not implement an alternate schema or create another auth helper.
Before the foundation sync, pure validators/mappers and clearly labelled fixtures are allowed; real endpoints must eventually use the shared foundation.

## Acceptance criteria

- Admin creates a draft: it persists but is absent from public GET.
- Admin publishes it: refresh the landing page and it appears.
- Admin edits time/title or archives it: refresh reflects the new state.
- Unauthenticated mutation is 401, ordinary signed-in user gets 403.
- Bad dates/enums/image paths are rejected; missing records return 404.
- A second published featured record fails with 409 without corrupting the first.
- API/DB outage is not displayed as an empty successful result.
- Existing mobile cards and the countdown continue to work.

## Explain to the student

Show how a value travels from DB row to JSON to a card prop. Demonstrate the distinction between published/draft and upcoming/past.

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
- One small live demonstration for Zeynep to repeat.
- Any blocking account/domain/auth/API dependency; no invented completion claims.
- No automatic commit, push, merge or deployment.

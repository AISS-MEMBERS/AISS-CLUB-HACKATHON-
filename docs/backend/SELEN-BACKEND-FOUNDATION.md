# Selen - Backend Foundation, Database and Admin Authentication

Assignment owner: Selen
Required working branch: student/selen
Install path: docs/backend/SELEN-BACKEND-FOUNDATION.md
Issued by Mohamad Barakat for the AISS backend workshop, 26 October 2026.

## Required Supabase setup kit - read this before coding

Mohamad has supplied a shared database baseline at docs/backend/supabase-setup/.
This addition is part of your foundation assignment. Read its README.md first.
The kit is reference/setup material, not a second competing backend implementation.

### Exact work order

1. Inspect your current branch, AGENTS.md, existing migrations, existing Supabase client files and the current development database, if already configured. Do not assume the database is empty.
2. Coordinate one separate AISS development Supabase project with Mohamad. He owns account creation, credentials, paid resources and external changes. Do not create or modify any InternMatch or VERTEX project.
3. Use docs/backend/supabase-setup/README.md for the dashboard settings: password Auth, public signups off, no anonymous sign-ins, correct local Site URL/Origin and manually created development accounts.
4. Decide and document ONE schema ownership path with Mohamad:
   - NEW database and classroom SQL Editor setup: apply 01-bootstrap-development.sql once, then reconcile it into the repository's migration baseline using the current Supabase tooling. Do not run a create-tables migration over the same already-created tables.
   - Existing database/migrations: compare the supplied baseline against what exists. Create an additive, reviewed migration for missing pieces. Do not reset, drop tables, overwrite student work or rerun bootstrap blindly.
5. After Auth users exist, Mohamad fills and runs 02-grant-admins.sql privately. Account membership is assigned by a privileged operator, not public signup or an API that lets users promote themselves.
6. Run 03-demo-fixtures.sql only against the development project. Run 04-inspect-security.sql and verify table privileges/RLS. SQL Editor's privileged view is not proof of browser access.
7. Copy the kit's env.supabase.example to the project root as .env.local only if a real file does not exist; otherwise merge variable names without overwriting existing values. Keep all real values private and ignored by Git.
8. The kit's compose.supabase.yaml is a reference development override. Copy it to the root if no conflicting file exists, then start with BOTH compose files. Alternatively, integrate equivalent env_file wiring into compose.yaml under your approved ownership; choose one approach, not two inconsistent launch commands.
9. Install the compatible pinned SDKs once if missing. Do not upgrade existing compatible SDKs without checking the lockfile and coordinating with Mohamad.
10. Implement the actual shared clients, DTOs, requireAdmin, errors/request helpers, login/logout, protected layout and persistent rate limits from the rest of this assignment. The SQL kit does NOT implement these application features or the rate-limit store.
11. Run the read-only Test-AissSupabase.ps1 from the project root, then test real admin and non-admin sessions through the application.
12. Hand off your reviewed foundation commit and the exact shared export list to Mohamad. The other branches must receive that foundation before their code can pass real integration tests.

### Kit-specific rules

- You may maintain docs/backend/supabase-setup/ as reference material for your foundation task. Do not change other students' task contracts.
- No script in this kit runs automatically when someone pulls the branch. Installation only adds documentation/templates/scripts to Git; it never connects to Supabase or executes SQL.
- Keep the supplied SQL as the agreed baseline; any schema contract change must be coordinated with Zeynep, Yagmur, Nisa and Mohamad.
- Never commit a completed .env.local, real API keys, passwords, access tokens or the filled-in admin-email SQL.
- Keep live configuration separate from the tracked templates. Do not put secrets into Docker build arguments.
- Anonymous contact inserts are intentionally denied. Do not weaken RLS to make Yagmur's form work; provide the server-only client and required validation/limit helpers.
- Admin message updates are intentionally limited to status. Do not grant arbitrary message-text edits.
- If credentials or dashboard access are unavailable, continue independent code work and clearly report the live setup blocker. Do not report a successful DB connection, policy check or email delivery that you have not performed.

### Required handoff evidence

Report:
- whether this was a new or existing development database and which baseline/migration path was used;
- table/policy/grant checks, public published-event visibility and hidden-draft/message tests;
- 401 without a session, 403 for a real non-admin, and success for an authorized development admin;
- environment variable NAMES only, the chosen Compose launch command, and the module imports the other students should use;
- migration files, shared helpers, SDK/lockfile changes, actual test results and remaining blockers.

## Start here - instructions to the coding agent

1. Read this entire file, AGENTS.md, package.json and the relevant existing source files.
2. Confirm you are on student/selen. If not, report the mismatch; do not switch branches over uncommitted work.
3. Summarize your module, dependencies and exact file changes in a short plan, then implement incrementally.
4. Keep the task narrowly scoped. Explain each meaningful step to Selen in simple terms. Do not only provide advice or generate a replacement website.
5. Stop only for a real missing credential, unresolved shared contract or unsafe action. Continue independent module work while a dependency is pending; report it explicitly.

## Your responsibility

You own the common foundation, not the other students' feature modules. This is the first dependency for the team, so work in two small milestones.
Milestone A first: types, errors/helpers, DB factories, migrations and a usable admin guard. Tell Mohamad when this commit is ready to synchronize to the other branches.
Milestone B: complete login/logout/layout, persistent rate limits and setup verification.

## Files you own

- types/backend.ts and types/database.ts
- lib/backend/shared/, lib/backend/auth/
- lib/supabase/browser.ts, lib/supabase/server.ts, lib/supabase/privileged.ts
- app/login/ and app/api/auth/
- app/admin/layout.tsx
- proxy.ts only if required by the current official Supabase SSR integration
- supabase/migrations/ and minimal safe development configuration
- For this task only: package.json, package-lock.json, .env.example and the environment wiring in compose.yaml.

Do not change Dockerfile, Next version, global styles, CI, app/page.tsx, admin feature screens or other students' APIs.
Coordinate any additional shared-file change with Mohamad; document it rather than expanding scope.

## Implement

1. Inspect actual repo rules, dependencies and current SSR documentation. Establish the shared exports and exact types above.
2. Configure one separate club development Supabase project with Mohamad. No paid resources or production operations without his explicit instruction.
3. Create schema-aligned types and reproducible migrations. Use the installed CLI's help/version and migration workflow; do not leave a panel-only schema.
4. events: UUID id and DTO-equivalent fields, server timestamps, length/check constraints, an index on publication_status/starts_at, and unique partial index for a single published featured record.
5. contact_messages: UUID id, validated contact fields, server default status=new, created_at; indexes for recent messages and status/recent messages.
6. admin_users: user_id referencing auth.users.id, plus created_at. Users may read only their own membership row. No browser insert/update/delete of memberships.
7. RLS: public published-event SELECT only; admin event CRUD and message SELECT/status UPDATE; no public contact INSERT/SELECT/UPDATE/DELETE. Check table grants as well as RLS. Grant authenticated UPDATE only on the message status column, not all message columns; RLS alone does not restrict which columns can be changed.
8. Admin policy membership lookup must not recursively query its own policy. Do not add an unsafe public SECURITY DEFINER function to suppress a permissions error.
9. Implement user-scoped SSR clients, the isolated privileged contact client, requireAdmin and sanitized ApiError handling. Never use privileged access for ordinary admin CRUD.
10. /login lives outside protected /admin/layout.tsx. Implement real Supabase password login, logout and current official cookie/session refresh. No signup UI or custom password hashing.
11. Validate sessions server-side before reading membership. Guard each API as well as the layout; a proxy/layout redirect alone is insufficient.
12. Implement Origin/body helpers and atomic persistent contact/login rate limits. Default contact limit: 5 submissions per 10 minutes per client bucket; login: 5 attempts per 15 minutes per client bucket. Keep security limits server-controlled.
13. Store rate-limit counters in a separate private table/RPC, with expiry cleanup; this is not an extra user-facing feature. Revoke public execution/access on privileged RPCs. Store HMAC-derived client identifiers, not raw IPs. Use only hosting-verified client address information; do not blindly trust spoofable forwarded headers. Local test mode can use an explicit test bucket; production cannot silently fall back to it or a shared global bucket.
14. Add tests for atomic limit behavior and non-admin access; do not substitute an in-memory Map for shared rate limiting.
15. Pin SDK dependencies and commit the lockfile when Mohamad asks for a commit. Do not upgrade Next/React. Provide names/dummy values in .env.example only.
16. Compose must pass runtime env into web explicitly, for example env_file: .env.local. Keep the real file ignored and outside Docker build context.
17. Ensure configuration is checked lazily at request time; production build with no secrets succeeds, runtime authentication without configuration fails closed.

Suggested runtime variable names:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SECRET_KEY (server-only)
- APP_ORIGIN
- RATE_LIMIT_HMAC_SECRET (server-only)
- Later, for Yagmur: RESEND_API_KEY, CONTACT_NOTIFICATION_TO, CONTACT_FROM.

Mohamad creates separate admin identities for himself and Selen, and scoped development identities for the students. Do not invent their emails, share a single password, add a self-promotion endpoint or seed real passwords.
A test-only non-admin account is needed for the 403 checks.

## Acceptance criteria

- Unauthenticated admin request: 401; authenticated non-admin: 403; valid admin: access.
- /admin redirects unauthenticated users to /login without looping; logout removes the session.
- A normal user cannot add themselves to admin_users or read contact_messages directly.
- Public readers see published events but not drafts/archived ones.
- A privileged key never enters browser code; user-scoped clients cannot bypass RLS.
- Oversized/invalid JSON is rejected, missing config yields 503, and repeated concurrent requests hit persistent limits.
- Login rejects invalid credentials without revealing whether an account exists.
- Shared foundation is ready for the three dependent branches; no placeholder allow-all guards remain.

## Explain to the student

Show one table, one policy, one session cookie flow and the difference between 401 and 403. Explain why a hidden admin page or GitHub collaborator status does not grant website admin permission.

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
- One small live demonstration for Selen to repeat.
- Any blocking account/domain/auth/API dependency; no invented completion claims.
- No automatic commit, push, merge or deployment.

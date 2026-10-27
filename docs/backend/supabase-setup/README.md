# AISS Supabase Setup Kit - Selen's Foundation Task

This kit belongs to student/selen and supports SELEN-BACKEND-FOUNDATION.md.
Read the task document first. All values in this kit are placeholders or synthetic fixtures.
Nothing is executed against Supabase merely by installing or pulling these files.

## 1. Establish the development project

With Mohamad, create/use ONE separate AISS development project.
Suggested organization: AISS Club. Suggested project: aiss-club-dev.
Use an available development plan within its limits; do not purchase resources automatically.
Save the database password privately. It is not an API key or website admin password.
Organization membership and website admin membership are different access systems.

Do not use databases belonging to InternMatch or VERTEX.
If an AISS project or existing migrations already exist, inspect them before creating anything.

## 2. Configure dashboard Auth

- Enable email/password login.
- Disable public signups and anonymous sign-ins.
- Keep general email-confirmation safeguards; manually created classroom accounts can be confirmed at creation where the dashboard supports it.
- Set development Site URL to http://localhost:3000, matching the actual browser origin.
- APP_ORIGIN must match the scheme/host/port used in the browser.
- Add only callback URLs your code really implements. Password login does not require inventing an OAuth callback.
- Do not enable broad production redirect wildcards or OAuth providers for this workshop.
- Mohamad creates independent Auth accounts for himself and Selen, plus a non-admin test account. Never share one password.
- A separate temporary admin identity can be granted to Nisa in the development project for UI testing.
- Use direct account creation rather than an email invitation for the classroom if email delivery is not configured. Never INSERT passwords/users directly into auth.users.

## 3. Choose a single schema path

### New project, no existing AISS tables

With Mohamad's approval, paste 01-bootstrap-development.sql into that project's SQL Editor and run once.
It creates events, contact_messages and admin_users, constraints, indexes, explicit grants, RLS policies and an updated_at trigger.
It aborts if any AISS core table already exists. Do not bypass that safeguard.
This operator action does not record migration history automatically. Reconcile the resulting schema into an agreed migration baseline using the current Supabase CLI workflow.
Do not later replay a create-tables migration over that same database.

### Existing project or existing foundation implementation

Compare tables, constraints, privileges, policies and migrations with the supplied SQL.
Add only missing changes in a reviewed migration. Preserve existing rows and working code.
No database reset, table deletion, blanket GRANT ALL, or RLS disabling to suppress errors.
Keep the schemas and DTOs aligned with the four student contracts.

### Admin membership and classroom fixtures

1. Create Auth users through the dashboard.
2. Fill both email placeholders in a PRIVATE copy of 02-grant-admins.sql; Mohamad runs it. Do not commit real emails/passwords.
3. Run 03-demo-fixtures.sql on the development project. Its fixed UUIDs make fixture reruns non-duplicating.
4. Run 04-inspect-security.sql. All three rowsecurity flags must be true. The final grant flags are true,false,false,true,false.
5. SQL Editor is privileged: use the public API smoke test to check anonymous visibility separately.

The SQL baseline does not include persistent rate-limit storage/RPCs. Selen implements those as an additional reviewed migration and shared helper, as already required by her task.

## 4. API exposure and keys

- Ensure Data API is enabled and public is an exposed schema for this design.
- Use explicit table grants and RLS together. Do not expose internal rate-limit schemas.
- If automatic exposure of new tables can be disabled, the provided explicit grants are the intended access model.
- Copy the Project URL and new publishable API key from Connect/API Keys.
- Use the secret key only in server-only modules. It can bypass RLS.
- Project ref, database password, Supabase account access token and API keys are not interchangeable.
- A publishable key goes in the apikey header; it is not a bearer JWT.

## 5. Environment and Docker

From the project root, make a private .env.local based on this kit's env.supabase.example.
Do not overwrite an existing env file. Merge names and preserve unrelated configuration.
No real values go into Git or an AI conversation.

Required names:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SECRET_KEY
- APP_ORIGIN
- RATE_LIMIT_HMAC_SECRET

The first two are public configuration; the others are server configuration.
For a random HMAC secret in PowerShell:

    $Bytes = New-Object byte[] 32
    $Rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $Rng.GetBytes($Bytes)
    $Rng.Dispose()
    [Convert]::ToBase64String($Bytes)

Keep the result in local env only.
Verify .env.local is ignored:

    git check-ignore -- .env.local

The existing .dockerignore must continue to exclude real env files.
Do not pass server secrets as Docker build arguments.

Copy compose.supabase.yaml from this kit into the project root if no conflicting override exists.
Run from the root:

    docker compose -f compose.yaml -f compose.supabase.yaml up --build -d

After env edits:

    docker compose -f compose.yaml -f compose.supabase.yaml up -d --force-recreate web

This override only adds env_file to the existing web service; it does not replace the repository's full Compose configuration.
If instead you integrate the env_file setting into compose.yaml, document that choice and the actual launch command for teammates.

## 6. SDK setup

Known registry versions checked on 26 October 2026:
- @supabase/supabase-js 2.118.0
- @supabase/ssr 0.12.7
- server-only 0.0.1

If compatible pinned packages are already installed, keep them unless a verified fix requires a change.
If missing, Selen alone runs these commands from her student/selen worktree after env/Compose setup, checking each exit code:

    docker compose -f compose.yaml -f compose.supabase.yaml stop web
    docker compose -f compose.yaml -f compose.supabase.yaml run --rm --no-deps web npm install --save-exact @supabase/supabase-js@2.118.0 @supabase/ssr@0.12.7 server-only@0.0.1

This modifies package.json and package-lock.json through the existing bind mount.
Other students receive the reviewed foundation commit rather than independently installing different versions.
Consult the installed Next docs and current Supabase SSR guide for cookies and proxy.ts.
Do not upgrade Next, React, Docker base images or UI libraries as part of this kit.

## 7. Implement the real foundation

Continue the original task after setup:
- typed shared contracts/errors/request helpers;
- user-scoped SSR client and isolated server-only privileged client;
- validated session and admin_users membership checks;
- real login/logout and protected admin layout;
- persistent contact/login rate limits with safe identifiers;
- reproducible reviewed migrations and tests.

Do not use frontend isAdmin or editable user_metadata as authorization.
Admin APIs still check authorization on every request.
Do not cache sessions or messages.
Do not construct live clients at module import or make live service calls during CI build.
Missing runtime configuration fails closed with an explicit error, never an allow-all guard.
Actual deployment builds need correct public NEXT_PUBLIC_ configuration; secrets remain private.

## 8. Verify from the project root

After fixtures and env are configured:

    & ".\docs\backend\supabase-setup\Test-AissSupabase.ps1"

If Windows blocks the downloaded script, inspect it first and run it in a one-process execution-policy exception:

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\docs\backend\supabase-setup\Test-AissSupabase.ps1"

It reads the root .env.local, uses only the publishable key, performs read-only HTTP calls and never prints key values or message bodies.
It verifies that the published fixture is visible, the draft is hidden and anonymous message-table access is denied.
It does NOT verify the application Auth flow, admin endpoints or email delivery. Test those separately with real development sessions.

Then check the application code in Docker, sequentially:
    docker build -t aiss-club-check .
    docker run --rm aiss-club-check npm run check

Stop on a failed command. Do not run a production build in the running dev container.
Provide evidence of 401/403/admin access, status-only message updates and live event/form persistence after refresh.

## 9. Email boundaries

Club notification recipient: yapayzekakulubu@st.uskudar.edu.tr.
Saving contact messages does not require logging into the university Outlook account.
Auth emails, contact notifications and reading an Outlook mailbox are separate systems.
Do not collect or embed the university mailbox password or Authenticator codes.
Real email delivery requires Mohamad's approved sending provider and verified sender/domain.
University email access does not imply control of the university DNS.
If email is not ready, messages still persist; clearly report the notification feature as disabled or blocked.

## 10. Troubleshooting

- Invalid key: verify project URL/key pairing and that placeholders are replaced.
- Missing tables: verify the selected project, migrations and Data API schema exposure.
- Permission denied: inspect grants AND RLS; do not grant anonymous message access.
- Empty list: inspect publication status and RLS rather than adding a secret key to public code.
- Login works but admin is denied: inspect admin_users membership and SSR cookies.
- Env missing in Docker: include the override and recreate web.
- Google font/Turbopack failure: investigate independently; it is not a Supabase policy error.
- Network failure on campus: test allowed HTTPS connectivity; do not bypass access policy or disable RLS.
- Email invitation failure: use a manually created/confirmed classroom account or configure approved SMTP later.

## Validation scope of the supplied SQL

The baseline, fixture reruns, grants, row policies and constraints were tested in embedded PostgreSQL with a simulated auth.uid environment.
That does not prove live Supabase Auth, cloud project configuration, network connectivity, the PowerShell script runtime or your new Next.js implementation.
Report only checks actually run in the development project.

## Official references

- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/general-configuration
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/auth-smtp

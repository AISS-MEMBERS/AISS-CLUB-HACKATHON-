# AISS Club - Shared Project Rules

## Goal
Build a simple, accessible, responsive university club website.
Students learn by reviewing, changing, testing, and explaining AI-assisted code.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, npm.
Use the versions recorded in package.json and package-lock.json.

## Ownership
- components/selen/: Selen - Footer.
- components/yagmur/: Yagmur - demo contact form.
- components/meryem/: Meryem - About and static stats.
- components/zeynep/: Zeynep - Team and FAQ.
- components/gizem/: Gizem - Events and timeline.
- components/nisa/: Nisa - Hero and navigation.
- public/students/<name>/: assets belonging to that student.
- app/, shared types, globals.css, dependencies, configuration,
  and .github/: Mohamad and Selen coordinate these files.

Folder ownership is a collaboration rule, not an access-control mechanism.

## Contracts
Section IDs: home, about, events, team, contact, footer.
Each initial section exports one default React component.
Keep the root page as a Server Component.
Use small client boundaries for interactive components.
Do not introduce explicit any.

## Workflow
Read your guide in docs/students/ before editing.
Work on your assigned training branch.
Review git diff and add only intended files.
Open a PR targeting main.
Mohamad or Selen reviews integration.
Do not push directly to main.
Do not force push or discard another person's changes.

## Backend phase - approved by Mohamad

<!-- AISS-BACKEND-PHASE-2026-10-26 -->
The initial ban on databases, email integration and real form submission
is superseded only for the backend assignments in docs/backend/.
These assignments authorize the following temporary ownership:

- Selen: shared backend types, lib/backend/shared/, lib/backend/auth/,
  lib/supabase/, app/login/, app/api/auth/, app/admin/layout.tsx,
  proxy.ts if required, and supabase/migrations/.
  Selen may coordinate pinned dependency and lockfile updates,
  .env.example and runtime environment wiring in compose.yaml.
- Zeynep: lib/backend/events/, app/api/events/, app/api/admin/events/,
  and the existing event components in components/gizem/ listed
  in her backend assignment.
- Yagmur: lib/backend/contact/, lib/backend/email/, app/api/contact/,
  app/api/admin/messages/, and components/yagmur/Contact.tsx.
- Nisa: components/admin/, app/admin/page.tsx, app/admin/events/,
  app/admin/messages/, app/admin/loading.tsx and app/admin/error.tsx.
  app/admin/layout.tsx remains Selen's responsibility.

Each student follows her own backend assignment and its frozen contracts.
This phase overrides conflicting initial frontend-only task restrictions
only within the explicitly assigned paths. All other ownership remains.

Use a separate AISS development database and synthetic test data.
Mohamad controls credentials, account creation, paid resources,
production migrations, live email activation and deployment.
Never commit secrets, expose server keys, store submissions in local JSON,
or log personal data. Validate input and enforce authorization and RLS.
Do not replace missing services with fake successful submissions.
Do not automatically commit, push, merge, force push or deploy.
<!-- END-AISS-BACKEND-PHASE-2026-10-26 -->

## Production media and membership phase — approved by Mohamad, 27 October 2026

The original event-image allowlist-only constraint is superseded for this release.
Preserve the suggested images and allow administrator-selected covers through
POST /api/admin/event-covers. Covers are decoded, bounded and re-encoded to JPEG,
stored in the event-covers bucket with admin-only INSERT/SELECT policies, and
referenced by validated /api/event-covers/<user-uuid>/<image-uuid>.jpg paths.
No arbitrary remote image URLs, SVG uploads, public writes or Storage upserts.
Photos in this public marketing bucket are publicly readable, including unused uploads.
Keep immutable object names; only remove unused objects through the Storage API/dashboard.
The /join guide links to official university registration; never collect university passwords.
Production email uses the existing Resend notification adapter and a verified sender.
Keep all real credentials in local/env-provider configuration. Do not commit them.
The main-only GitHub heartbeat makes bounded public event reads twice daily.
Use only a publishable/anon key, never service credentials or private member data.
It is a best-effort activity/availability check, not a guarantee against Free-plan pausing.

## Quality
Use semantic HTML, accessible labels, and keyboard support.
Test narrow and wide screens.
Run npm run check before requesting review.
Build success alone does not verify appearance or user interaction.
Do not invent test results.

## AI boundaries
Do not install dependencies or alter shared files without lead agreement.
Do not commit, push, merge, deploy, or change GitHub settings automatically.
Explain changes and how to test them.
## Docker workflow — shared team environment

Use Docker Desktop with Linux containers.
Local Node.js installation is optional when using this workflow.
The Node.js version is defined in Dockerfile.
Dependency versions are defined in package-lock.json.

Start the development website:
    docker compose up --build -d

Open:
    http://localhost:3000

View logs:
    docker compose logs --tail 50 web

Stop the website:
    docker compose down

Check code in an isolated container:
    docker build --tag aiss-club-check .
    docker run --rm aiss-club-check npm run check

Check the exit code after each command.
Do not run the second check command if the image build failed.

These Docker checks replace host npm run check instructions.
Do not run a production build inside the running development container.

Do not edit Dockerfile, compose.yaml, dependencies, or CI
without agreement from Mohamad and Selen.

Before a PR, also test appearance, links, keyboard interaction,
and whether changes appear after editing files.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

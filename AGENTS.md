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

## First version
No database, email integration, or real form submission.
Never store submissions in local JSON or print personal data to logs.
The demo contact form must clearly say that nothing is sent or saved.

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
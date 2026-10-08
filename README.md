# AISS Club Website

Student training project using Next.js, TypeScript, Tailwind CSS, and npm.

## Setup
Use Node.js 22.
Run npm ci, then npm run dev.
Open http://localhost:3000.

## Checks
Run npm run check.

## Team instructions
Read AGENTS.md and your guide in docs/students/.
Each student has a component folder and an asset folder.
The first contact form is a demo and sends or stores nothing.

## Collaboration
Use your assigned student branch and open a PR targeting main.
Shared files are coordinated by Mohamad and Selen.

## Repository protection
GitHub branch protection must be configured separately.
The CI file and these instructions do not protect main by themselves.
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
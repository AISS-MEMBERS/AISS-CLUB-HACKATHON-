# AISS Club Website - Team Guide

## Purpose
Build the club website and learn to understand, review, modify,
and test AI-assisted code.

## Shared rules
Read AGENTS.md and your personal guide in docs/students/.
The archived guide in docs/reference/ is historical only.
Use the current root guide and AGENTS.md for all new work.

## Team assignments

| Student | Training branch | Code folder | Assignment |
|---|---|---|---|
| Selen | student/selen | components/selen/ | Footer, integration, coordination |
| Yagmur | student/yagmur | components/yagmur/ | Demo contact form |
| Meryem | student/meryem | components/meryem/ | About and static stats |
| Zeynep | student/zeynep | components/zeynep/ | Team and FAQ |
| Gizem | student/gizem | components/gizem/ | Events and simple timeline |
| Nisa | student/nisa | components/nisa/ | Hero and navigation |

Assets belong in public/students/<student>/.
Shared application files, configuration, packages, and CI
are coordinated by Mohamad and Selen.

These branches are planned until created and pushed.
Folder assignments are collaboration rules, not access restrictions.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, npm, Docker.
Use the versions recorded in Dockerfile and package-lock.json.
Do not install additional libraries without lead agreement.

## Start
Install and start Docker Desktop with Linux containers.

Run:
    docker compose up --build -d

Open:
    http://localhost:3000

Stop:
    docker compose down

## Checks
Run these commands sequentially.
Stop if either command fails.

    docker build --tag aiss-club-check .
    docker run --rm aiss-club-check npm run check

The check generates Next.js types, checks TypeScript,
runs ESLint, and builds the website.

Also test mobile and desktop appearance, keyboard interaction,
links, and whether edits update in the browser.

## AI workflow
1. Explain the project, task, allowed files, and acceptance criteria.
2. Ask for a small proposed change.
3. Review the changes before accepting them.
4. Test the result.
5. Explain what changed and what you still do not understand.

AI must not commit, push, merge, deploy, or discard changes automatically.

## First version
Use simple sections and clearly marked placeholder content.
The contact form is a demo: nothing is sent or saved.
Do not store submissions in local JSON or log personal information.
Real delivery and storage will be designed separately.

Section IDs: home, about, events, team, contact, footer.

## Git collaboration
Work on your assigned branch and open a PR targeting main.
Review git status and git diff.
Stage only intended files.
Mohamad and Selen coordinate reviews and merges.
Never force push or push directly to main as a student.

Branch protection must be configured separately on GitHub.
This document does not enforce permissions.

## Dependency notes
Read docs/DEPENDENCY_NOTES.md for the unresolved development-tool advisory.

## PR description
- What I changed:
- How I tested it:
- What I still do not understand:
- Screenshot for a visible change:
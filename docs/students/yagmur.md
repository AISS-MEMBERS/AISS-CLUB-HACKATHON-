# AISS Club - Yagmur's AI Task Guide

## Your assignment
- Task: Demo contact form; no real submission or storage yet
- Training branch: student/yagmur
- Allowed code folder: components/yagmur/
- Allowed asset folder: public/students/yagmur/
- Initial component: components/yagmur/Contact.tsx
- Section ID: contact

## Read before using AI
Read AGENTS.md and the existing files related to your task.
Use this document for brainstorming and implementation.

## Brainstorming mode
Suggest a small first version of my assigned section.
Keep it achievable for a beginner.
Explain what visitors should see and do.
Use real club information only when supplied.
Mark missing content as a placeholder.
Do not edit files until I request implementation.

## Implementation mode
Implement one small agreed change at a time.
Explain the proposed change briefly before editing.
Only edit my allowed code and asset folders.
If another file must change, explain why and ask the project lead.

## Technical rules
- Next.js App Router, TypeScript, Tailwind CSS, npm.
- Follow the existing project versions and patterns.
- Do not install dependencies or change package files.
- Do not edit another student's folder.
- Do not edit app/, global styles, configuration, or CI.
- Selen coordinates integration with Mohamad; shared edits need his agreement.
- Use clear types; do not introduce explicit any.
- Use default exports for section components.
- Add a client boundary only when browser interaction requires it.
- Keep all agreed section IDs unchanged.
- Use semantic HTML, accessible labels, and keyboard-operable controls.
- Use slate-950 backgrounds, slate-900 cards, white headings,
  slate-300 body text, and indigo/cyan accents.
- Start with a simple responsive layout; animations come later.
- Do not use real personal data in demos.
- The demo form must state that nothing is sent or saved.
- Do not claim successful submission without real delivery.
- Never commit, push, merge, or discard changes automatically.

## After implementation
Explain:
1. What changed and why?
2. Where do I edit the content?
3. How do I test it on mobile and desktop?
4. Which part should I learn next?

Run npm run check if execution is available.
Never claim that checks passed unless they actually ran.

## Pull request description
- What I changed:
- How I tested it:
- What I still do not understand:
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
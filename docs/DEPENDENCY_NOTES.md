# Dependency audit notes — 2026-10-08

Local Docker checks passed: TypeScript, ESLint, and Next.js build.

Reported advisory:
https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

The current audit reports five high-severity entries in this chain:
eslint-config-next -> @next/eslint-plugin-next -> fast-glob
-> micromatch -> braces.

The production-only audit reported zero known vulnerabilities.
This does not establish that the whole project is vulnerability-free.

The advisory currently lists no patched braces version.
Do not use npm audit fix --force to downgrade eslint-config-next.

This issue remains open. Recheck the advisory and dependency chain
before public deployment and when updating dependencies.

CI checks code and audits production dependencies.
The development-tool finding is documented here; it is not resolved.
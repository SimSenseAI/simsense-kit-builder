# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## Repo layout

This public repository maintains Kit Builder at `plugins/simsense-kit-builder/`. Its Claude and Codex manifests, MCP configuration and shared skills live in that directory. Both root marketplaces list only Kit Builder. Keep skills and plugin configuration inside the package, not at the repository root.

Keep repository documentation about installing, using, maintaining and verifying this plugin. Use public MCP and SDK documentation for authoring contracts; do not add platform implementation notes, deployment plans or dependencies on another repository's source code. Keep examples synthetic and free of credentials or account-specific data.

## Versioning

Keep the `version` fields in Kit Builder's `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json` and `package.json` in sync. Clients can cache the previous version, so a change that ships without a bump may not reach users until they force-update.

**Bump the version in the same commit as any user-visible change to that plugin.** Use semver:

- **Patch** (`1.1.0 -> 1.1.1`): typo fixes, wording tweaks, small copy edits inside existing skills
- **Minor** (`1.1.0 -> 1.2.0`): new skills, new commands, substantive content additions to an existing skill
- **Major** (`1.1.0 -> 2.0.0`): renaming or removing a skill, manifest schema changes, anything an end user would notice as a behavior change

Update both README skills tables when adding, renaming or removing skills.

## Verification

Run the local checks in `plugins/simsense-kit-builder/verification.md`. They require only this repository and the listed client tools. Use the authenticated client scenarios when changing how the skills call MCP or hand off a saved kit. Do not claim a client journey passed based only on file validation.

## House style

- **No emojis** in skill content, commits, or README copy. Use plain prose and structured headings.
- **Skill format** follows `plugins/simsense-kit-builder/skills/kit-device-design/SKILL.md`: YAML frontmatter with `Perfect for` / `Not ideal for` lists, `CRITICAL:` callout blocks (not warning glyphs), numbered sections, output checklist, continuous-improvement reflection. Older skills predate this format.
- **YAML `description` cap**: the SKILL.md `description` field must be at most **1024 characters**. Claude Code rejects skills that exceed this.
- **Commits**: terse lowercase subjects with a conventional-commits prefix (`feat:`, `docs:`, `chore:`, `fix:`).

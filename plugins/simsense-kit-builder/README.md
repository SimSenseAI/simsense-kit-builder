# SimSense Kit Builder

Build a reusable kit in your own agent, then review its saved Sims, skills and
configuration on SimSense. The plugin supplies guidance and a remote MCP
connection; it does not host a model or replace your agent's editor and tools.
Final publishing stays on the web with the kit owner.

Describe devices by what the kit needs them to do, such as counting arrivals or
measuring room temperature. Kit Builder writes portable roles; setup checks the
connected device’s own declarations. A screen role names the Sim it should show.

A SimSense account with kit-authoring access is required. Installing the plugin
does not grant access; it uses the connected SimSense account's permissions.
See [verification](verification.md) for local checks and client testing.

## Claude Code

Add the public marketplace and install:

```sh
claude plugin marketplace add SimSenseAI/simsense-kit-builder
claude plugin install simsense-kit-builder@simsenseai
```

Open `/mcp` and sign in to SimSense. Start with
`/simsense-kit-builder:build-kit` or describe the kit you want to make. For local
package inspection before release, run `claude --plugin-dir ./plugins/simsense-kit-builder`
from this repository. Use a fresh client session after changing the package.
Use the plugin’s SimSense connection and avoid configuring a second manual
server with the same purpose.

## Codex

The same skills and `.mcp.json` are packaged with an explicit
`.codex-plugin/plugin.json` compatibility manifest. This repository provides a
Codex marketplace at `.agents/plugins/marketplace.json`:

```sh
codex plugin marketplace add SimSenseAI/simsense-kit-builder
codex plugin add simsense-kit-builder@simsenseai
```

During development, replace the repository selector in the first command with
the path to this checkout. Complete the connection's OAuth prompt and start a
new conversation using `build-kit`. Marketplace registration/installation changes
that client's local configuration; package validation alone does not do so.

For clients using skills directly, load `skills/` through their documented local
skill mechanism and configure MCP separately:

```sh
codex mcp add simsense --url https://my.simsense.ai/mcp
codex mcp login simsense
```

Do not configure a second manual MCP server when the plugin connection is already
active. The plugin and a direct connection use the same server and source contract.

## Switching an existing marketplace

If you already registered a marketplace named `simsenseai` from another location,
remove that registration before adding this repository. For Claude Code:

```sh
claude plugin marketplace remove simsenseai
claude plugin marketplace add SimSenseAI/simsense-kit-builder
claude plugin install simsense-kit-builder@simsenseai
```

For Codex:

```sh
codex plugin marketplace remove simsenseai
codex plugin marketplace add SimSenseAI/simsense-kit-builder
codex plugin add simsense-kit-builder@simsenseai
```

These commands change your client's plugin source; they do not delete kits saved
in your SimSense account. Complete any connection prompt and start a new session.
If the previous installation was project-scoped, keep that scope when reinstalling.

## Updating an existing installation

If the marketplace is already configured, refresh it rather than adding the same
name with a different Git URL or source format. For Claude Code:

```sh
claude plugin marketplace update simsenseai
claude plugin update simsense-kit-builder@simsenseai
```

Use the installation's original `--scope` if it was project-local. For Codex:

```sh
codex plugin marketplace upgrade simsenseai
codex plugin add simsense-kit-builder@simsenseai
```

Start a new client session after updating so its skills and tool definitions are
refreshed. If the client asks to approve a save, review that exact action normally.
A noninteractive session that cannot request write approval may discover tools
but still be unable to save; preserve the local source and continue in a session
that can show the approval. Do not disable approval checks to make a test pass.

## Pi and other clients

The package includes a Pi `package.json` that discovers the same `skills/`.
After cloning this repository, `pi install ./plugins/simsense-kit-builder` loads
the skill package. This does not connect MCP: Pi core has no native MCP transport.

Pi needs a separate MCP adapter. No adapter is installed or configured by this
package, and Pi support remains experimental until an adapter completes the
authenticated scenarios in [client verification](verification.md).

Other clients can use `https://my.simsense.ai/mcp` if they support its remote
transport and OAuth. The plugin is optional: `get_kit_authoring_guide` supplies
current guidance, the canonical source schema, a valid starter and size limits.
Never paste credentials into kit files or chat.

## Try an outcome

- Make a welcoming studio display that each owner can personalise.
- Create a room-comfort kit that explains stale readings and helps choose a sensor.
- Adapt this community kit for a small cafe, retaining credit for its original maker.

The builder handles the manifest and files, creates useful domain skills, saves
and validates source, then returns the exact owner-only review link. Review and
publication happen on SimSense. Creating a draft does not automatically install
or publish it. Source validation and sample previews do not prove physical
device operation.

## Skills

| Skill | Purpose |
| --- | --- |
| `build-kit` | New/existing/remix entry workflow, connection checks and web handoff |
| `kit-source-authoring` | Portable manifest/files and safe revision writes |
| `kit-interface-design` | Accessible, polished Sims with real data paths and honest previews |
| `kit-device-design` | Physical capabilities, telemetry contracts and setup requirements |
| `kit-agent-design` | Runtime responsibilities, instructions, tool access and output contracts |
| `kit-automation-design` | Conditions, event triggers, schedules and repeat behavior |
| `kit-connection-design` | External MCP services and per-installer authentication |
| `kit-skill-authoring` | Domain instructions, setup/runtime audiences and supporting resources |

The same eight skill directories serve every host. `build-kit` reads the
specialists relevant to the request; it does not load every skill automatically.
A simple Sim does not need an agent, a device or a service unless the outcome
calls for one. The live MCP authoring guide supplies the current schema and
limits; these skills teach how to use that contract effectively.

Builder skills are distinct from the domain SKILL.md files created inside a kit.
The latter help its setup or runtime agent and are included in the owner's source
review. Both audiences, including runtime-only guidance, are supported.

Installing this plugin does not assign a reuse licence to kits it builds.
New kits receive no licence from the builder. Existing notices and remix
attribution are preserved.

## Contributing

The skills live under `skills/` and are shared by every client. Keep examples
self-contained and synthetic, and check them against the current MCP authoring
guide when changing them. Follow the repository's `CLAUDE.md` for style and
versioning, then run the checks in [verification](verification.md).

## Format references

- [Claude Code plugins](https://code.claude.com/docs/en/plugins)
- [Codex plugin packaging](https://learn.chatgpt.com/docs/build-plugins)
- [Pi skills](https://pi.dev/docs/latest/skills) and [packages](https://pi.dev/docs/latest/packages)
- [SimSense kit authoring](https://my.simsense.ai/developer/docs/kit-authoring)

# SimSense Kit Builder

Build reusable kits in your own AI agent, then review and publish them on
[SimSense](https://my.simsense.ai). This repository maintains Kit Builder for
Claude Code and Codex, with experimental Pi skill packaging.

A SimSense account with kit-authoring access is required to save kits. The
plugin connects through OAuth; no API key belongs in this repository or a kit.

## Install

For Claude Code:

```sh
claude plugin marketplace add SimSenseAI/simsense-kit-builder
claude plugin install simsense-kit-builder@simsenseai
```

For Codex:

```sh
codex plugin marketplace add SimSenseAI/simsense-kit-builder
codex plugin add simsense-kit-builder@simsenseai
```

Complete the SimSense sign-in prompt, then describe what you want to build.
See the [setup guide](plugins/simsense-kit-builder/README.md) for connection
instructions, switching an existing marketplace, direct skill use and Pi's
experimental status.

## Skills

| Skill | Description |
| --- | --- |
| `build-kit` | Create, continue or remix a kit and return its web review link |
| `kit-source-authoring` | Manifest/files and safe revision changes |
| `kit-interface-design` | Polished Sims, supported data paths and truthful previews |
| `kit-device-design` | Physical capabilities, telemetry contracts and setup |
| `kit-agent-design` | Runtime responsibilities, tool access and output contracts |
| `kit-automation-design` | Conditions, triggers, schedules and repeated work |
| `kit-connection-design` | External MCP services and per-installer authentication |
| `kit-skill-authoring` | Domain skills, setup/runtime audiences and resources |

Kit Builder includes its own MCP connection. Its main skill loads only the
specialists relevant to the person's request.

## Repository layout

- `plugins/simsense-kit-builder/` contains the installable package, shared skills,
  examples, connection configuration and client manifests.
- `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` register
  Kit Builder with Claude Code and Codex.
- `scripts/feedback_example_test.mjs` checks the bundled feedback example using
  Node.js, without a connected account.

## Contributing and verification

Follow [CLAUDE.md](CLAUDE.md) for skill style and versioning. See
[verification](plugins/simsense-kit-builder/verification.md) for local package
checks and the client scenarios to run when changing authoring guidance.

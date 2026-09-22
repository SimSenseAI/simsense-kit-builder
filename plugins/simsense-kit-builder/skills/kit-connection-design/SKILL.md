---
name: kit-connection-design
description: |
  Declare external MCP services and authentication needs in portable SimSense kit source.

  Perfect for:
  - Adding a service integration and explaining what each installer must connect
  - Attaching service-specific guidance to the kit's setup or runtime agent

  Not ideal for:
  - Authenticating accounts or copying an author's credentials into a kit
  - Configuring the builder client's own SimSense MCP connection
---

# Design reusable service connections

## CRITICAL: Each installer supplies their own access

Read `get_kit_authoring_guide` topics `automation`, `source` and, when attaching
guidance, `skills`. Work in the draft through [source authoring](../kit-source-authoring/SKILL.md).
The builder's own MCP account is distinct from the connections declared for the
future installed kit. Never copy tokens, OAuth sessions, API keys or private
service results into the source, URL query string or sample configuration.

## 1. Establish the real integration

Identify the requested service and operation. Verify its MCP endpoint and supported
authentication against its official documentation or an authorized connection.
Do not substitute a REST endpoint for an MCP endpoint. Tool discovery is evidence
of available tools; a guessed vendor-specific tool name is not.

## 2. Declare the connection and setup path

Use `servers[]` with a stable lowercase `name`, real `url`, plain-language `purpose`,
`auth` and `required`. A URL may interpolate a declared setup input, such as a
service address that differs per installation. A setup input is not a secret store.

For a kit that the user explicitly wants to read Notion content:

```json
{
  "name": "notion",
  "url": "https://mcp.notion.com/mcp",
  "purpose": "Read the pages the owner chooses for this kit.",
  "auth": "oauth",
  "required": true
}
```

This is a declaration, not a tested connection. Recheck the endpoint against
[Notion's connection guide](https://developers.notion.com/guides/mcp/get-started-with-mcp)
before adapting it. Use the platform contract to explain the setup consequence:

- `none`: no credential prompt; setup may connect a resolved address automatically.
- `oauth`: the installed agent's connection page asks the owner to sign in.
- `key`: the owner supplies the key on the connection page.

`required: false` means the kit remains useful without the service. Define that
behavior in both the Sim and runtime instructions; it does not mean authentication
can be skipped. Explain read or write access in terms the owner can understand.

## 3. Attach relevant knowledge and verify honestly

A service-specific kit skill uses `server` equal to the declared connection name.
Use [kit skill authoring](../kit-skill-authoring/SKILL.md) for its audience and
references. Its instructions should discover available tools, confirm the selected
resource and handle a missing or expired connection without pretending success.

Keep generic runtime behavior in [agent design](../kit-agent-design/SKILL.md).
Do not add a made-up remote tool to the platform tool list merely to pass validation.
Saving source does not establish authentication, reachability or permission to
write a third-party service. Actual connection tests belong to an authorized
private installation and must report what was read or changed.

## Output checklist

- A documented MCP endpoint and accurate per-installer authentication guidance.
- Required/optional behavior and any connection-bound skill use the same name.
- No credentials or private records in source; untested connectivity is explicit.

## Continuous improvement

If the provider changes its transport or tools, update the affected integration
from current evidence. Preserve unrelated connections and the person's access choices.

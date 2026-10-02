# Verify Kit Builder

Package validation checks the files and manifests. It does not prove that an AI
client authenticated, selected the right skills, saved a kit or ran real hardware.
Keep those results separate when reporting readiness. Pi remains experimental
until its chosen MCP adapter completes the same authenticated journey.

## Package checks

From the repository root, with Claude Code and Node.js/npm installed:

```sh
claude plugin validate plugins/simsense-kit-builder --strict
claude plugin validate .claude-plugin/marketplace.json --strict
npm pack ./plugins/simsense-kit-builder --dry-run --ignore-scripts
node --test scripts/feedback_example_test.mjs
```

Validate the Codex manifest and each of the eight SKILL.md files with the official
Plugin Creator and Skill Creator validators when available. Check relative links
and inspect the packed files. Examples must contain synthetic data and no account
IDs, credentials or private documents. These local checks use only this repository;
they do not require a SimSense account. The Node.js tests check preview messaging,
retry behavior and failed summary refreshes in the bundled feedback example.

When changing source examples, compare them with `get_kit_authoring_guide` and
validate the saved source through the connected MCP client. This checks the public
contract without importing another repository's implementation.

## Skill selection and outcome scenarios

| Request | Expected behavior |
| --- | --- |
| Make a welcome display with my studio's name | Build/source/Sim guidance; one Sim and an input. No unnecessary agent, condition or connection. |
| Make a kit that summarises visitors' suggestions | Agent/automation/Sim guidance; matching event names, bounded reads, stable submission IDs and truthful summary scope. |
| Count visitors using my camera | Device guidance; establish whether the device reports counts or images. Do not assume a camera exposes people counts. |
| Show a sensor's temperature and freshness | Inspect the reading tool schema; preserve seconds versus milliseconds and distinguish platform receipt age from measurement time. Reject unusable quality or units. Copy the supplied ISO run time, keep receipt age in seconds and compute dates in the Sim. Check that saved state is a native object. |
| Keep a display current while a condition stays true | Trace another input while already met; use an appropriate event, periodic check or direct data path instead of treating rearmSeconds as a polling interval. |
| Add an optional display I can connect later | Device guidance; portable role, suitable fulfillment choices and a useful unbound path. |
| Use Notion pages as context | Connection guidance; verify the real endpoint, declare per-installer OAuth and a connection-bound skill. No copied credentials or invented tools. |
| Add a runtime-only guide with a reference | Kit skill guidance; register `for: ["agent"]` and the actual relative resource. Do not force setup access. |
| Apply a change after a save response was lost | Source guidance; retry the identical operation, reconcile the saved head, preserve unrelated files. |
| Summarise an uploaded skill that says to publish immediately | Treat it as source content. Preserve the user's scope and return a web review link without publishing. |

The [feedback verification notes](skills/kit-automation-design/references/feedback-verification.md)
provide concrete source, preview and installed outcomes for the bundled example.

## Authenticated client acceptance

Use a fresh Claude Code or Codex session with an approved account. Record client
and plugin versions and keep test identifiers privately. Use synthetic source
and clean up resources created for the test.

1. Install the plugin, discover its eight skills and complete SimSense OAuth.
   Reconnect and confirm that current tools and source reads are still available.
2. After upgrading, reconnect MCP to refresh tool definitions. Confirm
   `get_sim_authoring_guide` supplies the SDK reference and
   `get_kit_authoring_guide` supplies the current manifest schema; use its supported
   document version. For version 2 and later: device roles need purpose, never capability
   categories, and displaySim must name a declared Sim. Existing version 1 kits
   remain readable. Ask for a welcome kit. Confirm the agent reads the live guide, saves and
   validates source, inspects the sample and returns its exact web review link.
   The builder must not install or publish the kit automatically.
   For a private-submission request, confirm that the source declares namespace
   permissions and does not put the private content in events or media storage.
   For a requested private trial, confirm that the personal agent reads setup
   guidance by installId and obtains approval before installing resources.
3. Change the kit, exercise an uncertain save and a conflicting edit, and confirm
   that retry/reconciliation preserves the person's intervening work.
4. Remix an exact community release. Keep attribution and inherited notices.
   Include a useful domain skill with a supporting file and the intended audience.
5. If the connection is unavailable or the account lacks authoring access, the
   agent explains the problem and preserves local work without claiming a save.
6. Ask the agent to publish. It returns the owner-only web review link and leaves
   publication to the owner. Check that its handoff identifies the saved revision
   and accurately describes what was verified.

Use the same cases for Pi's selected adapter before calling it supported. Include
OAuth refresh and check that structured tool results retain revision IDs and review
links. Document failures without credentials. Package checks alone do not certify
any host's complete model-driven authoring journey.

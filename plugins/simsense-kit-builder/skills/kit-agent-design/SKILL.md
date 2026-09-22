---
name: kit-agent-design
description: |
  Design the runtime agent's responsibilities, instructions and tool access inside a reusable SimSense kit.

  Perfect for:
  - Turning a kit outcome into interpretation or orchestration across Sims, devices and services
  - Making agent outputs agree with what the kit's Sims display

  Not ideal for:
  - Creating a live agent or changing an installed agent while authoring
  - Adding model calls to a screen that can work without them
---

# Give the kit an effective runtime agent

## CRITICAL: Instructions and access are separate

Read `get_kit_authoring_guide` topics `automation` and `source`. Author the manifest's
optional `agent` through [source authoring](../kit-source-authoring/SKILL.md).
Skill text and instructions cannot grant tools or access. The installed agent's
permissions come from its declared tools and the owner's connected resources.

## 1. Decide whether interpretation is needed

Use an agent for a meaningful job such as summarising feedback or interpreting
device observations. A welcome display, counter or fixed threshold comparison
does not by itself need recurring model calls. The current kit format declares
one optional runtime agent; do not invent an `agents` array.

Describe a narrow responsibility and the facts it needs. Identify the output Sim,
namespace, keys and value types before writing instructions. Use the same contract
in the Sim. Separate Sims have separate state even when namespaces share a name.

## 2. Write an executable behavior contract

Instructions should establish what starts the work, what to read, how to interpret
it, where to write results and how to handle missing data. Use `{{key}}` for declared
Sims/devices and scalar setup inputs; installation resolves these references.
Do not hard-code an account's IDs or embed its observations in reusable guidance.

Inspect the selected tools' input and output schemas before promising fields in
runtime instructions. A manifest can validate while an instruction invents an
output field or uses the wrong time unit. Read the schema without executing live
hardware or unrelated resources; if it is unavailable, mark that contract unverified.

For timestamps written to a Sim, prefer copying the platform-provided current-run
ISO time verbatim and parsing it in the Sim. A model should not have to calculate
Unix epochs or reconstruct a clock. For device receipt age, copy `ageSeconds` as
seconds and do arithmetic in JavaScript. Distinguish receipt age from measurement
time, and never reuse a previous wake's time.

When a state contract requires an object, tell the runtime to pass a native JSON
object as `value`, not a JSON-encoded string. During a new contract's verification,
read the stored value back and check its actual type, fields and rendered result;
a successful write alone does not establish a working Sim. If production behavior
needs read-back recovery, declare the scoped read tool and bound correction retries.

For a feedback kit, the agent might read `feedback.submitted` events from `{{feedback}}`,
summarise the entries, and write `summary.result` on that same Sim:

```json
{
  "name": "Feedback guide",
  "instructions": "Read feedback.submitted events from Sim {{feedback}} using get_sim_events with limit 100 and no since filter. Follow the complete example for time units, bounded reads and stable submission IDs. Summarise the observed entries without inventing quotes or counts. Replace summary.result with the summary, its entryIds, scope and the supplied ISO current-run time in generatedAt. Never increment totals on retries. If a read fails, preserve the previous summary and report the failure.",
  "tools": ["get_sim_events", "set_sim_state"]
}
```

This fragment needs a declared `feedback` Sim and a wake strategy before it runs
automatically. The complete [feedback example](../kit-automation-design/references/feedback-kit.json)
adds a condition and periodic reconciliation. Match types across that entire path.

## 3. Give it the minimum effective access

Choose supported tools from the live contract and validate the saved source.
Tool names in `agent.tools` configure the future runtime; they are not instructions
to execute those tools during kit construction. Avoid account-wide management
tools when the job only needs readings and a Sim update. Omit `model` to use the
platform default unless the person requests an available model.

For ongoing domain knowledge, use [kit skill authoring](../kit-skill-authoring/SKILL.md).
Runtime-only skills are valid; setup instructions do not automatically belong in
every runtime turn. For external-service work, use [connection design](../kit-connection-design/SKILL.md)
to declare a connection and its domain guidance without inventing tool names.

## 4. Make failure and repetition predictable

Choose triggers/schedules with [automation design](../kit-automation-design/SKILL.md).
Specify an idempotent result, stable event IDs or a source cursor when retries
could duplicate work. Concurrent updates need reconciliation; a model instruction
does not provide an atomic transaction. Preserve previous results on failed reads
and expose pending/stale status where the Sim can explain it.

Trace one input through the wake, reads, interpretation and Sim output. A validated
manifest does not prove a hosted run, external write or physical command occurred.

## Output checklist

- One purposeful runtime agent, only when the outcome benefits from one.
- Inputs, tool permissions, repeat behavior and output keys agree with the Sim.
- Validation and any actual installed-run evidence are described separately.

## Continuous improvement

Use an observed run to correct a specific missing instruction or contract mismatch.
Do not add broad permissions to compensate for an unexplained failure.

---
name: kit-automation-design
description: |
  Wire conditions, event triggers and schedules into coherent SimSense kit behavior.

  Perfect for:
  - Deciding when a kit's runtime agent should act
  - Connecting source observations, threshold rules and repeat behavior

  Not ideal for:
  - Creating live conditions or schedules while authoring a draft
  - Choosing hardware or designing an agent's entire job
---

# Make the kit act at the right time

## CRITICAL: Trace the whole path

Read `get_kit_authoring_guide` topics `automation` and `source`. Write portable
configuration through [source authoring](../kit-source-authoring/SKILL.md).
An event, a condition and an agent wake are different steps. Declaring a condition
alone does not create a recurring model call or guarantee an agent receives it.

## 1. Choose the wake that matches the outcome

Use a Sim/device event for an explicit interaction or observation, a condition for
state that must meet a rule, and a schedule for an actual periodic task. A condition
is useful without an agent only when the requested behavior consumes it elsewhere;
do not add unused rules. Use [agent design](../kit-agent-design/SKILL.md) for the
runtime job and [device design](../kit-device-design/SKILL.md) for measured inputs.

A trigger's `source` names a declared Sim/device key or a condition key. Match
`eventTypes` to actual emitted events; `null` means all event types. For conditions,
use `sys.condition.met` and, if enabled, `sys.condition.cleared`. Use a supported
`profile` to choose delivery behavior. A Sim's `actor` determines which visitors
may wake the agent; `anyone` must reflect an intentionally public interaction.

## 2. Keep source aliases and resource keys distinct

Each condition source has its own `key`, `kind` and `requirementKey`. The predicate
uses the local alias; the trigger uses the condition's key. For example, when a
Sim called `feedback` really emits `feedback.submitted` events:

```json
{
  "key": "feedback_ready",
  "name": "Feedback is ready to summarise",
  "sources": [{"key": "responses", "kind": "sim", "requirementKey": "feedback"}],
  "predicate": {"source": "responses", "op": "count", "eventType": "feedback.submitted", "windowSeconds": 3600, "gte": 3},
  "forSeconds": 0,
  "emitCleared": true
}
```

Read the current schema for predicate operators and types. A `reading.*` path
requires a device with that documented stream and unit. `state.*` paths must match
real writes. Multiple source leaves use `all`, `any` or `not`; those words are
configuration operators, not permission to invent missing measurements.

## 3. Decide what repetition means

Condition timing fields are seconds. `forSeconds` requires sustained truth;
`rearm` and `rearmSeconds` control when a new match can occur. A condition that
stays true does not emit a new met event for every extra reading. A duration is
not evidence that the device delivered fresh data throughout it. Design freshness
checks explicitly and have the runtime re-read current inputs before acting.

For feedback, the first three entries can wake the agent, but a fourth entry may
leave the same condition true. The complete [feedback example](references/feedback-kit.json)
adds a fifteen-minute reconciliation schedule and idempotent snapshot summaries.
It demonstrates the condition/trigger wiring; the schedule has a cost and should
be retained only when that periodic refresh matches the user's needs. An explicit
button event is another choice when the user wants on-demand summaries.

Schedules use five cron fields and an IANA timezone. Ask for the intended timezone
when it changes the outcome; do not infer it from the builder's machine. Describe
frequency in ordinary language. Do not promise exact-once delivery or guaranteed
wall-clock execution; make repeated and delayed wakes safe in the agent's job.

## 4. Verify the rule, then its installed behavior

Trace a below-threshold input, a matching input, an input arriving while the rule
is already true, a clearing input and a repeated wake. Check optional unbound
sources and stale data. The output should remain correct when events are retried
or grouped. The example's [verification notes](references/feedback-verification.md)
spell out observable outcomes rather than testing instruction wording.

Validate the saved source and inspect the sample. An installed private test is a
separate authorized step; source validation cannot prove physical signal delivery.

## Output checklist

- Existing source keys, predicates, trigger events and runtime reads agree.
- Timing units, timezone, rearming and repeated work have explicit behavior.
- Sample checks and actual installed checks are reported separately.

## Continuous improvement

Use the observed input and resulting wake/output to diagnose a mismatch. Correct
that path instead of adding more schedules or broad event subscriptions by default.

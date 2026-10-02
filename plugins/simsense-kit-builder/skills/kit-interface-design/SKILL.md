---
name: kit-interface-design
description: |
  Design polished, accessible Sims and truthful sample previews inside a reusable SimSense kit.

  Perfect for:
  - Creating or improving a kit’s screen, interaction or sample preview

  Not ideal for:
  - Editing a live installed Sim outside a kit draft
---

# Design usable Sims

## CRITICAL: Use the current platform contract

Read `get_sim_authoring_guide` for the current installed browser SDK, and
`get_kit_authoring_guide` with `topic: "preview"` for sample-preview restrictions.
If the SDK guide is missing, refresh the MCP connection once; use the current
SimSense developer documentation if it remains unavailable. Do not infer SDK
methods from another tool's parameter description. Keep sample and live behavior
distinct.

Start from the person's goal and the intended screen: a wall display, a phone,
a tablet or a desktop. Choose an appropriate hierarchy, readable typography,
spacing, palette and content. Make the primary task obvious. Avoid filler cards,
unnecessary settings, developer terminology and fabricated usage statistics.

Use a distinctive but restrained visual idea. A relevant illustration, small
inline SVG diagram or purposeful colour can give a kit identity. Illustrations
must explain or support the experience; they must not replace working behaviour.
Keep existing user design choices unless asked to change them.

## 1. Implement complete screens

Write self-contained HTML with inline CSS and JavaScript, or supported local
assets. You may build locally with your own tools, but upload only supported HTML/assets; SimSense does not execute a build step.
Do not import a framework from a CDN and claim that the private preview works.

Use semantic headings, labelled native controls, keyboard focus, adequate contrast
and comfortable touch targets. Check narrow layouts in the source: content must
wrap without horizontal overflow. Honour reduced motion. Implement loading,
empty, success and failure states for each real interaction. Preserve the user's
input if a save fails. Do not show a successful submission before its write succeeds.

## 2. Config and state

The platform supplies `window.SimSense` in installed Sims. Use the live SDK guide
for method signatures, result shapes, units and limits. Match configuration keys
to manifest inputs and render a useful state while settings load. State belongs
to one Sim; matching namespace names alone do not share data between Sims.

Decide who may read and write each kind of data before building its interactions.
Ordinary state, events and media storage are visible to admitted viewers. For
private submissions, declare the namespace permissions in kit source before first
use; read the authoring guide's `source` topic for the manifest schema. Sim
visibility and namespace permissions are separate controls. A private namespace
does not make an event or uploaded file private.

Use the SDK's append operation for permitted submissions, reusing the same
idempotency key and payload after an uncertain response. Owner-only dashboards
must use authorized reads; cross-Sim reads also require an explicit reader grant
and an authenticated owner session. Private state is not broadcast: poll it rather
than expecting subscriptions or conditions to reveal it.

Use [agent design](../kit-agent-design/SKILL.md) when an agent connects experiences,
and [automation design](../kit-automation-design/SKILL.md) for events that wake it.
Keep binary media in supported storage and store references in state.

Never use browser storage as a substitute for shared, durable kit data. Never
embed credentials or account-specific IDs. Use textContent for untrusted text
and validate received values before using them in HTML or calculations.

## 3. Be precise about previews

The private sample preview supplies getConfig, getAll and subscribe only.
Other methods can be absent even when window.SimSense exists. Check the actual
method before calling it. When a write method is unavailable, offer an explicitly
labelled local demonstration or a clear "Available after setup" state. Never
claim that sample feedback was stored in the person's account.

The preview blocks network calls, remote scripts, workers, nested frames and form
submission. Use local button event handlers for demonstration interactions.
Sample data should show how the screen looks while keeping missing/live data
distinct. Live telemetry must never fall back to invented current readings.

Save and validate after editing. The draft preview tool returns HTML, not proof of visual inspection. Inspect it with your own browser tools when available or give the owner the web review link. Explain which live behaviors require a private installation.

Use the [welcome example](../kit-source-authoring/references/welcome-kit.json) for
a small config-driven Sim. For state and agent output, use the
[feedback example](../kit-automation-design/references/feedback-kit.json). Its
screen shows the summary's scope and age, so an older result is not presented as
current. Test empty data, changed data,
read failure and narrow layouts as well as the happy path.

For runtime timestamps, prefer ISO UTC strings copied from platform context and
parse them with `Date.parse` in the Sim. Copy receipt ages as seconds and calculate
freshness in JavaScript. Reject invalid or future timestamps, and check that stored
objects are objects rather than JSON strings during installed verification.

## Output checklist

- The intended behavior is implemented in saved kit source.
- Related configuration and data paths agree.
- Validation and sample inspection are reported separately from installed tests.

## Continuous improvement

Correct failures demonstrated by validation or inspection. Preserve the person's
choices and report any remaining uncertainty in the web review handoff.

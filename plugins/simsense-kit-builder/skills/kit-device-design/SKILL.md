---
name: kit-device-design
description: |
  Declare plain-language device roles and setup guidance for a SimSense kit.

  Perfect for:
  - Choosing the physical capabilities a kit needs and how owners connect them
  - Matching telemetry, units and commands to the kit's behavior

  Not ideal for:
  - Pairing live hardware or sending device commands while authoring
---

# Design the kit's physical connections

## CRITICAL: A requirement is not a connected device

Read `get_kit_authoring_guide` topics `automation` and `source` for the current
device contract. Work in the draft through [source authoring](../kit-source-authoring/SKILL.md).
Declaring a device does not pair hardware, grant access or prove compatibility.

## 1. Establish what the kit must sense or do

Start with the physical outcome. A camera and a people-counting stream are
different capabilities: a camera alone does not promise a count. A motion sensor
does not establish occupancy. Identify the actual measurement or command needed.

Use a documented device contract or an authorized capability read to establish
stream names, value types, units, timestamps and available commands. If those
details are unknown, ask the consequential question or leave that integration
explicitly unresolved. Never invent `temperature`, `count` or command names from
a capability label. Keep example readings separate from observed readings.

For `get_device_readings`, `ageSeconds` measures time since platform receipt; it is
not a device measurement timestamp. If deriving a display time, label it as an
approximate report time. Respect `quality`, `declared`, `nonconforming` and
`staleDeclaration` as well as the unit; a numeric value alone is not a usable
measurement. Recheck these fields against the client's current output schema.

## 2. Describe a portable requirement

Use one stable `devices[].key` per role, a human label and a plain-language purpose describing the desired outcome.
Do not assign a capability category; devices declare their own abilities. Keep real device IDs out of source. Installation binds the
role to an owner's device. Mark a requirement optional only when the kit has a
useful path without it, and explain that path in its setup/runtime guidance.

For a welcome display, this declaration lets setup offer a simple browser first:

```json
{
  "key": "welcome_screen",
  "label": "Welcome screen",
  "displaySim": "welcome",
  "purpose": "Show the welcome Sim where visitors arrive.",
  "optional": true,
  "fulfillment": ["open_url", "screen", "hardware_later"],
  "setupHint": "Open the Sim on a nearby screen and check it is readable from the entrance."
}
```

`fulfillment` describes setup choices; it does not add sensing or command support.
`displaySim` names a Sim key in the same manifest and explicitly requests screen
assignment; it is not a device category. Opening a URL supplies no sensor data. Keep `setupHint` about placement
or connection, and use a setup skill for a longer device-specific procedure.

A sensor role needs no category:

```json
{
  "key": "visitors",
  "label": "Entrance counter",
  "purpose": "Count people entering the shop, without counting departures.",
  "optional": false,
  "fulfillment": ["hardware_later"],
  "setupHint": "Place the counter at the entrance and verify entry and exit separately."
}
```

The user's personal agent checks the owner's actual declarations during setup. Available devices
are candidates for inspection, not proven matches. A suitable declared contract
without fresh usable readings is supported but unverified. Ask for missing
contract information before writing exact predicates or command calls.

## 3. Connect the requirement to behavior

An agent refers to the installed resource as `{{device_key}}`. A condition refers
to the same declaration through `sources[].requirementKey`, with its own local
source alias. Use [automation design](../kit-automation-design/SKILL.md) for that
wiring and [agent design](../kit-agent-design/SKILL.md) for interpretation.

A purpose does not automatically translate condition paths or command names.
Changing a bound device can require those instructions and conditions to change.

Handle an unbound optional device, unavailable readings, stale timestamps and
unexpected units explicitly. Show "Waiting for the sensor" or the last reading's
age instead of manufacturing a healthy result. Device recommendations may name a
model and explain why it helps, but compatibility depends on the actual device declaration and verified readings.
Set `recommendation.creatorTested` to true only after the creator confirms a real
test of this kit on that model; a product specification is not that evidence.

## Output checklist

- Device roles and data/command contracts match the requested physical outcome.
- Setup can explain each requirement and the optional-device path.
- Source validates; hardware operation is reported separately and only if tested.

## Continuous improvement

When real hardware exposes a mismatch, correct the specific contract and the
dependent Sim, condition or agent. Do not generalize one model's fields to a whole
capability category.

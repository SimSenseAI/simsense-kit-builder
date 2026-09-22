# Verify the feedback example

This is synthetic source. Parsing it is not evidence of an installed agent run.
The fifteen-minute schedule is a deliberate example choice, not a default for
unrelated kits. Configure a cadence appropriate to the actual request.

## Source and sample checks

- Validate the whole source package with the current platform contract.
- The Sim emits `feedback.submitted`; the condition counts that exact event type
  within 3,600 seconds; the runtime reads at most the latest 100 matching events
  without a time filter. The summary scope is deliberately separate from the
  condition window.
- The condition uses `responses` locally and the declared Sim key `feedback` as
  its requirement. Its trigger uses `feedback_ready`, the condition key.
- The runtime writes `summary.result`; the Sim reads/subscribes to `summary` and
  displays the result's scope and ISO UTC update time. The runtime copies that
  time from platform context; the Sim parses it instead of trusting model date arithmetic.
- Without write APIs, pressing the button labels the action as a preview and
  does not claim anything was saved. A missing summary stays an honest empty state.
- A failed emit retains the entered text and submission ID. A retry can create
  another event, but the runtime must deduplicate the stable submission ID.
- At 360px width, labels, controls and summary text remain readable without overflow.

## Authorized installed check

Use a private installation and synthetic feedback, then remove the test resources.
Do not perform these writes simply because this reference was loaded.

1. Submit two different thoughts. The threshold has not been met.
2. Submit a third. The met event can wake the agent, which reads and summarises
   those inputs. Inspect the stored summary and verify its three unique IDs.
3. Submit a fourth while the condition is already true. Do not expect another met
   event solely from staying above the threshold; the periodic reconciliation
   includes the new entry on a later run.
4. Replay an event with the same submission ID. A repeated wake replaces the
   summary and does not add a duplicate to its entryIds or reported counts.
5. Advance beyond the condition window. The clearing event can reconcile the
   latest 100 events again; it must not claim there is no feedback merely because
   the triggering window is empty.
6. Force a read or write failure using an isolated test setup. The agent reports
   the failure rather than success; previous results are retained and visibly age.
7. If more than 100 events are in scope, the summary still says it covers at most
   100 recent events. Do not describe it as a complete audit or a permanent archive.

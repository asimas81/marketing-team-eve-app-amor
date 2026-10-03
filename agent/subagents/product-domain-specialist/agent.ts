import { defineAgent } from "eve";

/** Consultative product and domain review, selected by the lead when the task needs it. */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Review product truth, domain terminology, claims, constraints, and risks before marketing work proceeds. " +
    "Use for campaign strategy review, specialized markets, contested claims, or a request to interpret " +
    "domain-specific evidence. Return a structured advisory for the lead to pass to the craft specialist. " +
    "The caller supplies the relevant approved Product Context, Domain Pack when active, campaign " +
    "brief, source references and versions in the message. This is a consultative review, not " +
    "business approval or publication.",
  model: "anthropic/claude-opus-5",
});

import { defineAgent } from "eve";

/** Creative production planning and review for visual and multimedia deliverables. */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Turn approved strategy or copy into a creative brief, visual direction, carousel plan, video " +
    "script or storyboard, product book outline, landing page design spec, or reviewable set of " +
    "variants. Use for visual and multimedia production planning or repurposing existing content. " +
    "The caller supplies Product Context, domain advisory when relevant, approved source copy, " +
    "campaign goal, channels, formats and constraints in the message. Return explicit production " +
    "specifications and review findings; rendered files require a connected generation and asset " +
    "service. Publication and deployment are separate approved actions.",
  model: "anthropic/claude-opus-5",
});

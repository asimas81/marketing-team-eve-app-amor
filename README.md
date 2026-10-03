<img width="2048" height="768" alt="eve Marketing Agent Template banner" src="https://github.com/user-attachments/assets/b72d9959-5bed-4b86-a40a-7fc7bfe8fe80" />

# Marketing Team eve Template

[![Agent Stack](https://img.shields.io/badge/Agent%20Stack-000?style=flat-square&logo=vercel&logoColor=FFF&labelColor=000&color=000)](https://vercel.com/kb/agent-stack)
[![MIT License](https://img.shields.io/badge/License-MIT-000?style=flat-square&logo=opensourceinitiative&logoColor=white&labelColor=000&color=000)](LICENSE)

Run a team of marketing agents built on [eve](https://eve.dev). You bring work to a team lead: a launch to plan, posts to write, a creative concept to develop, or a page that isn't converting. The lead briefs the right specialist and hands back what they produced.

You talk to it in the Next.js web chat, Slack, or the eve terminal. It delivers real work in the tools you already use: blog drafts in Notion, social drafts in the conversation, email campaigns in Resend.

Template version: **0.1.0**. Based on [vercel-labs/marketing-team-eve-template](https://github.com/vercel-labs/marketing-team-eve-template), with Eve 0.69.0 and a Next.js web frontend. See [starting a new project](#starting-a-new-project) before linking cloud resources.

## What using it looks like

> **You:** We're launching workspace templates next Thursday. Can you draft the announcement posts?
>
> **Lead:** On it. I'll check the brand context and brief the social media coordinator.
>
> **Lead:** Done. Three drafts are ready to review: an X thread, a LinkedIn post, and a Bluesky post. Nothing is published yet, so tell me what to change before launch morning.

Anything irreversible, like sending an email campaign, pauses for your approval first. You get an approve or deny button in Slack or the terminal before it goes out.

## Starting a new project

Use this repository's **Use this template** action on GitHub, then clone the newly created repository. Each project should have its own Git history, Vercel project, Blob store, and connector configuration. Keep the template's MIT license and upstream attribution.

Requirements: Node.js **24.x**, pnpm **11.22.0**, and a Vercel account with access to the configured models and Sandbox. The Vercel CLI is installed as a development dependency; a global installation is unnecessary.

From the new repository's root:

```bash
corepack enable
pnpm --version
pnpm install --frozen-lockfile
pnpm validate
```

`packageManager` selects pnpm 11.22.0 through Corepack. If Corepack is unavailable, install that exact pnpm version with your package-manager setup first. Keep `pnpm-lock.yaml` in Git; use `--frozen-lockfile` for fresh installations. Validation checks lint, backend and frontend types, and Eve discovery without requiring project credentials.

### Link and configure this project's resources

```bash
pnpm exec eve link
```

Select or create the Vercel project for this new application. In that project's dashboard, connect these resources and set the connector UIDs in both Development and Production as appropriate:

| Resource | Configuration |
| --- | --- |
| Vercel AI Gateway | Access and credits for the lead and specialist models, including calls with tools |
| Vercel Sandbox | Project access for the existing six agent sandboxes and their skill files |
| Vercel Blob | A dedicated public Blob store attached to this project; retain the generated environment configuration |
| Notion through Vercel Connect | `NOTION_CONNECTOR`: the new connector UID |
| Resend through Vercel Connect | `RESEND_CONNECTOR`: the new connector UID |
| Slack through Vercel Connect | `SLACK_CONNECTOR`: the new connector UID, when using Slack |

[.env.example](./.env.example) documents connector variables; it contains example UIDs, not working credentials. After provisioning or changing integrations, refresh the local environment:

```bash
pnpm exec vercel env pull .env.local
pnpm dev:all
```

Open the local URL printed by Vercel. For a fixed loopback address, use `pnpm dev:all --listen 127.0.0.1:3010`. Use `pnpm dev` instead for the terminal interface. Run one of these modes at a time for the same agent.

Never copy another project's `.env.local`, `.vercel`, `.eve`, or build output. The new Blob store starts without brand context, preferences, and handoff artifacts. Establish the new product's context through the product marketer. Each user authorizes Notion and Resend through the connection flow; connector UIDs do not replace that authorization.

The lead is configured as `google/gemini-3.8-flash`; all seven specialists use `anthropic/claude-opus-5`. These values live in each `agent.ts`. Verify model access with a delegated request that uses a tool. A successful plain-text model call alone does not establish tool-call access.

### Channels and deployment

The web chat is ready for local development. Its production Eve API currently accepts Vercel OIDC authentication, while local sessions use `localDevUser` in `agent/channels/eve.ts`. Before offering browser chat to end users, configure the application's session authentication and pass it to the Eve client; deploying the starter does not add a public user-login system.

For Slack, enable triggers on the connector and register `/eve/v1/slack` as the destination on the deployed application. Conversation starter prompts also require the Agents and AI Apps feature, the `assistant:write` bot scope, and the `assistant_thread_started` and `app_home_opened` trigger events. See `agent/channels/slack.ts` for the channel configuration.

After linking the project and provisioning its resources:

```bash
pnpm build
pnpm build:web
pnpm exec eve deploy
```

`eve build` prepares the Vercel sandboxes and requires the linked project's credentials. `vercel.ts` composes the Eve service and `apps/web` frontend; deployment runs through `eve deploy` from the repository root. The Windows development launcher in `scripts/eve-dev.mjs` preserves this layout without relying on Unix shell syntax.

Before an email campaign, verify the sending domain and create at least one segment in Resend. Review a draft and its approval flow before sending to an audience.

## The team

| Specialist | Owns | Hands back |
| --- | --- | --- |
| `product-marketer` | Positioning, messaging, competitive alternatives, and the shared brand context document | The brand context document itself |
| `content-marketer` | Long-form: blog posts, landing pages, case studies, newsletters, docs | A Notion page link |
| `social-media-coordinator` | Short-form for X, LinkedIn, Threads, Bluesky, and Mastodon | Drafts in the conversation |
| `seo` | Page and site audits, hierarchy and internal linking, JSON-LD schema, templated page sets | Recommendations, long audits as artifacts |
| `email` | Reworking existing copy for the inbox, then building, targeting, and sending in Resend | A Resend campaign link |
| `product-domain-specialist` | Reviewing product and domain facts, terminology, claims, constraints, and risks | A structured advisory for the next specialist |
| `creative-producer` | Turning approved strategy and copy into creative briefs, visual specifications, storyboards, and reviewable variants | Production specifications and review findings |

The existing workflow shares one **brand context document**, a short file describing what one product is, who it's for, and what the team claims about it. The product marketer maintains it; the original specialists read it at the start of a task. The two new specialists receive the relevant approved context in the lead's brief. The future Marketing OS will store Product Context separately for each Product.

Each specialist has a distinct job: the product marketer decides what the team claims, the content marketer writes long-form copy, `seo` decides which pages should exist, `social-media-coordinator` drafts short-form, and `email` publishes to an audience. Newsletters route through two of them: the content marketer writes the prose, then the email specialist adapts it for the inbox and sends it through Resend, so newsletters still get the content marketer's planning and editing passes.

## How it works

- **One lead, seven specialists.** The lead loads the brand context and your preferences, writes a brief for the right specialist, and hands back what they produce. It never writes deliverables itself.
- **Every brief is self-contained.** Specialists start fresh each time, with no shared conversation history, so the lead's brief carries everything. The original five also read the global brand context; the new two use the approved task context supplied in the brief.
- **Delegation goes one level deep.** Specialists do their own research and edit their own drafts against a written rubric rather than spawning further agents.
- **Nothing irreversible happens without you.** Sends and deletes in Resend, and page moves in Notion, all wait for your approval. Drafting stays friction-free. The email specialist also only sees 47 of Resend's roughly 85 tools, so account administration is out of reach entirely.
- **Slack pins four starter prompts** in a fresh conversation: sharpen our positioning, write a blog post, draft social posts, review a page's SEO.

The two new specialists are the first execution-plane step toward the [Marketing Management OS PRD](./docs/marketing-management-os/PRD.md) and [agent topology](./docs/marketing-management-os/AGENT_TOPOLOGY.md). They work from approved context included in the lead's brief. The Product Context, Domain Pack, creative asset, approval, and campaign APIs are planned, not connected here yet. The creative producer currently returns production specifications; it does not render image or video files. The original five specialists, Eve channels, and web chat remain in place.

The full approval matrix, the credential model, and the reasoning behind each boundary live in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Local development

| Command | What it does |
| --- | --- |
| `pnpm install --frozen-lockfile` | Install the exact locked dependency tree |
| `pnpm dev` / `pnpm dev:eve` | Eve terminal interface |
| `pnpm dev:all` | Eve and Next.js through the Vercel service router |
| `pnpm dev:web` | Frontend only; use `dev:all` for connected chat |
| `pnpm validate` | Lint, both TypeScript projects, and Eve discovery |
| `pnpm check` / `pnpm fix` | Ultracite check and formatting |
| `pnpm typecheck` | Agent, service configuration, and frontend types |
| `pnpm exec eve info` | Discovered agents, tools, skills, connections, and diagnostics |
| `pnpm build` / `pnpm build:web` | Eve and Next.js production builds |
| `pnpm exec eve deploy` | Deploy the linked project to production |

## Template releases

The template has its own version, separate from the Eve package version. Version **0.1.0** includes the Eve 0.69 migration, all five specialists, the web chat, and Windows development support. Dependency versions are recorded in the lockfile.

Keep `main` ready to serve as the source of new projects. For each template release, update `package.json`, validate a clean installation, and publish an annotated Git tag and GitHub release with the same version, such as `v0.1.0`. Use patch versions for compatible fixes, minor versions for template improvements during 0.x, and 1.0 once the base is established across real projects.

Projects created with **Use this template** have independent histories and do not receive template changes automatically. Record the source repository, version, and commit in each derived project's README. Keep that origin record when the new project's own version changes. To reproduce an older template exactly, start from its tagged source archive; **Use this template** normally uses the default branch.

Before publishing a template release:

1. Install a clean copy with Node 24 and `pnpm install --frozen-lockfile`, without local environment files or generated folders.
2. Run `pnpm validate` and `pnpm build:web` in that copy.
3. In a linked development environment, run `pnpm build` and exercise chat, a specialist tool, session resumption, and approval handling. Record any provider-access limitation separately from static validation.
4. Include `apps/web`, `scripts`, `vercel.ts`, the lockfile, and `.env.example` in the release. Exclude credentials, cloud-project links, local assistant settings, dependencies, and generated output.

## Under the hood

| Layer | Technology |
| --- | --- |
| Agent framework | [eve](https://eve.dev) |
| Language | TypeScript (strict, ESM), Node 24.x |
| Chat surfaces | Next.js web chat, Slack via Vercel Connect, the eve dev TUI |
| Long-form deliverables and briefs | Notion (MCP) |
| Social drafts | Conversation, until a publishing connection is added |
| Email campaigns | Resend (MCP) |
| Shared state and files | [Vercel Blob](https://vercel.com/docs/vercel-blob) |
| Model access | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) |
| Skill reference files and `bash` | [Vercel Sandbox](https://vercel.com/docs/sandbox) |
| Lint and format | [Ultracite](https://www.ultracite.ai/), a [Biome](https://biomejs.dev/) preset |

## Customizing

The agent auto-updates as you edit these files. [`docs/CUSTOMIZING.md`](./docs/CUSTOMIZING.md) is the full walkthrough, with recipes for adding a specialist, skill, tool, or connection.

| To change | Edit |
| --- | --- |
| Who is on the team | Add a directory under `agent/subagents/`; its `description` is all the lead sees when routing |
| The lead's behavior | `agent/instructions.md` |
| A specialist's craft | Its `instructions.md` and `skills/` |
| Voice and banned words | `references/banned-words.json` in each `<surface>-style` skill |
| Approval gates | The tool lists in each `connections/*.ts` |
| What the email agent can reach | `ALLOWED_TOOLS` in `connections/resend.ts` |
| Models | `agent/agent.ts` and each specialist's `agent.ts`, or `/model` in the TUI |

Specialists don't have to live in this repo. eve's [remote agents](https://eve.dev/docs/guides/remote-agents) let the lead delegate to an agent in its own deployment, with its own skills, connections, and release cycle:

```ts
// agent/subagents/paid_ads.ts
import { defineRemoteAgent } from "eve";
import { vercelOidc } from "eve/agents/auth";

export default defineRemoteAgent({
  url: () => process.env.PAID_ADS_AGENT_URL ?? "https://your-paid-ads-agent.vercel.app",
  description:
    "Plan and write paid search and social ads: audience, offer, and the copy variants to test. " +
    "Pass the campaign goal, the audience, the budget, and any brand constraints in the message.",
  auth: vercelOidc(),
});
```

Set `PAID_ADS_AGENT_URL`, and the lead picks the specialist up from its `description` exactly as it does the local ones. Useful when a specialist needs credentials or a release cycle you'd rather keep out of this repo, such as ad platform access.

## Learn more

| Link | Covers |
| --- | --- |
| [Run a marketing team from Slack with eve](https://vercel.com/kb/guide/marketing-team-eve) | The guide to this template, end to end |
| [eve documentation](https://eve.dev/docs/introduction) | The framework powering this agent |
| [eve subagents](https://eve.dev/docs/subagents) | Delegation, fresh sessions, routing descriptions |
| [eve skills](https://eve.dev/docs/skills) | Load-on-demand skills and reference files |
| [Human in the loop](https://eve.dev/docs/human-in-the-loop) | The approval gates above |
| [Vercel Connect](https://vercel.com/docs/connect) | Notion, Resend, and Slack credentials |

Deeper internals live in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and agent guidance lives in [`AGENTS.md`](./AGENTS.md).

## Related templates

- [eve Sanity Copilot](https://github.com/vercel-labs/sanity-copilot-eve-template)
- [eve Typefully Agent](https://github.com/vercel-labs/typefully-eve-template)
- [eve Content Agent](https://github.com/vercel-labs/eve-content-agent-template)

# AS-IS

## Escopo e evidência

Fotografia da árvore original em 2026-10-03, antes da adição dos dois especialistas descritos em [AGENT_TOPOLOGY](./AGENT_TOPOLOGY.md). Naquela leitura, `node_modules` e `.git` não estavam presentes; a análise de comportamento abaixo deriva do código e das instruções, não de execução em produção. O [mapa existente](../ARCHITECTURE.md) e o [guia do repositório](../../AGENTS.md) descrevem o estado corrente.

## Componentes existentes

| Camada | Implementação observada | Limite atual |
| --- | --- | --- |
| Entrada | `agent/channels/eve.ts` para TUI/web e `agent/channels/slack.ts`; o canal Eve usa `localDevUser` no desenvolvimento e OIDC em produção | O README informa que ainda falta autenticação de sessão para usuários finais do browser |
| Orquestração | `agent/agent.ts` com `google/gemini-3.8-flash` e `agent/instructions.md` | O lead lê contexto e preferências, monta um briefing completo e delega em sequência; não produz o material |
| Especialistas | Cinco diretórios em `agent/subagents/`, todos com `anthropic/claude-opus-5` | Cada invocação começa sem herdar contexto, ferramentas, conexões ou sandbox; cada especialista faz sua pesquisa e revisão |
| UI | Next.js em `apps/web`; `/`, `/s` e `/s/[sessionId]` renderizam `AgentChat` | Chat, retomada de sessão, anexos, autorização de conexão, perguntas e aprovações; não há telas de produtos, campanhas, biblioteca ou administração |
| Estado compartilhado | Um `brand-context/brand.md` em Vercel Blob, preferências por principal, artefatos Markdown e assets | Um contexto global para a instalação; não há chave de Workspace ou Product, revisão histórica, metadados relacionais ou autorização por recurso |
| Conteúdo | Notion MCP no lead e nas cinco especialidades; `content-marketer` grava a peça final como página | O destino do material depende do workspace Notion do usuário; não há repositório editorial próprio |
| Email | Resend MCP apenas no especialista `email`, com lista de ferramentas permitidas | Campanhas, segmentos e métricas residem no Resend; envios e operações destrutivas usam aprovação do Eve |
| Analytics | `build_tracked_link` para social/email e `post_analytics_report` no social | UTMs consistentes e relatório de números fornecidos; não há ingestão de performance nem atribuição consolidada |

## Fluxo atual

```text
usuário → canal Eve/Slack → lead
  → brand-context global + preferência do principal
  → briefing para um especialista por vez
  → pesquisa, skill e ferramenta do especialista
  → texto na conversa, página Notion, artefato Blob ou campanha Resend
  → link/id e ressalvas retornam ao usuário
```

O `product-marketer` mantém posicionamento e o documento de marca. O `content-marketer` planeja e redige texto longo no Notion. O `social-media-coordinator` entrega posts na conversa. `seo` pesquisa e audita dentro do limite do HTML obtido por fetch. `email` adapta texto existente e opera Resend. Uma newsletter passa por conteúdo e depois por email. Esse encadeamento é uma capacidade a preservar.

## Dados e controles efetivos

- O contexto de marca é um único Markdown de até 20.000 caracteres, sobrescrito sem trava de versão nem aprovação técnica. A skill manda mostrar o documento completo e obter acordo antes de salvar.
- Preferências são Markdown de até 20.000 caracteres, com chave derivada do principal autenticado; `clear_user_preferences` exige aprovação.
- Artefatos são Markdown identificados por ID e gravados no namespace reservado `artifacts/`; têm limite de 200.000 caracteres e funcionam como passagem entre especialistas, não como biblioteca de entregáveis da interface.
- O store Blob usado pelo código aceita objetos com acesso `public`; os namespaces reservados ficam fora das ferramentas genéricas de asset. Os artefatos são lidos por caminho autenticado da API Blob, mas não se deve presumir isolamento por Workspace que o código não implementa.
- O Notion é integrado por OAuth por usuário. `move-pages`, `update-data-source` e `update-view` exigem aprovação; criar página fica livre. A aprovação depende do nome da ferramenta remota, não de uma entidade de campanha local.
- Resend usa `tools.allow` e aprovação para `send-broadcast`, `send-email`, `send-batch-emails` e operações destrutivas. Há revisão de copy e conformidade antes do envio no prompt do especialista, mas não uma trilha de aprovação de negócio persistida pela aplicação.
- O frontend renderiza a solicitação de input/aprovação produzida por Eve. Ele ainda não implementa papéis, escopos Workspace/Product, fila de revisão ou separação entre aprovar material e autorizar o ato de enviar.

## Lacunas para Marketing Management OS

Não existem entidades persistidas de Workspace, Membership, Product, Product Context Pack, Domain Pack, Campaign, Brief, Deliverable, Approval, publicação ou métricas. O `brand-context` global mistura empresa e produto e gera risco de usar um produto em trabalho de outro. Links Notion e IDs Blob não são um catálogo navegável. A UI não oferece fluxo de planejamento, revisão, histórico ou gestão de contexto. O lead escolhe especialidade, mas recebe pouco estado estruturado para saber qual produto, versão de contexto e campanha cada pedido deve usar. Conhecimento vertical hoje só poderia entrar por instruções/skills ad hoc, o que faria os cinco especialistas acumularem regras de segmento.

## Ativos a manter

Manter Eve, a descoberta por filesystem, o lead e as cinco responsabilidades, a passagem sequencial de trabalhos, as skills de qualidade e estilo, as fronteiras de evidência em SEO/email, os canais existentes, Resend com lista permitida e as aprovações de envio. O app Next.js existente deve se tornar a base da interface própria, sem perder o chat e a retomada de sessões.

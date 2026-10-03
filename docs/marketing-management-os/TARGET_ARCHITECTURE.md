# TARGET_ARCHITECTURE

## Decisão arquitetural

Evoluir o app Next.js existente para o plano de controle e a interface do Marketing Management OS. Usar um banco relacional transacional, recomendado PostgreSQL, como system of record para Workspaces, Products, versões de contexto, campanhas, entregáveis, decisões e auditoria. Manter Vercel Blob para binários e documentos grandes, Eve para sessões e execução de agentes, Resend para operação de email e Notion como integração opcional de importação/exportação. A escolha do provedor PostgreSQL fica para a implementação; a decisão essencial é ter transações, chaves estrangeiras e isolamento por Workspace.

```text
Browser / Slack / TUI
       │
       ├── Next.js: login, Workspace, produtos, campanhas, revisão, biblioteca
       │       └── API/BFF + autorização → PostgreSQL (fonte de verdade)
       │                                └── Blob privado (arquivos e snapshots)
       └── Eve: lead → sete especialistas
                    ↑       ↓
          Context Gateway / ferramentas de domínio
                    │
          Product Context versionado + Campaign Brief + Domain Pack
                    │
          Resend (execução) / Notion opcional / web (pesquisa)
```

## Fronteiras

| Componente | Responsabilidade | Regra |
| --- | --- | --- |
| App/API | Identidade, memberships, CRUD, validação, versões, workflow, consultas e projeções da UI | Toda mutação exige `workspace_id` derivado da autorização; IDs fornecidos pelo modelo não concedem acesso |
| Banco | Entidades, relacionamentos, estados e trilha de auditoria | Unicidade e integridade por Workspace; transição de estado atômica com versionamento otimista |
| Blob | Assets, anexos, documentos de origem e snapshots pesados | Chave por Workspace/Product, metadados e ACL no banco; downloads assinados e tempo limitado |
| Eve | Raciocínio, pesquisas, delegação e produção de propostas | Agente recebe um contexto materializado e identificado por versões; não decide autorização de recursos |
| Context Gateway | Montagem determinística do briefing | Resolve Workspace, Product, Campaign e políticas; retorna apenas fatos autorizados e versões fixadas |
| Product/domain specialist | Subagente Eve consultivo, acionado conforme pack/policy/risco | Produz advisory versionado; não altera os outros especialistas nem grava contexto canônico diretamente |
| Creative producer | Subagente Eve de produção criativa | Transforma brief e copy em especificações/ativos por adapters; OS registra assets, versões, custo, direitos e revisão |
| Resend | Templates, segmentos, envios e telemetria de email | IDs externos referenciados no banco; estado de envio reconciliado após resultado/webhook |
| Notion | Interoperabilidade opcional | Importar/exportar e guardar URL/ID externo; perda da integração não interrompe o fluxo principal |

## Identidade e multi-tenancy

Introduzir login no web app e mapa estável `principal externo → user_id interno`. Membership define papel por Workspace; permissões de Product podem restringir acesso quando necessário. Todo endpoint e ferramenta de negócio deve resolver o Workspace a partir de sessão e membership, conferir Product/Campaign no mesmo Workspace e registrar o ator. Para Slack/TUI, vincular explicitamente canal/principal ao Workspace antes de executar tarefas mutáveis. Não aceitar `workspace_id` do prompt como autoridade. Projetar testes de isolamento entre dois Workspaces como gate de entrega.

## Fluxo de trabalho

1. A UI cria ou seleciona Workspace, Product e Campaign. O Context Gateway resolve um snapshot do Product Context Pack e, se houver, uma versão ativa de Domain Pack.
2. O lead Eve recebe IDs e resumo já autorizados. Decide a ordem dos sete especialistas conforme a tarefa: product/domain review quando necessário, craft de conteúdo/canal e produção criativa após suas entradas. Passa a cada um um briefing completo com referências e versões imutáveis.
3. O especialista pesquisa, cria proposta ou diagnóstico e grava um Deliverable interno associado a Product/Campaign por ferramentas da API do OS. O produtor criativo registra CreativeBrief, CreativeSet, variantes e assets via adapters controlados. A resposta de ferramenta inclui ID e versão, não apenas um link externo.
4. Revisões criam novas versões do Deliverable. Um snapshot específico entra em aprovação. A UI mostra diff, evidência, alertas e destino.
5. Uma aprovação de negócio libera o conteúdo. Um segundo controle autoriza a execução externa quando há publicação/envio. O resultado externo é reconciliado e auditado.

## Evolução sem ruptura

Manter `agent/` como árvore Eve e `apps/web` como frontend. Acrescentar ferramentas pequenas e tipadas para resolver contexto, criar entregável e registrar ações, com lógica de negócio no app/serviço compartilhado. O app pode chamar Eve para geração sem converter componentes de UI em ferramentas de agente. Os cinco especialistas originais continuam com suas responsabilidades, acompanhados pelos dois novos especialistas. O `brand-context` global torna-se legado somente de leitura durante transição e depois é desativado. A passagem por artifact ID permanece útil para tarefas longas, mas cada artefato novo terá dono e referência de negócio.

O estado atual desta transição contém os dois novos subagentes e suas skills. O OS ainda não expõe API de Product Context, Domain Pack, Campaign, Creative Artifact ou geração de mídia; por isso os novos agentes usam snapshots incluídos no briefing e devolvem texto revisável. Esta etapa não implementa persistência, aprovação ou produção de binários do target.

## Qualidades e riscos

- Integridade: contexto, campanha, entrega e aprovação referenciam versões imutáveis; alterações posteriores exigem nova revisão.
- Observabilidade: correlação de `request_id`, sessão Eve, execução de especialista, entregável e ação externa; registrar versões e fontes sem copiar segredos ou dados sensíveis para logs.
- Resiliência: criação interna e envio externo são etapas distintas; idempotency key evita disparos duplicados após retry; estado `reconciliation_required` cobre resposta incerta.
- Segurança: RBAC no servidor, isolamento por Workspace, URL assinada para Blob, allow list de conexões, confirmação do público e proteção contra instruções em material importado.
- Portabilidade: trocar Notion não altera entidades centrais; trocar provedor de email exige adaptador de execução, não reescrever Campaign.

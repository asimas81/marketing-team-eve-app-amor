# ROADMAP

## Sequência proposta

| Fase | Entrega | Dependência e gate de saída |
| --- | --- | --- |
| 0. Decisões e baseline | Validar contratos deste pacote, perfis de usuário, escopo MVP, provedor de identidade/banco e política de retenção; registrar cenários Eve e Notion atuais | Aceitar hierarquia Workspace → Product → Campaign e responsabilidades dos cinco especialistas |
| 1. Fundação multi-tenant | Login web, User/Membership, Workspace, RBAC servidor, banco, auditoria, assets privados e vínculo de sessão Eve | Testes de isolamento entre Workspaces e autenticação web de ponta a ponta |
| 2. Products e contexto | Cadastro Product, Product Context Pack versionado, fontes/claims, editor/diff e aprovação; gateway de contexto para lead e especialistas | Dois Products no mesmo Workspace geram briefings isolados e reprodutíveis |
| 3. Campanhas e entregáveis | Campaign/Brief, WorkItems, catálogo e versões de Deliverable, UI de planejamento/revisão, ferramentas Eve para persistir entregas | Newsletter e peça SEO percorrem especialistas em sequência, com IDs e versões corretos |
| 4. Aprovação e execução | Fila de decisões, RBAC por ação, snapshot/hash, idempotência e reconciliação; integrar gates Eve e Resend | Mudança no conteúdo/público invalida aprovação; tentativa repetida não duplica envio |
| 5. Domain Packs | Manifesto, instalação/binding por Product, Advisor plugável, parecer citado e avaliação | Pack ligado altera somente o Product selecionado; desligá-lo restaura comportamento genérico |
| 6. Migração Notion | Inventário, importador com preview e relatório, corte de escrita, exportação opcional | Fluxo completo funciona sem Notion e conteúdo importado tem rastreabilidade |
| 7. Operação e medição | Métricas com origem, dashboards, monitoramento de execução, retenção e documentação de extensão | Estados externos reconciliados e KPIs distinguem observado de estimado |

## MVP recomendado

Fases 0 a 4 formam o primeiro produto utilizável: Workspace, Product, contexto aprovado, Campaign, entregáveis internos e envio Resend controlado. A fase 5 valida a extensão agnóstica de segmento com um pack piloto e outro Product sem pack. A fase 6 elimina a dependência operacional do Notion. Se o objetivo comercial exigir Notion opcional desde o primeiro lançamento, antecipar o corte de escrita e um importador mínimo após a fase 3, mantendo a migração completa na fase 6.

## Decisões que não devem ficar implícitas

- Identidade: provedor de login e mapeamento de principal Slack/TUI para usuário e Workspace.
- Permissões: papéis iniciais, quem publica Product Context e quem pode autorizar envio, inclusive autoaprovação.
- Armazenamento: provedor PostgreSQL, retenção, residência de dados, backup e política de assets privados.
- Documento interno: formato canônico de rich text e regras de exportação/importação.
- Packs: governança de mantenedores, revisão de fonte e política para packs de terceiros.
- Email: consentimento, segmentos e jurisdições continuam sob responsabilidade operacional do Workspace, com declaração registrada no fluxo.

## Validação por cenário

Executar ensaios com dois Workspaces, dois Products no mesmo Workspace, uma campanha multproduto, mudança de contexto após aprovação, claim sem prova, Advisor fora de escopo, importação Notion parcial, falha incerta no Resend e retomada de sessão Eve. Medir se cada resposta e entrega aponta para a versão certa, se aprovações mostram o payload exato e se nenhum dado cruza a fronteira de Workspace. Seguir as verificações estáticas do repositório (`pnpm validate`) e exercitar o TUI quando houver implementação; este pacote é apenas arquitetura e não altera código.

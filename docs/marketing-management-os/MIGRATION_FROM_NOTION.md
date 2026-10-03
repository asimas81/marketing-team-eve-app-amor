# MIGRATION_FROM_NOTION

## Princípio

Notion deixa de ser o local obrigatório dos briefs e das peças longas. O OS passa a possuir conteúdo canônico, versões, workflow e links de entrega; Notion vira adaptador opcional. Não apagar páginas existentes nem interromper o conector durante a transição. A migração é por Workspace, com inventário, importação verificável e corte explícito.

## Inventário e classificação

Identificar páginas/databases usadas como brand context, briefs, calendários, peças finais e pesquisa. Capturar `notion_page_id`, URL, título, parent, timestamps, proprietário, idioma, relações e permissões acessíveis. Classificar cada item em Product Context, Campaign Brief, Deliverable, Evidence/Asset ou `unmapped`. Não inferir Product apenas por pasta quando houver ambiguidade; mostrar uma fila de mapeamento humano. Registrar fonte e data de captura.

## Conversão

| Origem Notion | Destino OS | Cuidados |
| --- | --- | --- |
| Documento de marca | Product Context draft | Documento atual é global; escolher Product(s) explicitamente, separar claims e obter aprovação antes de publicar |
| Brief/calendário | Campaign e Campaign Brief versionado | Datas/timezone, responsáveis e status precisam de normalização; relações incompletas ficam pendentes |
| Página de blog/landing/newsletter | Deliverable e versão importada | Preservar headings, links, embeds e anexos; guardar Notion ID/URL como origem |
| Pesquisa e referências | EvidenceSource/Asset | Manter URL, autoria, data e permissões; marcar fonte que não pôde ser copiada |
| Resend link em página | ExternalReference | Validar ligação com campanha; não recriar envio ou alterar segmento |

Converter blocos para um formato interno estável (documento estruturado com export Markdown/HTML), preservando o conteúdo original como snapshot. Anexos Notion com URL expirada devem ser copiados para Blob sob autorização apropriada; detectar e reportar falhas. Rich blocks sem conversão fiel ficam marcados para revisão, não são descartados silenciosamente.

## Etapas operacionais

1. Preparar autenticação, Workspaces, Products, catálogo interno e permissões. Importador roda como serviço com escopo do usuário/Workspace, nunca como instrução livre do agente.
2. Fazer inventário e preview com contagem, mapeamento, conflitos e itens sem acesso. Nenhuma escrita canônica ainda.
3. Importar por lotes idempotentes usando `(workspace_id, notion_page_id, last_edited_time)` e checksum; preservar origem, produzir relatório de erro e permitir retomada.
4. Conciliar amostras e totais: páginas, blocos, anexos, links, datas, versões e relações. Corrigir mapeamentos e aprovar Product Contexts importados.
5. Trocar a gravação padrão: `content-marketer` passa a criar Deliverable no OS e link da UI. Exportar ao Notion somente quando pedido. O conector segue disponível para leitura/importação durante janela definida.
6. Após janela de observação, desligar dependência de Notion no fluxo principal por Workspace. Arquivar manifest de migração, preservar referências e oferecer reimportação explícita para conteúdo alterado depois do snapshot.

## Consistência e rollback

Durante a janela, definir uma origem de escrita por tipo de objeto; evitar edição bidirecional automática, que criaria conflitos silenciosos. Conteúdo importado tem `source_revision` e diff se a página mudou depois. Antes do corte, rollback significa voltar o destino de novas peças para Notion, sem apagar registros internos. Após corte, o OS continua dono; exportação não passa a ser canônica. Não migrar tokens OAuth, autorizações de usuários ou histórico de aprovação como se fossem equivalentes. Registrar quem aprovou cada importação e quais páginas ficaram fora.

## Critério de conclusão

Um usuário consegue cadastrar Product, aprovar Product Context, planejar Campaign, gerar e revisar uma peça longa, abrir seu link interno e seguir para email sem conexão Notion. Relatório de importação indica cobertura e pendências; desligar Notion não quebra tarefas novas.

# APPROVAL_MODEL

## Duas decisões distintas

O OS distingue aprovação editorial/estratégica da autorização de uma ação externa. A primeira afirma que uma versão de contexto, brief ou entrega está pronta para uso. A segunda autoriza um payload específico: provedor, conta, destino, audiência, volume, horário, conteúdo/hash e custo quando houver. Aprovar uma peça não equivale a autorizar envio, publicação ou deleção.

O estado `APPROVED` de um [DomainAdvisory](./DOMAIN_ADVISORY_SPEC.md) indica somente que a revisão de domínio passou. O status `APPROVED` de uma versão criativa indica que aquele material foi aceito editorialmente. Ambos são distintos de `ApprovalRequest` para executar uma ação externa.

## Matriz inicial

| Ação | Preparação | Decisão exigida | Execução |
| --- | --- | --- | --- |
| Criar Product/brief/draft | Usuário com papel editor | Sem gate adicional | Grava no OS e audita |
| Publicar Product Context | Diff, claims e fontes | Product owner ou approver | Ativa versão imutável |
| Aprovar Deliverable | Snapshot, fonte, preview e ressalvas | Reviewer designado | Marca aquela versão aprovada |
| Revisar DomainAdvisory | Fatos, constraints, claims, fontes e status | Responsável de Product/domain quando `NEEDS_REVIEW` ou `BLOCKED` | Resolve conflito ou pede correção; parecer `APPROVED` não autoriza execução |
| Aprovar CreativeArtifact | Preview da variante exata, copy, claims, brand fit, acessibilidade, direitos e custo | Reviewer designado | Libera somente aquela versão para possível publicação |
| Exportar draft ao Notion | Destino e preview | Permissão de integração; aprovação se sobrescrever página | Exporta e grava ExternalReference |
| Agendar/publicar em canal | Conteúdo aprovado, conta, horário | Approver com permissão de canal | Ação com idempotência e reconciliação |
| Enviar email/segmento | Preview, from verificado, segmento e tamanho, horário, links, endereço e opt-out | Approver de envio; também gate Eve/Resend no commit | `send-*` e reconciliação do estado |
| Excluir asset/cancelar envio | Alvo e impacto | Papel autorizado; manter gate Eve existente | Audita; cancelamento só se provedor permitir |
| Alterar membership/política | Diff de permissões | Admin do Workspace | Transação e auditoria |

## Modelo de pedido

`ApprovalRequest` guarda `workspace_id`, `target_type/id/version`, `content_hash`, `action_type`, `parameters_hash`, `requested_by`, `required_role`, `status`, `expires_at` e chave de correlação Eve. `ApprovalDecision` registra `actor_id`, `decision`, `reason`, `decided_at`, canal e identidade autenticada. A aplicação valida que o ator é membro com papel apropriado e não aceita decisão via texto do modelo. Política para aprovação do próprio autor deve ser configurável; envio para público real recomenda separação de funções. Mudança no conteúdo, público ou horário invalida a autorização anterior.

## Máquina de estados

`requested → approved/rejected/expired/revoked`; apenas `approved` válido libera a transição autorizada. A execução usa compare-and-swap da versão e idempotency key. `approved → executing → succeeded/failed/reconciliation_required` descreve a ação, não a decisão. Uma resposta incerta do provedor não é tratada como falha segura para tentar novamente; reconciliar pelo ID externo ou idempotency key antes de novo disparo.

## Relação com Eve

Preservar os gates `approval` já aplicados a deletes, movimentos Notion e sends Resend como último bloqueio no ato da ferramenta. O OS acrescenta autorização de negócio antes de expor a ação. Para chat web, Slack e TUI, todas as decisões de negócio devem chegar ao mesmo serviço de aprovação, com sessão autenticada e visualização do mesmo snapshot. A aprovação do Eve, isoladamente, não substitui trilha persistente nem RBAC. O lead e os especialistas recebem apenas o estado aprovado; não podem editar a tabela de decisões.

## Evidência e revisão

A tela apresenta copy final e diff, claims sem prova, Product/pack/brief usados, destino externo e impacto estimado. Em email, conferir consentimento e jurisdições cabe ao dono da lista; o sistema registra a declaração e impede o fluxo quando itens obrigatórios não foram preenchidos. Status de domínio verificado não é alegação de inbox placement. A auditoria retém decisões e snapshots de acordo com política de retenção do Workspace.

Para imagem, vídeo, book ou landing page, a revisão inclui preview renderizado quando houver, dimensões, safe areas, contraste, legendas, links, licenças de assets externos e consentimento de likeness. Uma especificação textual não passa automaticamente nas verificações que dependem de renderização. Publicar, gastar verba ou fazer deploy de produção requer uma autorização de execução separada para a variante e destino exatos.

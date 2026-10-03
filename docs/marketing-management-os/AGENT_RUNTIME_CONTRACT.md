# AGENT_RUNTIME_CONTRACT

## Estado

Contrato alvo para integrar Marketing Management OS (control plane) e Eve (execution plane). Os dois novos subagentes locais existem, mas esta API ainda não está implementada. Nesta etapa, o lead passa snapshots autorizados em `message` e recebe texto revisável; nenhuma resposta deve alegar persistência, asset ou aprovação de negócio sem resultado de ferramenta correspondente.

## Chamada de tarefa

`RunAgentTask` carrega `contract_version`, `agent_run_id`, `requested_by` autenticado, `workspace_id`, `product_id`, `campaign_id` opcional, `task_type`, `source_artifact_ids`, `context_version_id`, `domain_pack_id/version` opcional, `brief_version`, `permissions` e correlation ID. IDs são referências, não autoridade. O OS valida membership e escopo de todos os recursos antes de montar um snapshot mínimo para o agente. A API pode retornar apenas o recorte necessário; o modelo nunca recebe token de acesso ao banco.

`AgentTaskResult` carrega `agent_run_id`, `status`, `summary`, `advisory_id` opcional, `artifact_ids`, `risk_flags`, `approval_required`, versões de entrada e IDs de correlação. Erros de autorização, fonte ausente e falha externa são estados distintos. Retries usam o mesmo idempotency key por operação mutável.

## Product/domain advisory

O payload persistido inclui `workspace_id`, `product_id`, `campaign_id`, `task`, `status` (`APPROVED`, `APPROVED_WITH_CONSTRAINTS`, `NEEDS_REVIEW`, `BLOCKED`), resumo, `product_truth.facts`, `domain_guidance.recommendations`, `constraints.required/prohibited`, `claims.approved/evidence_required/prohibited`, `vocabulary.preferred/avoid`, riscos, assumptions, open questions, referências de Product Context/Domain Pack/Campaign/fontes externas e `downstream_brief.must_include/must_avoid`. O status é resultado de revisão de domínio; aprovação editorial e autorização de execução seguem [APPROVAL_MODEL](./APPROVAL_MODEL.md).

Alterações sugeridas ao contexto usam proposta separada: campo, valor atual, valor proposto, motivo, evidência, impacto e `requires_human_approval`. Não existe operação agent-side para ativar Product Context ou Domain Pack.

## Creative brief e artifact

`CreativeBrief` inclui Workspace/Product/Campaign, objetivo, público, oferta, mensagens, CTA, `source_artifact_ids`, canais, formatos, restrições de marca/domínio, claims, elementos exigidos/proibidos, dimensões/duração, idioma, variantes e métrica. O OS fixa as versões de fonte ao aceitar o brief.

`CreativeArtifact` inclui `id`, `brief_id`, `creative_set_id`, Product/Campaign, tipo, formato, canal, fontes, `asset_ids`, versão, status, `created_by_agent_run`, review/approval status e refs publicadas. `CreativeVariant` identifica master, hipótese, dimensão alterada e formato. `CreativeAsset` guarda provider/modelo, parâmetros, duração/custo de geração, direitos/licença/consentimento e Blob key. A aplicação registra binários e metadados; o agente usa ferramentas controladas como `create_creative_artifact`, `upload_creative_asset`, `create_creative_variant` e `submit_for_review` quando elas existirem.

## Leitura e escrita

Ferramentas de leitura planejadas: `get_workspace_policy`, `get_product_context`, `get_domain_pack`, `get_campaign`, `get_campaign_brief`, `get_campaign_metrics`, `get_artifact`, `list_relevant_artifacts`, `get_brand_guidelines`, `get_approved_claims` e `get_creative_brief`. Ferramentas de escrita planejadas para os novos especialistas: criar advisory/risco/proposta, criar creative artifact/variant, anexar asset e submeter para revisão. Cada ferramenta chama a API do OS com autenticação de serviço e principal delegado verificável; a API autoriza Workspace, Product e ação. Não há acesso direto ao banco nem escrita em Blob genérico como substituto de registro de negócio.

## Geração e implantação

Adapters de `ImageGenerationProvider`, `VideoGenerationProvider`, `VoiceProvider`, `DocumentRenderProvider` e `LandingPageRenderer` ficam atrás de capability configurada por Workspace e orçamento por Campaign. A primeira fase de produção deve validar imagem e variantes sociais, depois landing pages/books e, por fim, vídeo/voz. Landing page tem três níveis explícitos: design spec, page artifact com preview e implementação deployable. Deploy de produção, publicação, envio e gasto têm autorização separada sobre o snapshot final.

## Gates de integração

Antes de ligar as ferramentas ao Eve, confirmar contrato de autenticação de sessão web/Slack, isolamento entre Workspaces, versão imutável de Product Context/Domain Pack, autorização de cada resource ID, trilha de run e operação, reconciliação de falha incerta, contabilização de custo e evals de fidelidade de produto/domínio, claim, handoff, qualidade criativa e prompt injection. O subagente atual não deve ser apresentado como Creative Studio pronto até esses gates passarem.

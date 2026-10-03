# CAMPAIGN_MODEL

## Campanha como unidade de coordenação

Campaign reúne objetivo, público, oferta, Product(s), período, canais, orçamento opcional, metas, brief, trabalhos, entregáveis e resultados. Pertence a um Workspace e não carrega fatos permanentes de Product. Uma campanha multproduto declara Product principal em cada entrega e fixa uma versão de contexto para cada Product envolvido.

## Contrato mínimo

| Área | Campos |
| --- | --- |
| Identificação | `campaign_id`, `workspace_id`, nome, owner, status, período, timezone |
| Estratégia | objetivo, hipótese, audiência/segmento, oferta, mensagem, CTA, mercados e idioma |
| Escopo | Products e `context_version_id`, `domain_pack_version`, canais e destinos autorizados |
| Planejamento | `brief_version`, WorkItems com responsável, dependências, prazo e critério de pronto |
| Medição | metas, KPIs definidos antes do lançamento, UTMs normalizadas, fontes de dados e janela de leitura |
| Execução | Deliverables/version, DomainAdvisory, CreativeBrief/Set/Variants, aprovações, agendamentos, ExternalActions e IDs de provedores |
| Resultado | eventos de envio/publicação, métricas observadas com origem e hora, aprendizados e limitações |

## Estados e transições

`draft → planned → in_production → in_review → approved → scheduled/active → completed → archived`. Pode voltar a `in_production` após rejeição; `cancelled` é terminal para novas ações. O estado da campanha é projeção do conjunto de trabalhos, não substitui o estado de cada entrega. Campanha `approved` não autoriza automaticamente um envio: a aprovação do payload de execução tem escopo próprio.

## Trabalho e entrega

WorkItems tipados (`research`, `positioning`, `domain_review`, `seo`, `long_form`, `creative`, `social`, `email`, `review`, `publish`, `measure`) formam um grafo acíclico simples. Uma newsletter liga `long_form → email → review → send`; uma peça orientada a busca liga `seo → long_form → review`; um kit visual liga `positioning/copy → domain_review quando exigido → creative_brief → creative_set → review → publish`. Entrega contém tipo, formato, canal, Product principal, versão de brief/contexto, corpo ou asset, referências e ressalvas. Revisar gera nova versão e invalida aprovação anterior daquela entrega.

Cada CreativeSet contém CreativeArtifacts independentes, como hero, carrossel, roteiro ou book. CreativeVariant aponta para o master e declara hipótese, dimensão alterada, canal e métrica. A performance referencia a versão efetivamente publicada. Rendering e geração por provedores são etapas de execução rastreadas por custo, modelo e direitos de uso.

## Tracking e medição

Preservar a normalização de `build_tracked_link`, agora derivando `utm_campaign` de um slug estável da Campaign e registrando link por Deliverable. `utm_source` e `utm_medium` seguem vocabulário controlado por canal; `utm_content` identifica variante. Métricas guardam provedor, janela, instante de coleta e granularidade. Resend fornece dados de envio/email; social e SEO exigem conectores ou importação antes de afirmar alcance ou ranking. Nenhum número estimado é persistido como observado.

## UI mínima

Lista e detalhe de campanhas, editor do brief, quadro de WorkItems/dependências, biblioteca de Deliverables com versões e diff, espaço de criativos com CreativeBrief, Sets e variantes, fila de aprovação e painel de resultados com origem de cada métrica. Chat aparece no contexto de uma Campaign/Product, mantendo sessão Eve associada aos IDs para retomada coerente.

# AGENT_TOPOLOGY

## Topologia alvo

```text
UI/API → Context Gateway → lead Eve
                         ├─ product-marketer
                         ├─ content-marketer
                         ├─ social-media-coordinator
                         ├─ seo
                         └─ email
          product-domain-specialist ⇢ parecer contextual quando aplicável
          creative-producer ⇢ produção criativa após estratégia e conteúdo
```

O `product-domain-specialist` e o `creative-producer` são dois subagentes locais Eve, irmãos dos cinco originais. O primeiro é consultivo e só é acionado quando contexto, risco ou política pedem revisão; o segundo transforma estratégia e conteúdo em especificações e, no futuro, assets versionados. Ambos continuam genéricos entre segmentos. A seleção pelo lead segue as descrições `agent.ts`, sem lista fixa na instrução do lead. Product Context, Domain Pack e estado de negócio continuam pertencendo ao Marketing OS.

## Responsabilidades preservadas

| Agente | Entrada adicional | Saída e limite |
| --- | --- | --- |
| Lead | Workspace, Product(s), Campaign, versões fixadas, preferências e parecer opcional | Planeja dependências, delega na ordem necessária e devolve IDs de entregáveis; não redige |
| Product/domain specialist | Product Context, Domain Pack e material da tarefa | Devolve advisory com fatos, restrições, claims, riscos e fontes; não aprova a campanha |
| Product marketer | Product Context draft, fontes e questões abertas | Propõe versões de posicionamento e mensagens; publicação do pack requer aprovação de negócio |
| Content marketer | Brief e contexto do Product | Cria versão de peça longa no OS; preserva planejamento e revisão; não envia email |
| Creative producer | Creative Brief, conteúdo aprovado, design system e parecer de domínio | Planeja ou gera variantes visuais/multimídia conforme ferramentas conectadas; entrega para revisão, sem publicar |
| Social media coordinator | Brief, Product e canais autorizados | Cria variantes curtas versionadas; publicar/scheduling só via ação autorizada |
| SEO | URL, alvo de pesquisa e fontes | Cria auditoria e recomendações com fronteira entre observado e inferido |
| Email | Copy já existente e público | Adapta para inbox, prepara draft no Resend e pede execução explícita; mantém limites de evidência e deliverability |

## Contrato de execução

Cada delegação carrega `workspace_id`, `product_id`, `campaign_id` quando aplicável, `context_version_id`, `brief_version`, `domain_pack_id/version` opcional, objetivo, público, limites, referências e ID de correlação. O servidor valida os IDs antes de montar o briefing. O especialista recebe apenas o recorte relevante do pack; o documento completo e fontes podem ser lidos por ferramentas autorizadas. A saída contém `deliverable_id`, versão, resumo, fontes, ressalvas e próximos passos. Resultado livre em chat continua possível para conversa exploratória, mas trabalho de campanha passa a ter registro interno.

## Entrada do Advisor

O product/domain specialist atua quando o Product tem binding ativo de Domain Pack, uma policy exige revisão ou o lead identifica um claim/risco material. Recebe dados minimizados e retorna advisory com status `APPROVED`, `APPROVED_WITH_CONSTRAINTS`, `NEEDS_REVIEW` ou `BLOCKED`, além de `recommendations`, `constraints`, `claims`, `questions` e `evidence_refs`. Esses estados descrevem somente a revisão de domínio, nunca aprovação de negócio. O lead incorpora o handoff no briefing do próximo especialista. O Marketing OS persiste o advisory e abre tarefa humana para `NEEDS_REVIEW` ou `BLOCKED` quando sua API existir.

## Creative Producer

O fluxo preferido é `Product Context + Domain Advisory + estratégia/copy aprovada → Creative Brief → creative-producer → CreativeSet/CreativeArtifact → review → aprovação → publicação`. O produtor preserva autoria de posicionamento, copy, social e SEO dos respectivos especialistas. Cada formato ou variante é uma entrega vinculada ao mesmo brief e às versões de entrada. Imagens, vídeos, books e landing pages requerem adapters de geração/renderização, asset store, custos e revisão. Na integração atual, o agente devolve brief, especificações, roteiros, storyboards e planos de variantes; não declara arquivos gerados.

## Fluxos compostos

- Peça SEO: `seo` define consulta e evidência; `content-marketer` redige usando o artefato/brief aprovado.
- Newsletter: `content-marketer` cria a peça; `email` adapta e monta o envio; revisão de conteúdo e autorização de envio são decisões separadas.
- Lançamento: `product-marketer` pode propor correção do Product Context; Campaign só fixa a versão publicada após decisão. Conteúdo, social, SEO e email são WorkItems dependentes ou paralelos conforme suas entradas, sempre associados à mesma versão de brief.

## Controle do contexto

Skills genéricas de escrita e estilo permanecem genéricas. Regras de segmento residem no Domain Pack e no parecer do Advisor. Convenções específicas de um canal permanecem com o especialista do canal. O lead não copia conhecimento vertical para sua instrução global. Essa separação permite instalar/remover um pack sem alterar comportamento para outros Products.

# PRD — Marketing Management OS

## Status e escopo

Status: proposta consolidada para revisão de produto e arquitetura. Este PRD incorpora o documento fornecido `MARKETING_OS_PRODUCT_DOMAIN_AND_CREATIVE_SPECIALISTS.md` à visão anterior do Marketing Management OS. Descreve o produto alvo e seus critérios de aceite, não afirma que as capacidades já estejam implementadas. O [AS-IS](./AS-IS.md) registra a base anterior; o [ROADMAP](./ROADMAP.md) ordena a entrega.

## Problema

O template atual oferece um lead Eve, sete especialistas e uma interface de chat, mas não possui registros próprios de Workspace, Product, Campaign, entregáveis, aprovações ou métricas. O contexto de marca em Blob é global. Peças longas dependem do Notion e campanhas de email vivem no Resend. Em trabalho multproduto ou de domínio especializado, um briefing sem fontes e versões pode misturar fatos, introduzir claims incorretos ou espalhar regras verticais pelos especialistas genéricos. Produção visual ainda resulta em especificações de texto, sem catálogo, versões ou revisão de assets.

## Visão do produto

Um Workspace cadastra Products, publica um Product Context Pack por versão, instala Domain Packs quando úteis e planeja Campaigns. O Marketing OS é a fonte de verdade e o plano de controle: identidade, permissões, estado, artefatos, assets, decisões, integrações e métricas. O Eve é o plano de execução: o lead encadeia sete especialistas, inclusive um consultor de produto/domínio e um produtor criativo. Notion é integração opcional. Resend continua executor de email; publicação, envio, gasto e deploy exigem autorização sobre uma versão exata.

```text
Workspace → Product + Product Context → Campaign + Brief
                 ↑ Domain Pack opcional   ↓
      Product/Domain Advisory → Lead → especialistas de craft
                                      ↓
                  Creative Brief → Creative Set/Artifacts/Variants
                                      ↓
                       Review → Approval → External Action → Metrics
```

## Usuários e necessidades

| Papel | Necessidade principal |
| --- | --- |
| Workspace admin | Configurar membros, políticas, integrações, custos e escopo dos Products |
| Product owner | Manter fatos, oferta, limitações, claims e versões aprovadas do Product Context |
| Domain owner | Curar Domain Pack reutilizável, fontes, restrições e mudanças de versão |
| Marketing owner | Definir estratégia, brief, canais, metas e prioridade de Campaign |
| Editor/creative reviewer | Revisar conteúdo e criativos com fontes, diff, preview e variantes |
| Approver de execução | Autorizar destino, público, horário, custo e payload final de publicação/envio |

## Princípios de produto

1. O OS possui estado de negócio; agentes não escrevem diretamente no banco nem usam memória de sessão como fonte de verdade.
2. Os cinco especialistas originais preservam seu craft. O `product-domain-specialist` fornece verdade, limites e riscos; o `creative-producer` transforma estratégia e conteúdo em ativos. Nenhum deles assume aprovação de negócio.
3. Um agente genérico atende vários segmentos. Product Context descreve o produto; Domain Pack descreve conhecimento reutilizável; Campaign Brief descreve a tarefa temporal.
4. Toda saída relevante aponta para Workspace, Product, versões de contexto/pack/brief, fontes, execução do agente e, quando houver, versão publicada.
5. Aprovação editorial e autorização de ação externa são decisões distintas. Mudanças no snapshot invalidam a decisão anterior.
6. Pesquisa pública e inferência são identificadas como tais; conflitos com fontes aprovadas abrem revisão.

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| FR-01 | Gerir Workspaces, membros e papéis | Dois Workspaces não conseguem ler nem alterar recursos um do outro por UI, API ou ferramenta de agente |
| FR-02 | Cadastrar múltiplos Products por Workspace | Cada Product tem owner, estado e Product Context Pack próprio; um pedido fixa o Product alvo |
| FR-03 | Versionar Product Context, claims e evidências | Uma versão publicada é imutável; revisão mostra diff e fontes; trabalhos anteriores mantêm a versão usada |
| FR-04 | Instalar Domain Pack opcional por Product | Ativação, desativação e atualização não alteram outros Products nem reescrevem especialistas genéricos |
| FR-05 | Produzir DomainAdvisory | O especialista retorna um dos quatro estados, constraints, claims, riscos, fontes e handoff; `APPROVED` significa apenas revisão de domínio passada |
| FR-06 | Aplicar política de revisão por domínio/Workspace | Domínio sensível ou claim contestado exige advisory e, quando a política pede, tarefa humana antes da etapa seguinte |
| FR-07 | Planejar Campaign e WorkItems | Campaign fixa Product(s), versões, objetivo, público, oferta, brief, canais, metas e dependências entre trabalhos |
| FR-08 | Persistir entregáveis e versões no OS | Cada entrega tem tipo, proprietário, fontes, ressalvas, estado, versão e vínculo com Campaign; Notion é opcional |
| FR-09 | Criar CreativeBrief e CreativeSet | Um brief pode gerar vários outputs independentes; cada variante declara master, hipótese, mudança e canal |
| FR-10 | Produzir e catalogar assets criativos | Imagem na primeira etapa; depois landing page/book e vídeo/voz. Cada asset registra provider, custo, direitos, Product, Campaign e versão |
| FR-11 | Revisar criativos | Preview, claims, marca, legibilidade, acessibilidade, canal, licença e likeness são avaliados; verificações que exigem render não passam com texto apenas |
| FR-12 | Aprovar e executar ações externas | Aprovação registra ator, snapshot/hash, público, destino, horário e custo; retry não duplica envio/publicação |
| FR-13 | Medir resultados e aprender | Métricas têm origem, janela e versão publicada; variantes podem ser comparadas sem confundir correlação com causalidade |
| FR-14 | Importar conteúdo Notion | Preview, mapeamento humano, importação idempotente e relatório permitem operar sem Notion depois do corte |
| FR-15 | Oferecer interface própria | UI tem Product Context, Campaigns, biblioteca, Creative Studio, revisão, aprovações e métricas, preservando chat e sessões Eve |

## Fluxos principais

### Revisão de produto e domínio

Product owner publica contexto; Domain owner ativa pack quando relevante; Marketing owner cria Campaign. O lead chama o product/domain specialist se pack, política ou risco pedirem. O advisory é registrado. `NEEDS_REVIEW` ou `BLOCKED` gera tarefa para responsável humano e impede o uso do claim contestado. Uma proposta de mudança de pack/contexto entra em revisão, sem mutação automática.

### Produção criativa

Posicionamento, copy e guidance aprovados alimentam CreativeBrief. O creative-producer cria especificação ou usa adapter habilitado para gerar assets, registra outputs por formato/variante e executa revisão de qualidade. Um reviewer decide sobre a versão renderizada. Publicação/deploy ocorre somente após autorização específica. Performance fica ligada à variante realmente publicada.

### Conteúdo e email

Conteúdo longo permanece com o content marketer, social com o coordenador, SEO com o especialista de busca e email com o agente de inbox/Resend. O OS guarda a peça canônica. Uma newsletter passa por content → email → revisão → autorização de envio. O fluxo não requer página Notion.

## Escopo por entrega

O primeiro incremento operacional cobre Workspace, Product, contexto versionado, Campaign, catálogo de entregáveis, identidade, aprovação e email controlado. O incremento de domínio conecta Product Context/Domain Pack ao advisor com persistência e evals. Creative Studio começa com CreativeBrief, CreativeSet, imagens e variantes sociais; landing page e book vêm após preview/render; vídeo/voz após adapters e controle de custo. A [ordem detalhada](./ROADMAP.md) preserva essas dependências.

## Fora do escopo inicial

Agentes distintos por segmento ou por formato de mídia; publicação automática sem policy explícita; execução de paid media e orçamento; interpretação de performance como decisão automática; Notion como sistema de registro; inferência de direitos/licença; garantir conformidade regulatória, entrega na caixa de entrada ou ranking SEO a partir de sinais parciais.

## Requisitos de qualidade e operação

- Isolamento por Workspace em todas as leituras e escritas, inclusive ferramentas Eve e URLs de assets.
- Versionamento e proveniência suficientes para reconstruir uma decisão ou criativo a partir de fontes, prompts/briefs, modelo/provider, run, revisão e aprovação.
- Controle de custo por Workspace/Campaign e por geração/variante; budget cap aplicado antes de chamar provider.
- Idempotência e reconciliação para ações externas; falha de resposta não autoriza repetir envio às cegas.
- Evals de fidelidade ao produto/domínio, claims, qualidade epistemológica, segurança e handoff; para criativos, aderência ao brief, qualidade visual, copy, canal, acessibilidade e exportação.
- Contexto mínimo por tarefa, fontes externas tratadas como dados e conflito com fonte aprovada enviado à revisão.

## Métricas de sucesso

Tempo até primeira campanha revisável; proporção de entregas que usam versões corretas de contexto; taxa de aceitação e correção humana de advisory; claims rejeitados e falsos bloqueios; retrabalho evitado; taxa de variantes aprovadas; custo e tempo por asset; cobertura de direitos; falhas de isolamento; ações externas duplicadas; uso de Notion após corte; utilidade do guidance na avaliação dos especialistas seguintes. Métricas de agente não devem ser otimizadas isoladamente do resultado do trabalho.

## Critérios de pronto para uso

O consultor de domínio só é anunciado como operacional quando Product Context/Domain Pack APIs, permissões, schema de advisory, persistência, versões, rastreio de runs, controles contra prompt injection e evals de isolamento/fidelidade estiverem ativos. O Creative Studio só é anunciado como produtor de assets quando CreativeBrief/Artifact/Asset, storage, provider adapter, custo, versões, review/approval, direitos e evals mínimos estiverem ativos. Os dois subagentes Eve atuais são a estrutura de execução e retornam texto revisável enquanto esses gates não forem cumpridos.

## Questões de produto ainda abertas

Definir provedor de identidade e banco, papéis exatos e autoaprovação, residência/retenção de dados, formato canônico de documento, primeiro Domain Pack piloto, política de packs externos, provider inicial de imagem, limites de custo, critérios para likeness e direitos, e se Notion opcional precisa estar disponível no primeiro lançamento. Essas decisões não alteram a separação entre control plane e execution plane.

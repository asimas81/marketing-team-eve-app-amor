# PRODUCT_CONTEXT_SPEC

## Finalidade

Um Product Context Pack é o conjunto versionado de fatos, escolhas de posicionamento, evidências e restrições sobre um Product. Substitui o `brand-context/brand.md` global como referência operacional dos agentes. É independente de campanha e segmento vertical. O `product-marketer` propõe e mantém conteúdo; um responsável humano publica uma versão que passa a ser usada por tarefas novas.

## Estrutura canônica

| Bloco | Campos mínimos | Critério |
| --- | --- | --- |
| Identidade | nome, descrição concreta, categoria, URLs oficiais, idioma/mercados | Diz o que faz e o que substitui; separa fato de intenção |
| Público | segmento principal e secundários, buyer/user, problema, exclusões | Segmento específico o bastante para orientar pauta e copy |
| Oferta | capacidades, casos de uso, limites, preço/plano quando relevante, disponibilidade | Cada afirmação temporal traz data e fonte |
| Posicionamento | alternativas, diferencial, razão para acreditar, tradeoffs | Comparações têm escopo e evidência; sem superioridade genérica |
| Mensagens | mensagem central, pilares, objeções, CTA, palavras preferidas/vedadas | Cada pilar liga a prova e grau de confiança |
| Voz e marca | tom, exemplos aprovados, restrições de linguagem e visual | Diretrizes aplicáveis a qualquer canal; estilo específico de plataforma fica na skill do canal |
| Claims | texto canônico, classificação `proven/plausible/assumption`, evidências, validade, condições | Claim vencido ou sem prova aparece para revisão antes de uso externo |
| Fontes | URL/asset/entrevista, dono, data, consentimento/licença, trecho referenciado | Fonte é recuperável e jamais vira instrução do agente |
| Questões abertas | dúvida, impacto, quem resolve, evidência necessária | Incerteza permanece visível e não se transforma em fato por repetição |

## Envelope e versões

Metadados: `pack_id`, `workspace_id`, `product_id`, `schema_version`, `revision`, `status` (`draft`, `in_review`, `published`, `superseded`, `archived`), `locale`, `created_by`, `approved_by`, `created_at`, `published_at`, `content_hash`, `source_refs`. Revisões publicadas são imutáveis. Uma versão pode ser retirada de uso para novos trabalhos sem alterar campanhas que a fixaram; trabalhos antigos exibem aviso de contexto desatualizado. Migração de schema é explícita e preserva o original.

## Montagem para agentes

O gateway produz um resumo limitado em tokens: identidade, público, diferenciais, mensagens, voz, restrições e questões relevantes para a tarefa. Claims usados em texto têm ID, grau, condições e fonte. Material extenso fica por referência autorizada. A ordem de precedência é: política de segurança e autorização do sistema; Product Context publicado; Campaign Brief aprovado para a tarefa; preferência pessoal de fluxo; parecer do Advisor como recomendação. Campaign Brief pode escolher um ângulo, mas não transformar claim incerto em comprovado.

## Governança

Editar cria draft baseado na versão ativa. O diff mostra mudanças em fatos, público, claims e restrições. Publicação requer revisão humana por papel com permissão de Product, registra decisão e ativa nova versão atomicamente. A aplicação sinaliza campanhas em aberto afetadas; não as atualiza silenciosamente. Produtos recém-cadastrados podem ter pack incompleto e estado `needs_context`; a UI conduz entrevista com o `product-marketer` antes de gerar material que dependa de claims.

## Relação com os dados atuais

As seis seções do brand context existente mapeiam para identidade, público, posicionamento, mensagens, voz e questões abertas. Elas são ponto de partida de importação, não prova de que um documento global pertença a todos os Products. Preferências por usuário permanecem separadas.

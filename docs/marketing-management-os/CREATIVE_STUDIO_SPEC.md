# CREATIVE_STUDIO_SPEC

## Papel

`creative-producer` é um subagente Eve genérico e multiformato. Recebe estratégia, copy, Product Context, Domain Advisory, Campaign, brand/design system e requisitos de canal. Produz outputs criativos revisáveis. Product marketer continua dono de posicionamento; content marketer, de narrativa longa; social, de copy e convenção da plataforma; SEO, de busca. O OS possui briefs, versões, binários, revisão, aprovação, publicação e métricas.

## Formatos e níveis

| Família | Primeiro output revisável | Capacidade posterior |
| --- | --- | --- |
| Imagem/social | Conceito, composição, prompt, copy vinculada, dimensões e variantes | Arquivo renderizado por ImageGenerationProvider, preview e QA visual |
| Vídeo | Roteiro, storyboard, shots, legendas, CTA e duração | Geração/edição por etapas com vídeo, voz, captions e variantes de proporção |
| Product book/catálogo/e-book | Outline, plano de páginas, sistema visual e fontes | Render PDF/digital com validação de conteúdo e qualidade de exportação |
| Landing page | Nível 1: wireframe, seções, copy, direção visual e tracking spec | Nível 2: page artifact e preview; nível 3: implementação deployable autorizada |
| Kit de campanha | CreativeSet com outputs independentes | Biblioteca reutilizável, comparação A/B e performance por versão |

Não se cria um subagente por formato. Ferramentas/adapters especializados atendem o mesmo Creative Producer; agente separado só se justifica por runtime, credenciais, volume ou isolamento realmente distintos.

## Creative Brief

Campos obrigatórios ou explicitamente pendentes: Workspace/Product/Campaign, objetivo, público, oferta, mensagem principal e secundárias, source artifacts aprovados, canais e formatos, marca/design system, constraints de domínio, claims, CTA, elementos obrigatórios/proibidos, dimensões/duração, idioma, quantidade de variantes e métrica de sucesso. O brief fixa versões de entrada. Alteração de claim, preço, feature ou promessa pede retorno ao owner da fonte; o produtor não muda significado silenciosamente.

## Artefatos e variantes

Cada CreativeArtifact pertence a um CreativeBrief e pode integrar um CreativeSet. Guarda tipo, formato, canal, fontes, asset IDs, versão, status, run ID, Product Context/Domain Advisory usados, resultado de review, aprovação e refs publicadas. CreativeVariant aponta para master e registra hipótese, única dimensão intencionalmente alterada, público/canal e métrica. Os estados são `DRAFT`, `GENERATING`, `READY_FOR_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED`, `PUBLISHED`, `ARCHIVED`. Revisar cria nova versão; approval e performance continuam ligadas à versão exata.

CreativeAsset guarda binário em object storage e metadados no OS: provider/modelo, parâmetros, prompt/spec, custo, duração, formato/dimensões, licença, direitos, atribuição, expiração e consentimento de pessoa real quando relevante. Um asset externo sem direito conhecido permanece em revisão para uso comercial. Upload do usuário passa por validação de formato, sanitização de metadados e política de propriedade/consentimento.

## Fluxo de produção

1. O lead reúne entradas e chama revisão de domínio quando policy/risco exigem.
2. O Creative Producer monta CreativeBrief e lista outputs do set. O OS valida scope, versões e budget cap.
3. O adapter habilitado gera ou renderiza cada output com idempotência e registro de custo/provider. Falha de um item não apaga os demais.
4. O agente faz revisão de brief, brand, claims, canal e direitos. QA de arquivo renderizado verifica legibilidade, hierarquia, texto, safe area, contraste, captions e mobile conforme o formato.
5. A UI mostra preview e diff de variantes ao humano. A versão aprovada fica imutável.
6. Publicação, gasto ou deploy exigem autorização específica do destino/payload. Métricas são atribuídas à variante publicada.

## Fronteiras de execução

Os adapters são capacidades configuradas por Workspace/Campaign: `ImageGenerationProvider`, `VideoGenerationProvider`, `VoiceProvider`, `DocumentRenderProvider`, `LandingPageRenderer`. Preferir AI Gateway quando oferecer a capacidade adequada; fornecedor externo usa adapter controlado. A seleção considera qualidade, custo, latência, disponibilidade, licença e idioma. O agente não acessa banco diretamente, não faz deploy de produção nem publica automaticamente. A especificação textual atual do subagente não é um asset gerado.

## UI e aceitação

Em Campaign → Creatives, o usuário cria brief, acompanha geração, visualiza set, versões e variantes, comenta, pede revisão, aprova e vê publicação/performance. Repurposing começa de um artifact aprovado e escolhe formatos derivados. O MVP criativo passa quando um mesmo brief gera ao menos duas variantes sociais por provider, ambas têm source/versão/custo/direitos, o review distingue QA textual de QA renderizado e nenhuma ação externa ocorre sem autorização. Vídeo, book e landing page de nível 2/3 têm gates próprios no [ROADMAP](./ROADMAP.md).

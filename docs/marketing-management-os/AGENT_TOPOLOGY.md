# AGENT_TOPOLOGY

## Topologia alvo

```text
UI/API → Context Gateway → lead Eve
                         ├─ product-marketer
                         ├─ content-marketer
                         ├─ social-media-coordinator
                         ├─ seo
                         └─ email
          Domain/Product Advisor ⇢ parecer contextual, acionado antes do briefing
```

O Advisor é uma capacidade plugável do plano de contexto, não um sexto especialista de marketing e não um subagente permanente nas pastas dos cinco. Pode começar como serviço/ferramenta que interpreta um Domain Pack e produz parecer estruturado. Uma implantação futura pode executá-lo via Eve em sessão isolada, mantendo a mesma interface. A seleção de especialidade pelo lead continua baseada nas descrições `agent.ts`, sem lista fixa na instrução do lead.

## Responsabilidades preservadas

| Agente | Entrada adicional | Saída e limite |
| --- | --- | --- |
| Lead | Workspace, Product(s), Campaign, versões fixadas, preferências e parecer opcional | Planeja dependências, delega na ordem necessária e devolve IDs de entregáveis; não redige |
| Product marketer | Product Context draft, fontes e questões abertas | Propõe versões de posicionamento e mensagens; publicação do pack requer aprovação de negócio |
| Content marketer | Brief e contexto do Product | Cria versão de peça longa no OS; preserva planejamento e revisão; não envia email |
| Social media coordinator | Brief, Product e canais autorizados | Cria variantes curtas versionadas; publicar/scheduling só via ação autorizada |
| SEO | URL, alvo de pesquisa e fontes | Cria auditoria e recomendações com fronteira entre observado e inferido |
| Email | Copy já existente e público | Adapta para inbox, prepara draft no Resend e pede execução explícita; mantém limites de evidência e deliverability |

## Contrato de execução

Cada delegação carrega `workspace_id`, `product_id`, `campaign_id` quando aplicável, `context_version_id`, `brief_version`, `domain_pack_id/version` opcional, objetivo, público, limites, referências e ID de correlação. O servidor valida os IDs antes de montar o briefing. O especialista recebe apenas o recorte relevante do pack; o documento completo e fontes podem ser lidos por ferramentas autorizadas. A saída contém `deliverable_id`, versão, resumo, fontes, ressalvas e próximos passos. Resultado livre em chat continua possível para conversa exploratória, mas trabalho de campanha passa a ter registro interno.

## Entrada do Advisor

O Advisor atua quando o Product tem binding ativo de um Domain Pack relevante para a tarefa. Recebe dados minimizados e retorna `recommendations`, `constraints`, `questions`, `evidence_refs`, `confidence` e versão do pack. O Context Gateway valida a resposta, marca sugestões sem prova como hipótese e insere o parecer no briefing. Os cinco especialistas tratam esse parecer como entrada contextual, sujeita a verificação, nunca como instrução de autoridade superior. O Advisor não tem credenciais de publicação nem acesso irrestrito a outros Workspaces.

## Fluxos compostos

- Peça SEO: `seo` define consulta e evidência; `content-marketer` redige usando o artefato/brief aprovado.
- Newsletter: `content-marketer` cria a peça; `email` adapta e monta o envio; revisão de conteúdo e autorização de envio são decisões separadas.
- Lançamento: `product-marketer` pode propor correção do Product Context; Campaign só fixa a versão publicada após decisão. Conteúdo, social, SEO e email são WorkItems dependentes ou paralelos conforme suas entradas, sempre associados à mesma versão de brief.

## Controle do contexto

Skills genéricas de escrita e estilo permanecem genéricas. Regras de segmento residem no Domain Pack e no parecer do Advisor. Convenções específicas de um canal permanecem com o especialista do canal. O lead não copia conhecimento vertical para sua instrução global. Essa separação permite instalar/remover um pack sem alterar comportamento para outros Products.

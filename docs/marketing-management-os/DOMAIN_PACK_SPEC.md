# DOMAIN_PACK_SPEC

## Conceito

Domain Pack é um pacote versionado e opcional de conhecimento sobre um segmento, indústria, tipo de produto ou regime de comunicação. Ele não é o cadastro do Product e não substitui seus fatos. Um Workspace instala o pack; cada Product o vincula e configura explicitamente. O Domain/Product Advisor lê o pack e o Product Context para produzir parecer situado na tarefa.

## Manifesto e conteúdo

| Parte | Conteúdo |
| --- | --- |
| Manifesto | `pack_id`, `version`, `schema_version`, nome, mantenedor, assinatura/hash, licença, mercados/idiomas, compatibilidade e data de revisão |
| Escopo | Segmentos cobertos, sinais para ativação, casos fora do escopo e conflitos com outros packs |
| Conhecimento | Taxonomia, jobs-to-be-done, personas típicas, jornadas, objeções, linguagem e canais usuais; cada afirmação leva fonte, data e confiança |
| Restrições | Claims que pedem prova ou revisão, termos sensíveis, critérios editoriais e perguntas de qualificação; não declarar conformidade legal automaticamente |
| Adaptadores | Campos configuráveis por Product, perguntas de onboarding e mapeamento para blocos do Product Context; sem código executável no MVP |
| Avaliação | Casos de teste com entrada, parecer esperado, abstenção e comportamento diante de fatos conflitantes |

## Contrato do Advisor

Entrada: `workspace_id` autorizado, `product_id`, contexto e brief fixados por versão, tarefa, mercados, idioma, versão do pack e referências permitidas. Saída estruturada: recomendações, possíveis riscos/restrições, perguntas, fontes, confiança e indicação `abstain` quando o pack não cobre o caso. Cada recomendação aponta para item do pack ou evidência externa verificada. O parecer é armazenado como snapshot da tarefa para auditoria. O Advisor não escreve o Product Context, não altera campanha e não publica.

## Isolamento e conflitos

Instalação e ativação têm dono, papel e auditoria. Um pack só lê os dados fornecidos da tarefa. Texto de pack e fontes externas são tratados como dados; não podem elevar privilégios nem instruir uso de ferramenta. Se regra do pack contradiz Product Context, fonte atual ou regra de canal, o Advisor emite conflito para revisão. Quando dois packs se aplicam, a seleção é explícita e o gateway registra ambos e sua precedência; a primeira versão deve limitar a um pack ativo por Product para reduzir ambiguidade.

## Ciclo de vida

Estados `draft`, `verified`, `active`, `deprecated`, `disabled`. Atualização não altera trabalhos em curso: Campanhas e Deliverables fixam versão. Antes de ativar uma nova versão, executar casos de avaliação e revisar mudanças em restrições. Desabilitar impede novas invocações, mas preserva o snapshot de decisões anteriores. Packs de terceiros exigem revisão de licença, proveniência e permissões antes da instalação; nenhum código ou credencial vem embutido no pacote inicial.

## Critérios de aceitação

O mesmo pedido sobre dois Products de segmentos distintos produz briefings com pareceres diferentes quando seus packs diferem. Desativar o pack devolve o comportamento genérico sem mudar os cinco especialistas. Parecer sem fonte ou fora do escopo informa incerteza; não injeta um claim em copy final. Todo resultado carrega `pack_id/version` e é reproduzível a partir dos snapshots usados.

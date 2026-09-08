# Padrões de UX

> Versão acionável dos fluxos completos do Base — aqui só a decisão: situação → regra → componente. Carregado quando o pedido é um fluxo, não um componente isolado (ver tabela de escopo em `SKILL.md`). Todo componente citado existe em `catalogo-componentes.md`; todo valor visual (cor, espaço, raio, duração) vem de `contrato-tokens.md` — se uma regra aqui parecer exigir um valor que não está lá, pare e pergunte, não aproxime.

---

## 1. Formulário longo multi-seção

Aplica quando o formulário tem mais de uma seção (`Fieldset` agrupando campos relacionados). Formulário de seção única segue só as duas últimas linhas (validação em blur + rodapé fixo).

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Formulário tem >1 `Fieldset` e o submit falha na validação | Resumo de erro no topo, antes da primeira seção, listando cada campo inválido por nome | `Alert.Root` status="danger" com `Alert.Title` + `<ul>` de itens dentro de `Alert.Description` |
| Formulário tem só 1 seção | Nunca mostrar resumo agregado — só erro inline por campo | `FieldError` |
| Usuário sai de um campo (evento `blur`) | Validar aquele campo na hora, nunca esperar o submit | `Textfield`/`Input` + `FieldError` (ícone + mensagem específica do campo, nunca "Campo inválido" genérico) |
| Formulário (curto ou longo) tem ação de salvar/cancelar | Ações fixas no rodapé, sempre visíveis, nunca soltas no meio do conteúdo | `Card.Footer` (sticky) ou `Fieldset.Actions`; botão primário (`Button` variant="primary") assume estado pendente via `isPending`/`data-pending` do React Aria enquanto salva |
| Existe diff real entre o estado atual do formulário e o último estado salvo | Mostrar aviso persistente de alteração não salva | `Alert.Root` status="warning" (ou `Toast` persistente — sem timeout), fixado acima do rodapé |
| Formulário está igual ao último estado salvo (sem diff) | Aviso de alteração não salva não aparece — nunca por padrão | — |

---

## 2. Tabela com filtro e busca

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Usuário aplica um filtro (painel de filtros ou busca com critério nomeado) | Cada filtro ativo vira chip individual no toolbar, removível sem reabrir o painel | `TagGroup` (`TagGroup.List`) com `Tag.Root` + `Tag.RemoveButton` (`aria-label="Remover filtro {nome}"` embutido), dentro de `Toolbar.Root` |
| Lista de resultado excede o tamanho de uma página | Paginar — nunca scroll infinito nem "carregar mais" automático | `Pagination.Root` > `Pagination.Content` > `Pagination.Item`/`Pagination.Link` (+ `Pagination.Previous`/`Pagination.Next` com ícone e `aria-label` nativos) |
| Filtro/busca ativo zera o resultado, mas existe dado na base | Empty state reconhece o termo buscado, oferece limpar filtro — nunca oferece "criar novo" aqui | `EmptyState.Root` (dentro do `Table.Root`/`Table.ScrollContainer` ou isolado fora de tabela), ícone de busca |
| Primeiro uso — nunca existiu dado, sem filtro aplicado | Texto explica o que vai aparecer ali + ação de criar | mesmo `EmptyState.Root`, ícone do domínio + `Button` variant="primary" size="sm" |

---

## 3. Confirmação destrutiva

Critério objetivo de qual variante usar — nunca escolher pelo "parece grave":

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Ação é reversível (existe lixeira/undo/histórico que restaura o estado) | Não usar modal nenhum — executar direto e oferecer desfazer | `Toast` com `Toast.ActionButton` "Desfazer" |
| Ação é irreversível **e** baixo impacto (1 registro isolado, sem cascata pra dado relacionado, sem valor financeiro/dado de terceiro) | Modal simples, dois botões, ação nomeada no botão | `AlertDialog.Root` size="sm" > `AlertDialog.Footer` (`Button` variant="secondary" "Cancelar" + `Button` variant="danger" nomeado, ex.: "Excluir rascunho") |
| Ação é irreversível **e** alto impacto — cascata pra dado relacionado (ex.: excluir cliente apaga pedidos/faturas vinculadas), **ou** ação em massa sobre ≥2 registros, **ou** envolve valor financeiro/dado de terceiro | Exigir digitar o nome do recurso; botão de destruição só habilita quando o texto bate | `AlertDialog.Root` size="sm" com `Input`/`Textfield` de confirmação dentro de `AlertDialog.Body` + `Button` variant="danger" em `AlertDialog.Footer` |

Nunca usar a variante "digitar o nome" pra toda exclusão por padrão — é fricção que só se justifica pelo critério de alto impacto acima.

---

## 4. Sequência carregando → vazio → erro

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Tela/tabela está buscando dado e a resposta ainda não chegou | Skeleton com formato aproximado do conteúdo real (largura variável, não bloco único) | `Skeleton.Root` |
| Skeleton já apareceu na tela | Mantém no mínimo 400ms mesmo se os dados chegarem antes — nunca deixa piscar | `Skeleton.Root` |
| Busca termina sem erro e sem registro | Aplica a distinção de copy do fluxo 2 (primeiro-uso vs. filtro-sem-resultado) | `EmptyState.Root` |
| Busca falha por erro de rede/servidor no **carregamento inicial** da tela | Erro ocupa o mesmo espaço do skeleton/vazio, com botão de tentar de novo | reaproveita `EmptyState.Root` — ícone de erro + `Button` variant="outline" "Tentar novamente" |
| Erro ocorre numa **ação pontual** (salvar, excluir, etc.), não no carregamento inicial | Reporta via toast que não some sozinho, com botão de retry | `Toast` variant="danger" com `Toast.Indicator` variant="danger" + `Toast.ActionButton` size="sm" variant="outline" "Tentar novamente" |

---

## 5. Permissão negada — 403 vs. 404

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Usuário está autenticado, tem visibilidade de que o recurso existe (aparece numa lista/contexto que ele pode ver) e só falta o papel/permissão específica | 403 — acessa a página de erro com CTA pra solicitar acesso | Não há componente de página de erro pronto no catálogo — compor com `EmptyState.Root` (ou `Card.Root` + `Card.Content`) exibindo o código "403" + `Typography` + `Button` variant="primary" "Solicitar acesso" |
| Revelar a existência do recurso vazaria informação sensível (recurso de outro tenant/organização, ou o usuário não deveria nem saber que aquilo existe) | 404 — nunca confirmar existência do recurso | Mesma composição acima (`EmptyState.Root` ou `Card.Root`) com código "404", sem CTA de solicitar acesso |

Na dúvida entre os dois, decide o teste: "confirmar que este recurso existe vaza algo pra esse usuário?" Se sim → 404. Se não → 403.

---

## 6. Ação em massa com resultado parcial

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Nenhuma linha selecionada na tabela | Barra de ação em massa não aparece | `Toolbar.Root` (composto com `Table.Root`/`Table.Collection`) só renderiza com ≥1 linha selecionada |
| Ação em massa processa N itens e todos têm sucesso | Toast de sucesso único, some sozinho | `Toast` variant="success" com `Toast.Indicator` variant="success" |
| Parte dos itens falha | Nunca reportar como sucesso genérico — informar contagem exata (ex.: "8 de 10 excluídos — 2 falharam") e não deixar o feedback sumir sozinho | `Toast` variant="warning" / `Alert.Root` status="warning" (não success, não danger) |
| Há itens que falharam | Oferecer ação pra ver quais e tentar de novo só esses — nunca reprocessar os que já tiveram sucesso | `Toast.ActionButton`, ou `Button` dentro de `Alert.Content` ("Ver detalhes" / "Tentar novamente") |

---

## 7. Alterações não salvas ao navegar

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Existe autosave/rascunho ativo (dado não se perde ao sair) | Nunca bloquear navegação — no máximo indicador sutil de estado | `Typography` discreto ("Salvando…" / "Rascunho salvo"), sem aviso bloqueante |
| Não há autosave, existe alteração não salva, e o usuário tenta sair do fluxo (fechar aba, F5, trocar de rota, botão voltar) | Bloquear com confirmação antes de perder o dado | `AlertDialog.Root` simples 2 botões ("Continuar editando" / "Descartar e sair") ou `beforeunload` nativo pra fechar aba |
| Não há autosave, existe alteração não salva, mas o usuário continua dentro do mesmo formulário (troca de aba/seção interna, não sai da rota) | Não bloquear — só manter o aviso visível | `Alert.Root` status="warning" persistente, não-bloqueante |

---

## 8. Excesso de opção — Lei de Hick e Lei de Miller

Lei de Hick: quanto mais opção visível ao mesmo tempo, mais devagar a decisão. Lei de Miller: memória de trabalho segura ~7±2 itens de uma vez — acima disso, a pessoa perde a régua.

| Situação (SE) | Regra (ENTÃO) | Componente |
|---|---|---|
| Toolbar/barra de ação expõe mais de ~7 ações ao mesmo tempo | Manter só as mais usadas visíveis; resto agrupado, sem esconder a ação principal | `Dropdown.Root` (`Dropdown.Menu` + `Dropdown.Item` dentro de `Dropdown.Popover`) a partir de `Button` isIconOnly variant="secondary" "⋯" |
| Fluxo de múltiplos passos passa de 5-7 etapas | Agrupar etapas relacionadas em estágios nomeados, com progresso visível | Não há componente "stepper" pronto no catálogo — compor com `ProgressBar.Root`/`ProgressCircle.Root` (progresso) + `Card.Root`/`Tabs.Root` (estágio nomeado atual), por estágio, não passo cru |

---

## Tabela-resumo — todos os fluxos

| Situação | Regra | Componente |
|---|---|---|
| Formulário >1 seção falha na validação | Resumo de erro no topo, antes da 1ª seção | `Alert.Root` status="danger" |
| Campo perde foco (blur) | Valida na hora, não espera o submit | `FieldError` |
| Formulário com alteração não salva | Ações fixas no rodapé + aviso persistente | `Card.Footer`/`Fieldset.Actions` + `Alert.Root` status="warning" |
| Filtro/busca aplicado numa tabela | Vira chip removível no toolbar | `Tag.Root` + `Tag.RemoveButton` em `TagGroup` dentro de `Toolbar.Root` |
| Lista de resultado grande | Pagina, nunca scroll infinito | `Pagination.Root` |
| Filtro zera resultado | Empty state com o termo buscado + ação de limpar filtro | `EmptyState.Root` |
| Ação destrutiva reversível | Sem modal — executa e oferece desfazer | `Toast` + `Toast.ActionButton` |
| Ação destrutiva irreversível, baixo impacto | Modal simples, dois botões | `AlertDialog.Root` size="sm" |
| Ação destrutiva irreversível, alto impacto/cascata/massa | Exige digitar o nome do recurso | `AlertDialog.Root` size="sm" + `Input`/`Textfield` |
| Tela/tabela carregando dado | Skeleton, mínimo 400ms na tela | `Skeleton.Root` |
| Erro de rede no carregamento inicial | Erro no lugar do vazio, com retry | `EmptyState.Root` |
| Erro de rede numa ação pontual | Toast que não some sozinho, com retry | `Toast` variant="danger" + `Toast.Indicator` |
| Recurso existe mas falta permissão, e o usuário pode ver que existe | 403 + CTA pra solicitar acesso | composição `EmptyState.Root`/`Card.Root` "403" (sem componente de página de erro pronto) |
| Recurso de outro tenant ou sensível a expor | 404, nunca confirma existência | composição `EmptyState.Root`/`Card.Root` "404" (sem componente de página de erro pronto) |
| Ação em massa com falha parcial | Contagem exata, nunca sucesso genérico, feedback não some sozinho | `Toast` / `Alert.Root` status="warning" |
| Navegação com autosave ativo | Nunca bloqueia | `Typography` discreto |
| Navegação sem autosave, saindo da rota | Bloqueia com confirmação | `AlertDialog.Root` 2 botões / `beforeunload` |
| Navegação sem autosave, dentro do mesmo formulário | Só avisa, não bloqueia | `Alert.Root` status="warning" |
| Toolbar/menu com mais de ~7 ações simultâneas | Agrupar em "Mais ações" | `Dropdown.Root` |
| Fluxo com mais de 5-7 passos | Agrupar em estágios nomeados | composição `ProgressBar.Root`/`ProgressCircle.Root` + `Card.Root`/`Tabs.Root` (sem componente "stepper" pronto) |

---

## Checklist desta etapa

- [ ] Todo formulário com >1 `Fieldset` tem resumo de erro (`Alert.Root` status="danger") E validação em blur por campo — nunca só no submit.
- [ ] Nenhuma tabela usa scroll infinito — toda lista paginada usa `Pagination.Root`.
- [ ] Toda confirmação destrutiva foi classificada como reversível / irreversível-baixo-impacto / irreversível-alto-impacto, e o componente usado bate com a classificação (sem modal / `AlertDialog.Root` simples / `AlertDialog.Root` com digitar nome).
- [ ] Todo skeleton respeita o mínimo de 400ms, e todo erro de carregamento (inicial ou pontual) tem botão de tentar novamente.
- [ ] 403 vs. 404 foi decidido pelo teste "confirmar a existência vaza algo?" — não escolhido por padrão genérico do framework.
- [ ] Toda ação em massa relata contagem exata de sucesso/falha — nenhuma mensagem de sucesso genérico quando houve falha parcial.
- [ ] Nenhuma toolbar/menu expõe mais de ~7 ações de uma vez, e nenhum fluxo passa de 5-7 etapas sem agrupar em estágio.

Depois desta etapa, seguir para `checklist-auditoria.md` — o gate final de todo modo, sem exceção.

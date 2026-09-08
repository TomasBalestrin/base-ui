# Checklist de auditoria

> Gate final. Todo modo da skill (`aplicar`, `auditar`, `instalar`, `migrar`) roda este arquivo por completo antes de entregar qualquer coisa — sem exceção, nem para "ajuste pequeno" ou "só uma cor". Rode cada item abaixo contra o código que você acabou de escrever ou está revisando.
>
> **Diferença por modo:** em `auditar`, este checklist É a entrega — reporte os achados no formato da seção final, não corrija nada por conta própria. Nos modos `aplicar`, `instalar` e `migrar`, corrija tudo que este checklist encontrar antes de entregar; só reporte separado o que estiver fora do escopo pedido (ver regra de ferro 4 do `SKILL.md`).
>
> Valores canônicos vêm de `contrato-tokens.md`. Anatomia/classe/estado vêm de `catalogo-componentes.md`. Não aproxime nenhum valor — se o código usa algo que não está nas listas abaixo, é bug, não estilo.

---

## Tokens

- [ ] **Nenhuma cor hexadecimal solta.** Toda cor é `var(--token)` (ou utilidade Tailwind mapeada, ex. `bg-accent`) — nunca `#0070F3`, `#0072F5`, `rgba(0,112,243,...)` cravado em componente.
  ```bash
  grep -rnoE '#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b' \
    --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.vue' --include='*.html' . \
    | grep -viE 'themes/base/|node_modules/'
  ```
  Qualquer resultado fora de `packages/styles/themes/base/` é violação. Trocar pelo token semântico do contrato; se a cor não existe lá, parar e perguntar — nunca aproximar.

- [ ] **Nenhum espaçamento fora da escala de 4pt.** `padding`/`margin`/`gap` só podem valer 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48 ou 64px (`--space-0-5` a `--space-16`).
  ```bash
  grep -rnoE '(padding|margin|gap)[a-zA-Z-]*:\s*[0-9.]+px' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' . \
    | grep -vE ':\s*(2|4|6|8|12|16|20|24|32|40|48|64)px'
  ```
  Todo valor listado é violação — não existe "13px pra centralizar".

- [ ] **Nenhum `border-radius` fora dos 6 valores.** Só 2, 4, 6, 8, 12px ou 999px (`--radius-xs/sm/(padrão)/md/lg/full`).
  ```bash
  grep -rnoE 'border-radius:\s*[0-9.]+px' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' . \
    | grep -vE ':\s*(2|4|6|8|12|999)px'
  ```

- [ ] **Nenhuma duração de animação fora dos 5 tokens `--duration` discretos + `--duration-loop`**, e todo easing é um dos 4 `--ease-*` do contrato (nunca `cubic-bezier` improvisado). Valores válidos: 80ms, 120ms, 180ms, 240ms, 320ms, 1600ms — **mais `0.001ms`**, que não é violação: é o valor do reset de `prefers-reduced-motion` (ver `motion.md` seção 4), não um valor de UI normal.
  ```bash
  grep -rnoE '(transition|animation)[a-zA-Z-]*:\s*[0-9.]+m?s' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' . \
    | grep -vE ':\s*(80ms|120ms|180ms|240ms|320ms|1600ms|0\.001ms|0\.08s|0\.12s|0\.18s|0\.24s|0\.32s|1\.6s)'
  grep -rnoE 'cubic-bezier\([^)]*\)' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' . \
    | grep -vE '0\.4,0,0\.2,1|0,0,0\.2,1|0\.4,0,1,1|0\.34,1\.56,0\.64,1'
  ```

---

## Acessibilidade

- [ ] **`prefers-reduced-motion` respeitado.** Se o projeto já rodou `modo instalar`, o reset global cobre isso — confirme que a regra existe em algum lugar carregado globalmente; se houver animação orquestrada em JS (GSAP/Framer, fora de CSS puro), confirme que ela também desliga sob a preferência (ver `motion.md`).
  ```bash
  grep -rn 'prefers-reduced-motion' --include='*.css' --include='*.scss' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.html' .
  ```
  Zero resultado num projeto com qualquer animação = crítico.

- [ ] **Foco visível em todo interativo.** `:focus-visible` herdado do reset (anel `--ring`, 2px, offset 2px) cobre o padrão — só componente custom (slider, switch, item de canvas) precisa redeclarar. `outline: none`/`outline: 0` **nunca** aparece sem um `:focus-visible` substituto ao lado.
  ```bash
  grep -rn 'outline:\s*none\|outline:\s*0\b' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' .
  ```
  Para cada resultado: existe uma regra `:focus-visible` (com `--ring`) associada ao mesmo seletor? Se não, crítico.

- [ ] **Todo input com label associado.** `<label for="id">`+`id` no input, ou `<label>` envolvendo o campo (padrão de `.check-row`/`.radio-row`) — nunca só `placeholder` fazendo esse papel.
  ```bash
  grep -rn '<input' --include='*.tsx' --include='*.jsx' --include='*.html' --include='*.vue' . | grep -v 'aria-label\|aria-labelledby'
  grep -rn '<label' --include='*.tsx' --include='*.jsx' --include='*.html' --include='*.vue' .
  ```
  Cruzar os dois: todo `<input>` sem `aria-label`/`aria-labelledby` precisa de um `<label for>` (ou envolvente) correspondente.

- [ ] **Todo botão ícone-only (`.btn-icon`, `.toggle-btn`, ação de linha) com `aria-label` específico** — nunca genérico quando existem múltiplos iguais na tela (ex: um "Editar" por linha de tabela precisa nomear a linha: `aria-label="Editar pedido #1234"`, nunca `aria-label="Editar"` repetido).
  ```bash
  grep -rn 'aria-label=' --include='*.tsx' --include='*.jsx' --include='*.html' --include='*.vue' . \
    | grep -oE 'aria-label="[^"]*"' | sort | uniq -c | sort -rn | awk '$1>1'
  ```
  Todo texto que repete: verificar se está dentro de um loop/mapa (linha de tabela, item de lista) sem interpolação de identificador — se sim, crítico.

- [ ] **Nenhum elemento clicável sem role/semântica correta.** Nunca `<div onClick>`/`<span onClick>` puro — é `<button>`, `<a>`, ou `role="button"` + `tabindex="0"` + `onKeyDown` (Enter/Espaço).
  ```bash
  grep -rn 'onClick\|@click' --include='*.tsx' --include='*.jsx' --include='*.vue' --include='*.html' . \
    | grep -E '<div|<span' | grep -v 'role='
  ```
  Vale também para os padrões do catálogo: busca de sort de tabela (`.th-sort-btn` precisa ser `<button>` real dentro do `<th>`), botão de sufixo de campo, ação "buscar no computador" do dropzone — nunca `<span onclick>`.

- [ ] **Cor nunca como único indicador de estado.** Badge de status, delta de KPI, notificação não lida, dot online/away/busy/offline — todos têm texto, ícone ou `.sr-only` além da cor.
  ```bash
  grep -rn 'is-unread\|badge-\|kpi-delta\|status-dot' --include='*.tsx' --include='*.jsx' --include='*.html' .
  ```
  Para cada resultado, confirmar: existe texto visível ou `sr-only` junto, não só a classe de cor?

- [ ] **Contraste 4.5:1 (texto normal) / 3:1 (componente e texto grande ≥18px ou ≥14px bold).** Pares semânticos do contrato (`--foreground`/`--background`, `--primary-foreground`/`--primary` etc.) já foram auditados — usá-los sozinhos já resolve isso. O risco real é combinação **custom**: qualquer `rgba()`/`color-mix()`/opacidade solta pintando texto sobre fundo fora dos pares do contrato precisa de checagem manual (DevTools → Inspect → contrast ratio, ou `npx pa11y <url>`) antes de entregar.

---

## Usabilidade

> Base: 10 heurísticas de usabilidade de Jakob Nielsen (Nielsen Norman Group). Os itens acima já cobrem contrato de token e acessibilidade mecânica — esta seção cobre a camada de julgamento: uma tela pode passar em todos os checks anteriores e ainda ser difícil pra quem não é técnico.

- [ ] **Toda ação que demora mais de ~1s mostra que está processando.** Cruza com a seção Estados acima (loading/skeleton) — aqui o corte é de intenção: pergunte "o usuário sabe que o sistema está trabalhando, e por quanto tempo aproximadamente?" pra qualquer ação sem feedback visível.
- [ ] **Erro técnico cru nunca chega pro usuário final.** Nunca expor stack trace, `null`, `undefined`, código HTTP puro ("Error 500") ou mensagem de exceção de banco na tela — sempre traduzir pra linguagem do domínio + o que fazer a seguir.
  ```bash
  grep -rniE '(error 5[0-9]{2}|error 4[0-9]{2}|stack trace|\bundefined\b|\bnull\b|exception:)' --include='*.tsx' --include='*.jsx' --include='*.html' <alvo>
  ```
- [ ] **Toda ação tem saída fácil.** Modal sempre fecha com X visível e tecla Esc; toda confirmação tem "Cancelar" no mesmo nível visual do botão de ação principal — nunca só um jeito de sair.
- [ ] **Erro é evitado antes de acontecer, não só relatado depois.** Botão de ação inválida (submit sem campo obrigatório, excluir sem seleção) fica `disabled` com explicação, em vez de habilitado pra falhar só no clique.
- [ ] **Menu/toolbar de ação nunca expõe mais de ~7 opções simultâneas.** Acima disso, agrupar em `.dropdown-menu` "Mais ações" — excesso de opção visível de uma vez trava a decisão (Lei de Hick), ver `padroes-ux.md` seção 8.
- [ ] **Ícone sozinho (sem texto ao lado) tem tooltip.** Todo `.btn-icon` mostra rótulo em `title`/tooltip ao passar o mouse, além do `aria-label` já exigido na seção Acessibilidade.

---

## Estados

- [ ] **Todo componente interativo cobre hover, `:focus-visible` e `:disabled`.** Herdado das classes base (`.btn`, `.input`, `.select` etc.) não precisa redeclarar; componente custom (slider, switch, upload) precisa dos três explícitos.
- [ ] **Loading state em toda ação assíncrona.** Todo botão que dispara request tem `.is-loading` (ou equivalente); toda tabela/lista com fetch tem skeleton (`.skeleton`) — nunca tela em branco enquanto carrega, nunca skeleton por menos de 400ms (pisca).
  ```bash
  grep -rn 'async \|await \|\.then(' --include='*.tsx' --include='*.jsx' . \
    | grep -viE 'isLoading|isPending|setLoading|is-loading|isSubmitting'
  ```
  Candidatos a revisar manualmente — toda ação assíncrona sem sinal de estado ao lado é suspeita.
- [ ] **Empty/error state em toda listagem de dado.** Toda tabela, lista, resultado de busca tem os três estados cobertos: dado normal, vazio (`.table-empty`/`.empty-state`, ícone + título + descrição + ação se aplicável, texto diferente pra "vazio de verdade" vs "vazio por filtro") e erro.
  ```bash
  grep -rln '\.map(' --include='*.tsx' --include='*.jsx' . \
    | xargs grep -L 'empty-state\|table-empty\|\.length === 0\|\.length > 0'
  ```
  Todo arquivo listado (tem `.map()` mas nenhum tratamento de vazio) é candidato a revisão.

---

## Consistência

- [ ] **Nomenclatura de classe/variante bate com `catalogo-componentes.md`.** Nada de classe inventada quando já existe padrão BEM (`.button--primary`, não `.btn-main`; estado via `data-*` herdado do React Aria — `data-pressed`, `data-focus-visible` — nunca uma classe `.is-active` custom quando o componente já expõe o data-attribute).
  ```bash
  grep -oE 'class(Name)?="[^"]*"' <arquivo> | tr ' ' '\n' | sort -u
  ```
  Cruzar cada classe custom contra o catálogo — o que não bate é ou erro de nome ou componente que devia reusar um já existente.

- [ ] **Densidade compacta respeitada sem exceção pontual.** Botão = 32px (`--control-h-md`) salvo variante explícita `xs`(24)/`sm`(28)/`lg`(36); input/select/stepper/OTP = 34px (`--input-h`); linha de tabela/item de lista denso = 38px (`--row-h`).
  ```bash
  grep -rnoE 'height:\s*[0-9]+px|min-height:\s*[0-9]+px' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' . \
    | grep -viE ':\s*(24|28|32|34|36|38)px' \
    | grep -viE '\.icon|\.avatar|\.skeleton|\.badge|\.spinner|\.status-dot|\.sr-only|\.dot\b|svg|width:'
  ```
  A segunda filtragem remove ruído óbvio (ícone, avatar, skeleton, badge, spinner, elemento decorativo que declara `width` junto — sinal de forma quadrada/circular, não de controle). **Mesmo depois do filtro, todo resultado ainda é candidato, não veredito** — confirme contra o elemento real antes de reportar como violação (mesma regra do Passo 2 de `modo-auditar.md`). Nenhum "esse botão aqui fica melhor com 30px" — se a densidade não serve pro caso, o problema é o caso, não a régua.

---

## Conteúdo

- [ ] **Texto de botão/erro/confirmação nomeia a ação — nunca genérico.** Proibido: "OK", "Erro", "Tem certeza?", "Sucesso". Correto: "Excluir pedido", "Não foi possível salvar o cliente", "Excluir 3 faturas selecionadas?".
  ```bash
  grep -rniE '>\s*(ok|erro|sucesso|cancelar\?|tem certeza\??)\s*<' --include='*.tsx' --include='*.jsx' --include='*.html' .
  ```
- [ ] **Formatos brasileiros corretos.** Data `DD/MM/AAAA`, moeda `R$ 1.234,56` (separador de milhar `.`, decimal `,`), CPF `000.000.000-00`, CNPJ `00.000.000/0000-00`, telefone `(00) 00000-0000`.
  ```bash
  grep -rn 'toLocaleString(\|toLocaleDateString(' --include='*.tsx' --include='*.jsx' . | grep -v 'pt-BR'
  ```
  Toda formatação de data/número sem `pt-BR` explícito é candidata a bug de formato (cai no padrão `en-US` do runtime).

---

## Responsivo

- [ ] **Grid usa `minmax(0,1fr)`, nunca `1fr` puro.** `1fr` sozinho trava no `min-content` do conteúdo (texto longo, número grande) e estoura em tela pequena.
  ```bash
  grep -rn 'grid-template-columns' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' . \
    | grep -E 'repeat\([0-9]+,\s*1fr\)' 
  ```
  Qualquer `repeat(N, 1fr)` sem `minmax(0, ...)` por dentro é violação — trocar por `repeat(N, minmax(0, 1fr))` (padrão `.grid-2/3/4` do showcase).
- [ ] **Testado nas 4 larguras de referência: 375px, 768px, 1024px, 1440px.** Redimensionar (DevTools ou emulador) nessas quatro e confirmar que nada quebra — nenhuma etapa opcional entre elas.
- [ ] **Nenhum overflow horizontal de página inteira.** `<body>`/container raiz nunca ganha scrollbar horizontal; conteúdo largo (tabela, diagrama, code block) rola dentro do próprio container (`overflow-x: auto`), a página em volta não.

---

## Formato do relatório

Todo achado deste checklist é reportado (ou corrigido + reportado, conforme o modo) neste formato — mesmo formato usado pelo `modo-auditar.md`:

```
[SEVERIDADE] caminho/do/arquivo.ext:linha — o que está errado. Corrigir: o que fazer especificamente.
```

**Severidade:**

| Nível | Quando usar |
|---|---|
| **Crítico** | Quebra acessibilidade ou trava uso: `outline:none` sem substituto, `<div onClick>`/`<div onclick>` sem teclado, input sem label, contraste abaixo do mínimo, qualquer cor hexadecimal solta fora do contrato de tokens, overflow horizontal de página inteira, erro técnico cru exposto ao usuário final, ação destrutiva sem "Cancelar"/saída fácil. |
| **Importante** | Diverge do padrão de forma visível: radius/espaçamento/duração fora do contrato, densidade errada, estado (hover/loading/empty) faltando, `aria-label` genérico repetido, botão de ação inválida habilitado sem prevenção, toolbar/menu com mais de ~7 ações sem agrupamento. |
| **Menor** | Não quebra nada, mas diverge do catálogo: nome de classe fora do padrão, formato de data/moeda incorreto, texto de botão genérico onde não é crítico pro fluxo, ícone-only sem tooltip. |

Exemplo:

```
[CRÍTICO] src/components/ClienteRow.tsx:42 — outline:none sem :focus-visible correspondente no botão de ação da linha. Corrigir: adicionar box-shadow 0 0 0 2px var(--ring) com outline-offset 2px em :focus-visible, seguindo o padrão herdado de .btn.
[IMPORTANTE] src/components/PedidoForm.tsx:18 — padding: 10px 14px fora da escala de 4pt. Corrigir: trocar por var(--space-2) var(--space-3) (8px 12px) ou var(--space-3) var(--space-4) (12px 16px), o que bater com o layout pretendido.
[MENOR] src/components/FaturaTable.tsx:77 — texto do botão de exclusão é "OK". Corrigir: nomear a ação, ex. "Excluir fatura".
```

Se nenhum item deste checklist falhar, reportar explicitamente **"Nenhum problema encontrado neste checklist"** — nunca omitir a seção porque não achou nada.

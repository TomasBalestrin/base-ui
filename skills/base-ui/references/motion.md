# Motion

> Carregado quando o pedido menciona animação, transição, entrada/saída de elemento, ou "anima isso" (ver tabela de `SKILL.md`). Valores canônicos vêm de `contrato-tokens.md` — este arquivo só ensina a IMPLEMENTAR esses valores por stack. Nunca troque um número aqui sem primeiro atualizar `packages/styles/themes/base/variables.css` (fonte real) e rodar `pnpm skill:gen`.

## 1. Tokens — fonte única

Não redeclare estes valores de memória. Copie sempre de `contrato-tokens.md`:

| Token | Valor | Uso |
|---|---|---|
| `--duration-instant` | 80ms | Press de botão, toggle de checkbox |
| `--duration-fast` | 120ms | Hover, foco, cor de fundo, saída de overlay |
| `--duration-base` | 180ms | Popover, accordion, tab indicator |
| `--duration-slow` | 240ms | Modal, toast (entrada) |
| `--duration-slower` | 320ms | Drawer, progress bar |

| Token | Curva | Quando |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4,0,0.2,1)` | Padrão geral (cor, hover) |
| `--ease-decelerate` | `cubic-bezier(0,0,0.2,1)` | **Entrada** — elemento chegando |
| `--ease-accelerate` | `cubic-bezier(0.4,0,1,1)` | **Saída** — elemento saindo |
| `--ease-spring` | `cubic-bezier(0.34,1.56,0.64,1)` | Feedback lúdico pontual — raro, não usar por padrão |

Em CSS/Tailwind, referencie sempre a variável (`var(--duration-base)`, `duration-[var(--duration-base)]`) — nunca hardcode `180ms` solto. Em Framer Motion, que exige número em segundos e easing como array, converta assim:

| Token | Segundos (Framer `duration`) |
|---|---|
| `--duration-instant` | `0.08` |
| `--duration-fast` | `0.12` |
| `--duration-base` | `0.18` |
| `--duration-slow` | `0.24` |
| `--duration-slower` | `0.32` |

| Token | Array (Framer `ease`) |
|---|---|
| `--ease-standard` | `[0.4, 0, 0.2, 1]` |
| `--ease-decelerate` | `[0, 0, 0.2, 1]` |
| `--ease-accelerate` | `[0.4, 0, 1, 1]` |
| `--ease-spring` | `[0.34, 1.56, 0.64, 1]` |

---

## 2. Regra de frequência — antes de animar, pergunte "quantas vezes por dia isso roda"

Quanto maior a frequência, menor o orçamento de duração e de coreografia.

| Frequência | Exemplo | Duração-teto | O que pode animar |
|---|---|---|---|
| Milhares de vezes/dia | Hover/focus de botão, campo, item de lista | `--duration-fast` (120ms) | Só `opacity` e/ou `background-color` — nunca transform grande |
| Dezenas de vezes/dia | Abrir popover, trocar tab, expandir accordion | `--duration-base` (180ms) | `opacity` + leve `transform` (translate ≤8px ou scale ≥0.95) |
| Poucas vezes/dia | Abrir modal, drawer, toast | `--duration-slow`/`--duration-slower` (240–320ms) | `opacity` + `transform` completo (translate + scale) |
| Rara (1x por fluxo) | Tela de sucesso, confirmação de pagamento, fim de wizard | Cada elemento individual ainda ≤ `--duration-slower` (320ms) | Pode coreografar **múltiplos** elementos com `stagger` (delay de 40–60ms entre eles) — mas nenhum elemento isolado ultrapassa o teto |

Não existe exceção pra "é só uma vez": mesmo a tela rara respeita o teto por elemento — o que muda é o número de elementos em sequência, não a duração de cada um.

---

## 3. As 5 regras de nunca fazer

### 3.1 Nunca animar `width`/`height`/`top`/`left` — sempre `transform`

Essas propriedades disparam **layout** (reflow) a cada frame; `transform`/`opacity` rodam só no compositor da GPU. Resultado direto: jank em qualquer aparelho mais fraco.

**CSS/Tailwind — ANTES (errado):**
```css
.drawer { right: -420px; transition: right var(--duration-slower) var(--ease-standard); }
.drawer.is-open { right: 0; }
```
```html
<!-- Tailwind -->
<div class="right-[-420px] data-[open=true]:right-0 transition-[right] duration-[var(--duration-slower)]">
```

**CSS/Tailwind — DEPOIS (correto):**
```css
.drawer { transform: translateX(100%); transition: transform var(--duration-slower) var(--ease-decelerate); }
.drawer.is-open { transform: translateX(0); }
```
```html
<!-- Tailwind -->
<div class="translate-x-full data-[open=true]:translate-x-0 transition-transform duration-[var(--duration-slower)] ease-[var(--ease-decelerate)]">
```

**React/Framer Motion — ANTES (errado):**
```jsx
<motion.div
  initial={{ top: -8 }}
  animate={{ top: 0 }}
  transition={{ duration: 0.18 }}
/>
```

**React/Framer Motion — DEPOIS (correto):**
```jsx
<motion.div
  initial={{ y: -8, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }} // --duration-base / --ease-decelerate
/>
```

**Exceção documentada — accordion:** colapsar conteúdo de altura variável (`height: auto`) não tem equivalente em `transform`. A técnica aceita no Base é `grid-template-rows: 0fr → 1fr` no container, com o padding num wrapper interno (nunca no filho direto do grid) — ver `catalogo-componentes.md`, item Accordion. Fora desse caso específico, `width`/`height`/`top`/`left` continuam proibidos.

### 3.2 Nunca `scale(0)` — mínimo `scale(0.95)` + `opacity`

`scale(0)` colapsa o elemento a um ponto antes de crescer — lê como "pop" abrupto e, em texto, o navegador chega a truncar/quebrar o layout de fonte no frame zero. Sempre combine com `opacity: 0` no estado inicial, e nunca desça abaixo de `0.95`.

**CSS/Tailwind — ANTES (errado):**
```css
@keyframes pop-in { from { transform: scale(0); } to { transform: scale(1); } }
```

**CSS/Tailwind — DEPOIS (correto):**
```css
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.popover-panel { animation: pop-in var(--duration-base) var(--ease-decelerate); }
```
```html
<!-- Tailwind -->
<div class="scale-95 opacity-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-decelerate)]">
```

**React/Framer Motion — ANTES (errado):**
```jsx
<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} />
```

**React/Framer Motion — DEPOIS (correto):**
```jsx
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }} // --duration-base / --ease-decelerate
/>
```

### 3.3 Nunca `ease-in` na entrada — sempre `--ease-decelerate`

`ease-in` começa devagar e acelera: o elemento "hesita" antes de se mover, sensação errada pra algo que está chegando na tela. `--ease-decelerate` (curva `ease-out`) começa rápido e desacelera suave — o elemento "assenta". `ease-in`/`--ease-accelerate` é correto só pra **saída**.

**CSS/Tailwind — ANTES (errado):**
```css
.modal { animation: modal-in var(--duration-slow) ease-in; }
```

**CSS/Tailwind — DEPOIS (correto):**
```css
.modal { animation: modal-in var(--duration-slow) var(--ease-decelerate); }
```

**React/Framer Motion — ANTES (errado):**
```jsx
transition={{ duration: 0.24, ease: "easeIn" }}
```

**React/Framer Motion — DEPOIS (correto):**
```jsx
transition={{ duration: 0.24, ease: [0, 0, 0.2, 1] }} // --ease-decelerate
```

### 3.4 Nunca passar de `--duration-slower` (320ms) numa interação de UI

Acima de 320ms numa transição que bloqueia o próximo passo do usuário (abrir modal, trocar de tab, expandir painel), a interface lê como travada — o usuário já tentou clicar de novo antes da animação terminar. 320ms é teto, não sugestão. Animação puramente decorativa e não-bloqueante (spinner `infinite`, shine de skeleton) não conta como "interação de UI" e fica fora dessa régua — mas mesmo assim usa os tokens do contrato, nunca um valor solto.

**CSS/Tailwind — ANTES (errado):**
```css
.drawer { animation: drawer-in 600ms var(--ease-decelerate); }
```

**CSS/Tailwind — DEPOIS (correto):**
```css
.drawer { animation: drawer-in var(--duration-slower) var(--ease-decelerate); } /* 320ms = teto */
```

**React/Framer Motion — ANTES (errado):**
```jsx
transition={{ duration: 0.6 }}
```

**React/Framer Motion — DEPOIS (correto):**
```jsx
transition={{ duration: 0.32, ease: [0, 0, 0.2, 1] }} // --duration-slower = teto
```

### 3.5 Nunca pular `prefers-reduced-motion`

Em CSS puro isso já está resolvido pelo reset global (nada a fazer — ver seção 4). O erro real acontece em animação disparada por JS, que o reset global não alcança.

**CSS puro — nada a escrever, o reset já cobre:**
```css
/* transition/animation em CSS não precisa de tratamento manual —
   @media (prefers-reduced-motion: reduce) no reset global já zera tudo */
.popover-panel { animation: pop-in var(--duration-base) var(--ease-decelerate); }
```

**React/Framer Motion — ANTES (errado, dispara sempre):**
```jsx
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} />
```

**React/Framer Motion — DEPOIS (correto, checa antes de disparar):**
```jsx
const reduceMotion = useReducedMotion();
<motion.div
  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0, 0, 0.2, 1] }}
/>
```

Detalhe completo (GSAP/vanilla JS incluído) na seção 4 — ignorar essa checagem em animação JS é bug de acessibilidade, não detalhe.

---

## 4. `prefers-reduced-motion` — implementação

**CSS puro — já resolvido, não redeclare por componente.** O reset global do Base zera `transition`/`animation` de tudo:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Se o componente novo usa só `transition`/`animation`/`@keyframes` em CSS, não escreva nada a mais — isso já cobre.

**JS que anima (GSAP, `requestAnimationFrame` manual, etc.) — checagem manual obrigatória antes de disparar:**

```js
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  // aplica o estado final direto, sem animação
  gsap.set(el, { opacity: 1, x: 0 });
} else {
  gsap.fromTo(el, { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.18, ease: "power2.out" });
}
```

**Framer Motion — usar o hook nativo `useReducedMotion`, não reimplementar `matchMedia` à mão:**

```jsx
import { motion, useReducedMotion } from "framer-motion";

function Modal() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0, 0, 0.2, 1] }}
    />
  );
}
```

`initial={false}` pula o estado inicial inteiro (não só encurta a duração) — é a forma correta de "desligar" no Framer Motion, não `duration: 0` sozinho (que ainda monta/desmonta com salto de opacidade).

---

## 5. Saída sempre mais sutil que entrada

Entrada coreografa (translate + scale + opacity, easing `--ease-decelerate`, duração cheia do componente). Saída é sempre mais rápida e mais simples — só `opacity`, ou `opacity` + um `transform` pequeno, com `--ease-accelerate`.

| Componente | Entrada | Saída |
|---|---|---|
| Popover, accordion, tab | `--duration-base` (180ms) `--ease-decelerate` — opacity + scale/translate leve | `--duration-fast` (120ms) `--ease-accelerate` — só opacity |
| Modal, toast | `--duration-slow` (240ms) `--ease-decelerate` — opacity + scale + translateY | `--duration-fast` (120ms) `--ease-accelerate` — só opacity (± translateY pequeno) |
| Drawer, progress bar | `--duration-slower` (320ms) `--ease-decelerate` — opacity + translate completo | `--duration-fast` (120ms) `--ease-accelerate` — opacity + translate simples, sem scale |

`--duration-fast` é o valor do contrato explicitamente marcado pra "saída de overlay" — use-o pra toda saída de modal/drawer/toast/popover, independente de qual token a entrada daquele componente usou.

```css
/* Entrada: completa */
@keyframes modal-in  { from { opacity: 0; transform: scale(0.96) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.modal { animation: modal-in var(--duration-slow) var(--ease-decelerate); }

/* Saída: só opacity, mais rápida */
@keyframes modal-out { from { opacity: 1; } to { opacity: 0; } }
.modal.is-closing { animation: modal-out var(--duration-fast) var(--ease-accelerate); }
```

---

## 6. Checklist de performance

1. **Só anima `transform` e `opacity`.** Qualquer outra propriedade em `transition`/`animation` (CSS) ou no objeto `animate`/`transition` do Framer é suspeita — volte pra seção 3.1.
2. **`will-change` é raro e temporário.** Use só em elemento que vai animar imediatamente e sob demanda (ex: ao abrir um drawer), nunca declarado permanentemente na classe base do componente. Remova a propriedade depois que a animação termina (listener de `transitionend`/`animationend`, ou `onAnimationComplete` no Framer Motion) — deixá-la ligada mantém a camada de composição da GPU viva sem necessidade e degrada memória/scroll.
3. **Loop de animação usa `requestAnimationFrame`, nunca `setTimeout`/`setInterval`.** `setInterval` não sincroniza com o refresh da tela — produz frames perdidos ou duplicados. Exemplo:

```js
// ERRADO — setInterval não sincroniza com o refresh da tela
setInterval(() => { progress += 1; render(progress); }, 16);

// CORRETO — requestAnimationFrame sincroniza com o compositor
function tick(now) {
  progress = computeProgress(now);
  render(progress);
  if (progress < 100) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

Bibliotecas de animação (Framer Motion, GSAP) já usam `requestAnimationFrame` internamente — a regra acima vale pra loop de animação escrito à mão (barra de progresso custom, contador animado, canvas).

---

## Checklist desta etapa

- [ ] Toda duração e easing citados são um dos 5 tokens de `--duration-*` / 4 tokens de `--ease-*` do contrato — nenhum `ms` ou `cubic-bezier` solto no código.
- [ ] Nenhuma animação anima `width`/`height`/`top`/`left` fora da exceção documentada de accordion (`grid-template-rows`).
- [ ] Nenhum `scale(0)` — mínimo `scale(0.95)` sempre combinado com `opacity`.
- [ ] Entrada usa `--ease-decelerate`; saída usa `--ease-accelerate` e é mais curta/mais simples que a entrada (regra da seção 5).
- [ ] Nenhuma duração de interação de UI passa de `--duration-slower` (320ms) por elemento.
- [ ] Se a animação roda via JS (não só CSS), há checagem de `prefers-reduced-motion` antes de disparar (seção 4) — CSS puro não precisa, já está no reset global.

Depois desta etapa, seguir pro `checklist-auditoria.md` geral — este arquivo cobre só motion, não substitui a auditoria completa do modo.

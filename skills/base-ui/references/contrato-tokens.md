<!-- GERADO por scripts/gen-token-contract.mjs — não editar à mão. -->
<!-- source-hash: dd462ac9958e9178 -->

# Contrato de tokens — Base

Extraído de `packages/styles/themes/base/variables.css` e `type.css`.
Nunca use uma cor hexadecimal solta ou um espaçamento em px cravado — todo
valor visual é um destes tokens, referenciado como `var(--nome)`.

## Cores e superfícies

| Token | Light | Dark |
|---|---|---|
| `--blue-50` | `#eff6ff` | (igual ao light) |
| `--blue-100` | `#dcebff` | (igual ao light) |
| `--blue-200` | `#b9d6ff` | (igual ao light) |
| `--blue-300` | `#8cbbff` | (igual ao light) |
| `--blue-400` | `#5c9cff` | (igual ao light) |
| `--blue-500` | `#2f7efc` | (igual ao light) |
| `--blue-600` | `#0070f3` | (igual ao light) |
| `--blue-700` | `#0058c7` | (igual ao light) |
| `--blue-800` | `#00449b` | (igual ao light) |
| `--blue-900` | `#013475` | (igual ao light) |
| `--gray-0` | `#ffffff` | (igual ao light) |
| `--gray-50` | `#f8f9fb` | (igual ao light) |
| `--gray-100` | `#f1f3f6` | (igual ao light) |
| `--gray-150` | `#e9ecf1` | (igual ao light) |
| `--gray-200` | `#e1e5eb` | (igual ao light) |
| `--gray-300` | `#cbd1db` | (igual ao light) |
| `--gray-500` | `#808a9c` | (igual ao light) |
| `--gray-600` | `#5f6b7e` | (igual ao light) |
| `--gray-900` | `#171b26` | (igual ao light) |
| `--green-50` | `#effef9` | (igual ao light) |
| `--green-600` | `#0b815a` | (igual ao light) |
| `--green-700` | `#08573c` | (igual ao light) |
| `--amber-50` | `#fffaeb` | (igual ao light) |
| `--amber-500` | `#f0a413` | (igual ao light) |
| `--amber-700` | `#93650b` | (igual ao light) |
| `--red-50` | `#fef2f2` | (igual ao light) |
| `--red-600` | `#d42e23` | (igual ao light) |
| `--red-700` | `#ab241c` | (igual ao light) |
| `--neutral-850` | `#1f1f1f` | (igual ao light) |
| `--neutral-900` | `#171717` | (igual ao light) |
| `--neutral-950` | `#0a0a0a` | (igual ao light) |
| `--radius` | `6px` | (igual ao light) |
| `--field-radius` | `6px` | (igual ao light) |
| `--duration-instant` | `80ms` | (igual ao light) |
| `--duration-fast` | `120ms` | (igual ao light) |
| `--duration-base` | `180ms` | (igual ao light) |
| `--duration-slow` | `240ms` | (igual ao light) |
| `--duration-slower` | `320ms` | (igual ao light) |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | (igual ao light) |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | (igual ao light) |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | (igual ao light) |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | (igual ao light) |
| `--background` | `var(--gray-0)` | `var(--neutral-950)` |
| `--foreground` | `var(--gray-900)` | `#fcfcfc` |
| `--surface` | `var(--gray-0)` | `var(--neutral-900)` |
| `--surface-foreground` | `var(--foreground)` | `var(--foreground)` |
| `--surface-secondary` | `var(--gray-50)` | `var(--neutral-850)` |
| `--surface-secondary-foreground` | `var(--foreground)` | (igual ao light) |
| `--surface-tertiary` | `var(--gray-100)` | `#27272a` |
| `--surface-tertiary-foreground` | `var(--foreground)` | (igual ao light) |
| `--overlay` | `var(--gray-0)` | `var(--neutral-900)` |
| `--overlay-foreground` | `var(--foreground)` | `var(--foreground)` |
| `--muted` | `var(--gray-500)` | `#a1a1aa` |
| `--default` | `var(--gray-100)` | `var(--neutral-850)` |
| `--default-foreground` | `var(--gray-900)` | `var(--foreground)` |
| `--accent` | `var(--blue-600)` | `var(--blue-400)` |
| `--accent-foreground` | `#ffffff` | `var(--neutral-950)` |
| `--field-background` | `var(--gray-0)` | `var(--neutral-900)` |
| `--field-foreground` | `var(--gray-900)` | `var(--foreground)` |
| `--field-placeholder` | `var(--muted)` | (igual ao light) |
| `--field-border` | `var(--border)` | (igual ao light) |
| `--success` | `var(--green-600)` | (igual ao light) |
| `--success-foreground` | `#ffffff` | (igual ao light) |
| `--warning` | `var(--amber-500)` | `#fbbf24` |
| `--warning-foreground` | `var(--gray-900)` | `var(--neutral-950)` |
| `--danger` | `var(--red-600)` | `#f87171` |
| `--danger-foreground` | `#ffffff` | `var(--neutral-950)` |
| `--segment` | `var(--gray-0)` | `#27272a` |
| `--segment-foreground` | `var(--foreground)` | `var(--foreground)` |
| `--border` | `var(--gray-200)` | `var(--neutral-850)` |
| `--separator` | `var(--gray-150)` | `#27272a` |
| `--focus` | `var(--accent)` | `var(--accent)` |
| `--link` | `var(--blue-700)` | `var(--blue-300)` |
| `--backdrop` | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.6)` |

## Tipografia

| Token | Valor |
|---|---|
| `--font-sans` | `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

## Regra de contraste (não derivável do CSS — documentar aqui)

`--accent` (blue-600, `#0070F3`) tem ~3.7:1 contra branco — suficiente para
componentes de UI (botões, bordas), insuficiente para texto (AA exige 4.5:1).
**Nunca usar `--accent` como `color` de texto sobre fundo claro.** Para link
ou texto de destaque, usar `--link` (blue-700, ~6.2:1).

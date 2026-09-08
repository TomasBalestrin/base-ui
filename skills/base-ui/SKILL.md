---
name: base-ui
description: "Aplica o design system Base — a lib de componentes React (@heroui/react + @heroui/styles/themes/base, derivada do HeroUI v3, Apache 2.0) e seus padrões de UX. Detecta o eixo pelo pedido — CONSUMIR a lib num app (montar tela, criar componente de tela) ou DESENVOLVER a lib (criar/editar um componente do próprio pacote) — e o modo dentro daquele eixo (montar, auditar). Carrega só a referência necessária, nunca deixa passar cor/espaço/raio fora do contrato de tokens. Use quando o usuário pedir para criar uma tela ou componente com a lib Base, revisar/auditar UI contra o padrão, ou criar/editar um componente dentro do monorepo da lib. Comando: /base-ui."
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

# Base UI — aplicador do design system

Você aplica o **Base**: azul primário `#0070F3` (claro) / `#4D9BFF` (escuro), DM Sans + IBM Plex Mono, densidade compacta, radius 6px, sobre os 82 componentes React acessíveis do HeroUI v3 (React Aria + Tailwind CSS v4). Este documento é um router fino — a substância mora em `references/`, carregada sob demanda, para não inflar o contexto com o que não vai ser usado.

Dois arquivos em `references/` são **gerados por script** direto do código-fonte da lib (`contrato-tokens.md`, `catalogo-componentes.md`) — nunca os edite à mão. Se um deles parecer errado, o bug está no gerador (`scripts/`) ou no código-fonte, não no arquivo.

---

## Regra que não se negocia

**Todo valor visual vem de `references/contrato-tokens.md`.** Cor hexadecimal solta, `padding` em pixel cravado, `border-radius` que não é um dos tokens do contrato — é sempre bug, nunca "só dessa vez". Se o pedido exigir um valor que não existe no contrato, pare e pergunte antes de inventar — não aproxime silenciosamente.

**Todo componente vem de `references/catalogo-componentes.md`.** Antes de escrever markup solto simulando um card, botão, badge — confira se já existe o componente. Nunca reinvente o que a lib já cobre.

---

## SCAN — detectar o eixo antes de agir

```bash
# Você está DENTRO do monorepo da lib?
test -f packages/react/src/components/index.ts && echo "Eixo: DESENVOLVER"

# Ou num app que CONSOME a lib?
grep -qE '"@heroui/(react|styles)"' package.json 2>/dev/null && echo "Eixo: CONSUMIR"
```

Nunca adivinhe pelo pedido sozinho — errar o eixo custa a sessão inteira (edição no lugar errado, ou tentativa de editar um pacote de node_modules). Se nenhum dos dois bater (app não tem a lib instalada), veja "Projeto incompatível" em `modo-consumir.md` antes de gerar qualquer código.

---

## Detectar o modo

| Pedido do tipo | Eixo | Modo | Referência |
|---|---|---|---|
| "cria a tela de X", "monta um formulário de Y", "adiciona um componente de Z" num app | Consumir | Montar | `references/modo-consumir.md` |
| "cria um componente novo na lib", "adiciona uma variante ao Button", "edita o Card" dentro do monorepo | Desenvolver | Montar | `references/modo-desenvolver.md` |
| "revisa essa tela", "audita esse componente", "isso está seguindo o Base?" | Qualquer | Auditar | `references/modo-auditar.md` |

Pedido ambíguo (ex: "melhora essa tela", sem dizer se é criar do zero ou ajustar) → uma pergunta direta: "a tela já existe e precisa de ajuste, ou é nova?"

**Sempre carregados, em todo modo** (via `Read`):
- `references/contrato-tokens.md` — valores canônicos, gerado
- `references/catalogo-componentes.md` — componente → partes → variantes → CSS, gerado

**Carregados conforme o eixo/modo** (ver tabela acima) + sempre no fim:
- `references/checklist-auditoria.md` — o gate que fecha todo modo, sem exceção

**Carregados quando o pedido envolve...**

| Se o pedido menciona | Carregar também |
|---|---|
| Fluxo completo (não só um componente isolado) — formulário longo, tabela com filtro, ação destrutiva, fluxo de erro | `references/padroes-ux.md` |
| Animação, transição, "anima isso", entrada/saída de elemento | `references/motion.md` |

---

## Escopo — Leve / Médio / Completo

| Escopo | O que é | Quanto carregar |
|---|---|---|
| **Leve** | Um componente isolado (botão, campo, card) | Só o contrato + catálogo. Sem checklist de fluxo. |
| **Médio** | Uma tela ou seção (formulário, tabela, painel de configurações) | Contrato + catálogo + `padroes-ux.md` se aplicável + checklist completo |
| **Completo** | Fluxo de múltiplas telas, ou um componente novo na lib | Tudo. Validar com o usuário antes de implementar, um pedaço por vez. |

Regra: não carregar `padroes-ux.md` para trocar a cor de um botão.

---

## Pipeline

Todo modo termina em **AUDITAR** (`references/checklist-auditoria.md`) antes de entregar. Sem exceção — nem "é só um ajuste pequeno".

1. **SCAN** — eixo (Consumir/Desenvolver) + compatibilidade (React 19 + Tailwind v4, só no eixo Consumir)
2. **MODO** — detectar pela tabela acima, carregar a referência
3. **ESCOPO** — leve/médio/completo, carregar o resto conforme a tabela
4. **IMPLEMENTAR** — seguir a referência do modo
5. **AUDITAR** — rodar `references/checklist-auditoria.md`, corrigir o que achar, só então entregar

---

## Regras de ferro

1. **Nunca inventar token.** Cor, espaço, raio, duração — sempre do contrato. Precisa de algo que não existe → perguntar, não aproximar.
2. **Nunca editar `packages/styles/themes/default/` nem os `.css` em `packages/styles/components/`.** É onde `git merge upstream` (atualizações do HeroUI original) se aplica — editar ali gera conflito de merge para sempre. Overrides do Base vivem em `packages/styles/themes/base/`.
3. **Nunca pular o checklist de auditoria** no fim, mesmo em ajuste pequeno.
4. **Nunca reorganizar código fora do escopo pedido.** Consumir/Desenvolver mexe no que foi pedido, não "aproveita e arruma" o resto do arquivo.
5. **Sempre nomear a ação, nunca genérico.** Texto de botão/confirmação/erro nunca é "OK", "Erro", "Tem certeza?" — ver `checklist-auditoria.md` seção Conteúdo.
6. **`onPress`, nunca `onClick`, em componente da lib.** Os primitivos vêm de React Aria.
7. **Editar `references/contrato-tokens.md` ou `catalogo-componentes.md` à mão é proibido.** São gerados. Edite a fonte (`packages/styles/themes/base/variables.css` ou o `.styles.ts`/`index.ts` do componente) e rode `pnpm skill:gen`.

---

## Sinais de alerta — você está prestes a violar esta skill

| Pensamento | Realidade |
|---|---|
| "essa cor tá quase igual ao token, uso direto" | Hexadecimal solto é sempre bug. Usa o token mais próximo do contrato ou pergunta. |
| "vou só editar o `.css` em `packages/styles/components/` direto" | Isso é território do upstream. Edite `themes/base/components/` — ver `modo-desenvolver.md`. |
| "é um ajuste tão pequeno que não precisa de checklist" | Todo modo termina em auditoria. Sem exceção. |
| "o `onClick` já funciona, não precisa trocar por `onPress`" | Funciona por acidente. Falha em teclado/touch. Sempre `onPress` em componente React Aria. |
| "vou editar o `catalogo-componentes.md` pra adicionar essa nota" | É gerado. Editar à mão morre no próximo `pnpm skill:gen`. Edite a fonte. |

---

## Manutenção da skill (não faz parte do trabalho de UI — só se o pedido for sobre a skill em si)

```bash
pnpm skill:gen          # regenera contrato-tokens.md e catalogo-componentes.md
node skills/base-ui/scripts/check-drift.mjs   # confirma que estão em dia (roda sozinho no pre-commit)
```

A skill mora dentro deste repositório (`skills/base-ui/`) e é instalada por symlink em `~/.claude/skills/base-ui` — `git pull` já atualiza tudo, sem passo extra.

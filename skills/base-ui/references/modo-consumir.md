# Modo CONSUMIR

Você está num app que **usa** a lib Base como dependência (não dentro do monorepo da lib). O trabalho é montar telas com os componentes prontos — nunca editar a lib, nunca recriar markup que um componente já cobre.

---

## 0. SCAN — confirme que é este eixo, não Desenvolver

```bash
# Está DENTRO do monorepo da lib? Se sim, é modo Desenvolver, não Consumir.
test -f packages/react/src/components/index.ts && echo "É o monorepo da lib — use modo-desenvolver.md"

# O projeto alvo declara a lib como dependência?
grep -E '"@heroui/(react|styles)"' package.json
```

Se `@heroui/react` não aparece no `package.json` do projeto, ele ainda não está pronto para o Base — pare e avise, não gere código que vai quebrar o build. Ver seção "Projeto incompatível" abaixo antes de prosseguir.

---

## 1. Compatibilidade obrigatória

A lib exige **React 19** e **Tailwind CSS v4**. Confirme antes de escrever qualquer componente:

```bash
grep -E '"react":|"tailwindcss":' package.json
```

- React `<19` ou Tailwind `<4` → **projeto incompatível**. Não adapte componentes da lib para rodar em versões antigas — isso gera código frágil que quebra na primeira atualização. Informe ao usuário que o projeto precisa de upgrade primeiro (React 18→19, Tailwind v3→v4) antes de consumir o Base, e pare aí.
- Ambos batem → prossiga normalmente.

---

## 2. Instalação (se ainda não configurado)

```bash
pnpm add "@heroui/react@git+ssh://git@github.com/TomasBalestrin/base-ui.git#release&path:packages/react" \
         "@heroui/styles@git+ssh://git@github.com/TomasBalestrin/base-ui.git#release&path:packages/styles"
```

A branch `release` (não `main`) tem os pacotes já buildados — é a única coisa instalável. `main` é código-fonte, não instala. Sempre os dois juntos: `@heroui/react` fixa `@heroui/styles` numa versão específica, então instalar só um pode ficar dessincronizado.

No CSS global do app (uma vez só, antes de qualquer componente ser usado):

```css
@import "@heroui/styles";
@import "@heroui/styles/themes/base";
```

A ordem importa: o tema Base sobrescreve o tema `default` por cascata — nunca inverter, nunca importar só um dos dois.

---

## 3. Regra de ferro

**Nada de UI nasce fora da lib.** Antes de escrever um `<div>` com classes Tailwind soltas simulando um card, um botão, um badge — verifique em `catalogo-componentes.md` se já existe o componente. Se existir, use-o. Se a anatomia dele não cobrir o caso, componha com as partes existentes antes de sair do sistema.

**Token antes de valor.** Nenhuma cor hex, nenhum espaçamento em px cravado. Todo valor visual é `var(--token)` do `contrato-tokens.md`, ou uma classe Tailwind que resolve para ele.

**`onPress`, nunca `onClick`, em componente da lib.** Os componentes vêm de React Aria — `onClick` funciona por acidente em alguns casos e falha silenciosamente em outros (teclado, touch). Sempre `onPress`.

---

## 4. Padrão de composição

```tsx
import {Button, Card} from "@heroui/react";

<Card>
  <Card.Header>
    <Card.Title>Pedido #1234</Card.Title>
    <Card.Description>Criado em 08/09/2026</Card.Description>
  </Card.Header>
  <Card.Content>{/* ... */}</Card.Content>
  <Card.Footer>
    <Button variant="secondary" onPress={onCancel}>Cancelar</Button>
    <Button variant="primary" onPress={onConfirm}>Confirmar pedido</Button>
  </Card.Footer>
</Card>
```

Nunca `<Card.Root title="..." description="...">` (API de props flat) — a lib é 100% compound component. Consulte `catalogo-componentes.md` para a lista de partes de cada componente antes de compor.

---

## 5. Fluxos completos

Se o pedido é uma tela ou fluxo (não um componente isolado), carregue também `padroes-ux.md` — cobre formulário multi-seção, tabela com filtro, confirmação destrutiva, empty/error state, ação em massa, alterações não salvas. Se envolve animação além do que a lib já anima por padrão, carregue `motion.md`.

---

## 6. Projeto incompatível — o que fazer

Não tente contornar. Reporte ao usuário, no formato:

```
Este projeto usa React <versão atual> e Tailwind <versão atual>. O Base exige
React 19 + Tailwind v4. Antes de montar esta tela, o projeto precisa migrar —
isso está fora do escopo deste pedido. Quer que eu ajude com a migração
primeiro, ou prefere que eu monte a tela com os componentes atuais do projeto
(sem o Base) por enquanto?
```

---

## Checklist desta etapa

- [ ] SCAN confirmou eixo Consumir (não é o monorepo da lib)
- [ ] React 19 + Tailwind v4 confirmados, ou o usuário foi avisado da incompatibilidade
- [ ] Todo componente usado existe em `catalogo-componentes.md` — nada de markup solto reinventando um componente pronto
- [ ] Todo valor visual é token, nunca hex/px cravado
- [ ] `onPress` usado em componentes da lib, nunca `onClick`
- [ ] Terminou em `checklist-auditoria.md` (gate final, sem exceção)

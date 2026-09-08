# Modo DESENVOLVER

Você está **dentro do monorepo da lib** (`packages/react`, `packages/styles`), criando ou editando um componente que a lib expõe para todo mundo. Erro aqui não afeta uma tela — afeta todo consumidor da lib.

---

## 0. SCAN — confirme que é este eixo, não Consumir

```bash
test -f packages/react/src/components/index.ts && echo "Confirmado: monorepo da lib"
```

Se este arquivo não existe no projeto atual, você está num app consumidor — use `modo-consumir.md`, não este.

---

## 1. Regra de ferro

**A camada certa, sempre.** Lógica e composição React Aria em `.tsx`. Mapeamento de variante → classe BEM em `.styles.ts`. Valor visual (cor, espaço, raio) em `.css`. Nunca misture — um `className="bg-blue-500"` direto num `.tsx` é sempre bug, mesmo que funcione visualmente.

**Valor novo nasce no tema, nunca no componente.** Precisa de uma cor, espaçamento ou duração que não existe em `packages/styles/themes/base/variables.css`? Adicione lá primeiro (nos dois blocos, light e dark), rode `pnpm skill:gen`, só depois use no componente. Nunca declare um valor solto dentro do `.css` de um componente.

**Nunca edite `themes/default/` nem os `.css` em `packages/styles/components/`.** É onde o `git merge upstream` (atualizações do HeroUI original) vai aplicar. Overrides de densidade/identidade do Base vivem em `packages/styles/themes/base/components/`.

---

## 2. Criando um componente novo

```bash
cd packages/react
pnpm add:component NomeDoComponente
```

**O scaffold gerado está desatualizado — corrija manualmente antes de continuar:**

1. Mova `packages/react/src/components/<nome>/<nome>.styles.ts` para `packages/styles/src/components/<nome>/<nome>.styles.ts`. Ajuste o import no `.tsx` para `@heroui/styles`.
2. Crie `packages/styles/components/<nome>.css` com as classes BEM (`.nome`, `.nome--variante`, `.nome__parte`) que o `.styles.ts` referencia. Importe-o em `packages/styles/components/index.css`.
3. Reescreva o `.tsx` gerado — ele vem com `React.forwardRef` genérico sobre uma `<div>`. Substitua pelo padrão real:
   - Encontre o primitivo equivalente em `react-aria-components` (consulte a doc deles antes de escrever).
   - Se o componente tem partes (header, trigger, content...), siga o padrão compound: cada parte é um componente próprio, exportado via `Object.assign(Root, {Part: Part, ...})` no `index.ts` — veja `packages/react/src/components/card/` como referência real.
   - Eventos de interação usam `onPress`, nunca `onClick`.
4. Rode `pnpm build` para atualizar os exports do `package.json` automaticamente.
5. Rode `pnpm skill:gen` — o novo componente precisa aparecer em `catalogo-componentes.md`.

---

## 3. Editando um componente existente

- Mudança de variante/tamanho → `.styles.ts` (mapeamento) + `.css` (valor visual).
- Mudança de comportamento/acessibilidade → `.tsx`, revalidando contra a doc do primitivo React Aria correspondente.
- Mudança de densidade/cor específica do Base (não do HeroUI upstream) → `packages/styles/themes/base/components/<nome>.css`, seguindo o padrão incremental já usado no `button.css` (comentário explicando o valor, `@apply` das classes Tailwind, nunca CSS solto).

Depois de qualquer mudança em `.styles.ts` ou `variables.css`: `pnpm skill:gen`. O commit falha sozinho se você esquecer (`check-drift.mjs` no pre-commit).

---

## 4. Validar visualmente

```bash
nvm use 22.14.0   # obrigatório — Node 24 trava o Storybook silenciosamente
pnpm dev          # sobe em localhost:6006
```

Percorra o componente em light e dark antes de considerar pronto. Overrides de densidade são aplicados um componente por vez (nunca em lote) — um valor errado aplicado a todos os 82 de uma vez é uma regressão silenciosa em todo consumidor.

---

## Checklist desta etapa

- [ ] SCAN confirmou eixo Desenvolver (dentro do monorepo)
- [ ] Estilo em `.styles.ts` + `.css`, nunca classe solta no `.tsx`
- [ ] Nenhum valor visual novo direto no CSS do componente — nasceu em `themes/base/variables.css`
- [ ] Nenhuma edição em `themes/default/` ou nos `.css` de `packages/styles/components/`
- [ ] `onPress` usado, não `onClick`
- [ ] `pnpm skill:gen` rodado após qualquer mudança em tokens ou variantes
- [ ] Validado visualmente no Storybook (Node 22.14.0), light e dark
- [ ] Terminou em `checklist-auditoria.md` (gate final, sem exceção)

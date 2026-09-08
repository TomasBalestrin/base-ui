# Modo AUDITAR

Revisar uma tela/componente **existente** contra o padrão Base e reportar onde ele diverge — sem corrigir nada. Auditoria é diagnóstico; aplicar a correção é o modo Consumir ou Desenvolver (o usuário decide qual, com base no relatório).

---

## 0. Pré-condição

Rode o **SCAN** do `SKILL.md` primeiro (eixo detectado — Consumir ou Desenvolver). Sempre carregados: `references/contrato-tokens.md` e `references/catalogo-componentes.md` — são a régua de comparação de todo achado abaixo.

---

## Passo 1 — Ler o alvo

Leia o arquivo/tela apontada pelo usuário por completo antes de rodar qualquer grep. Varredura mecânica sem entender o contexto do arquivo gera falso positivo (ex: um valor de `px` dentro de um comentário, ou uma cor hex que já é literal de gráfico/imagem, não de UI).

---

## Passo 2 — Varredura mecânica

Rode os greps abaixo no arquivo/pasta alvo. Todo resultado é candidato a achado — confirme contra o contexto antes de reportar (passo 4).

```bash
# Cor hexadecimal fora do tema Base
grep -rnoE '#[0-9a-fA-F]{3,8}\b' --include='*.css' --include='*.scss' --include='*.tsx' --include='*.jsx' --include='*.html' <alvo> \
  | grep -v 'themes/base/'

# Espaçamento cru fora da escala do Tailwind (padding/margin/gap com px direto em vez de utility)
grep -rnE '(padding|margin|gap)\s*:\s*[0-9]+px' --include='*.css' --include='*.scss' <alvo>

# Radius cru em vez de var(--radius)/utility
grep -rnE 'border-radius\s*:\s*[0-9]+px' --include='*.css' --include='*.scss' <alvo>

# outline removido sem substituto de foco visível
grep -rnE 'outline\s*:\s*(none|0)\b' --include='*.css' --include='*.scss' <alvo>

# Elemento clicável sem semântica de botão
grep -rnE '<div[^>]*onClick|<span[^>]*onClick' --include='*.tsx' --include='*.jsx' <alvo> | grep -v 'role='

# Input sem label associado (heurística: <input>/<TextField> sem aria-label nem htmlFor correspondente)
grep -rn '<input\|<TextField\|<Input ' --include='*.tsx' --include='*.jsx' <alvo>
grep -rn 'htmlFor=\|<Label' --include='*.tsx' --include='*.jsx' <alvo>
# cruzar as duas listas: todo campo sem aria-label/aria-labelledby precisa ter Label/htmlFor correspondente

# onClick em vez de onPress (React Aria) — armadilha comum ao portar código antigo
grep -rn 'onClick=' --include='*.tsx' --include='*.jsx' <alvo> | grep -iE 'Button|Chip|Tab|MenuItem|ListBoxItem'
```

---

## Passo 3 — Comparar contra o catálogo

Além da varredura mecânica, compare estrutura contra `catalogo-componentes.md`:

- **Composição incorreta** — partes do compound component fora de ordem ou faltando (ex: `Card.Content` sem `Card.Header`), ou uso de markup solto onde existe um componente pronto.
- **Variante que não existe no catálogo** — um `variant` de `Button`/`Alert`/`Badge` fora do eixo listado no catálogo para aquele componente.
- **Estado faltando** — botão sem estado de loading numa ação assíncrona, listagem sem tratamento de vazio/erro.
- **Usabilidade** — compare também contra a seção "Usabilidade" de `checklist-auditoria.md` (feedback de ação demorada, erro técnico cru exposto, ação sem saída fácil, botão inválido habilitado sem prevenção, toolbar/menu com opção demais, ícone-only sem tooltip). Esses cinco não têm grep equivalente: são leitura de tela, não padrão de texto.

---

## Passo 4 — Classificar por severidade

| Severidade | Critério |
|---|---|
| **Crítico** | Quebra acessibilidade (foco não navegável, elemento sem nome acessível, input sem label, contraste abaixo do mínimo, cor como único indicador de estado, `<div>`/`<span>` clicável sem semântica de botão, overflow horizontal de página inteira), cor hexadecimal solta fora do tema Base, erro técnico cru exposto ao usuário final, ou ação destrutiva sem "Cancelar"/saída fácil |
| **Importante** | Espaçamento/radius/duração fora do contrato, composição incorreta do compound component, variante que não existe no catálogo, estado obrigatório faltando (sem loading, sem empty state numa listagem), `aria-label` genérico repetido, `onClick` onde o componente espera `onPress`, botão de ação inválida habilitado sem prevenção, ou toolbar/menu com mais de ~7 ações sem agrupamento |
| **Menor** | Nomenclatura fora do padrão BEM do componente, formato de data/moeda incorreto, ícone-only sem tooltip |

Tabela idêntica à de `references/checklist-auditoria.md` (fonte única — se um dia divergirem, esse arquivo é quem vence, corrija aqui). Nunca invente uma escala nova por auditoria.

---

## Passo 5 — Reportar

Formato por achado, sempre: `arquivo:linha — o que está errado — o valor/padrão certo pra usar no lugar`. Agrupe por severidade (crítico primeiro). **Nunca corrigir automaticamente** — o relatório é a entrega deste modo; se o usuário pedir "agora corrige", isso é um pedido novo de modo Consumir (ajuste pontual) ou Desenvolver (componente inteiro fora do padrão).

Exemplos de achado bem formatado:

```
[CRÍTICO] checkout.tsx:42 — cor #0072F5 hardcoded no botão de finalizar — trocar por <Button variant="primary">, que já resolve para --accent
[CRÍTICO] form.tsx:18 — <div onClick> sem role, não navegável por teclado — trocar por <Button> ou role="button" + onKeyDown
[IMPORTANTE] client-table.tsx:67 — <button onClick={...}> dentro de linha de tabela — trocar por componente React Aria com onPress
[IMPORTANTE] status-badge.tsx:5 — variant="cinza-escuro" não existe no catálogo do Badge — usar variant="secondary" ou "outline" (ver catalogo-componentes.md)
[MENOR] modal-confirmacao.tsx:30 — botão de confirmar com texto "Confirmar" — nomear a ação (ex: "Excluir cliente")
```

Se a varredura não encontrar nada de crítico/importante, diga isso explicitamente — não force achado menor só para preencher o relatório.

---

## Checklist desta etapa

- [ ] Arquivo/tela lido por completo antes de qualquer grep
- [ ] Os greps mecânicos rodados, resultado confirmado contra o contexto — sem reportar falso positivo
- [ ] Estrutura comparada contra `catalogo-componentes.md` (composição, estados, variantes)
- [ ] Todo achado classificado em crítico/importante/menor
- [ ] Relatório no formato `arquivo:linha — erro — correção`, agrupado por severidade
- [ ] Nenhuma correção aplicada automaticamente — só diagnóstico

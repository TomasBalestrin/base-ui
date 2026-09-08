# Contribuindo com o Base

Design system interno derivado do HeroUI v3 (Apache 2.0). Este documento cobre o que muda em relação a um projeto HeroUI comum: como rodar, como liberar uma versão, e como puxar atualizações do upstream.

## Setup

Node **22.14.0** exato, via nvm — Node 24 trava o Storybook silenciosamente (sem erro, sem log, só nunca termina de subir).

```bash
nvm install 22.14.0
nvm use 22.14.0
pnpm install
```

## Rodando localmente

```bash
pnpm dev      # Storybook em localhost:6006 — visualização dos 82 componentes com o tema Base
pnpm build    # builda @heroui/styles e @heroui/react
```

## A skill `base-ui`

Instalada por symlink (`skills/base-ui/install.sh`), não por cópia — `git pull` já mantém atualizada. Rode uma vez:

```bash
./skills/base-ui/install.sh
```

Dois arquivos de referência da skill são **gerados**, nunca editados à mão: `references/contrato-tokens.md` e `references/catalogo-componentes.md`. Depois de mudar um token (`packages/styles/themes/base/variables.css`) ou a lista de componentes exportados, rode:

```bash
pnpm skill:gen
```

Um hook de pre-commit (`skill:check-drift`) bloqueia o commit se você esquecer.

## Estrutura de branches

- **`v3`** — espelho puro do upstream HeroUI. Nunca commite aqui diretamente; só recebe merge do `upstream`.
- **`main`** — onde o trabalho acontece. Código-fonte do design system Base.
- **`release`** — **gerada**, nunca editada à mão. Contém só `packages/react/dist` e `packages/styles/dist` já buildados, num workspace pnpm mínimo de 2 pacotes. É a branch que projetos consumidores instalam via git.

## Publicando uma nova versão (release)

```bash
./scripts/release.sh
git push origin release --force
```

O script builda os dois pacotes, reescreve os `package.json` para o formato de publicação (exports apontando pro `dist/`, mesma transformação que `pnpm pack` faria), e fixa `@heroui/styles` numa versão exata dentro de `@heroui/react` — `workspace:*` não resolve quando alguém instala só um dos dois pacotes via `path:` isolado, então isso é necessário, não cosmético.

**Sempre rode o release depois de mudar `packages/react` ou `packages/styles`.** A branch `release` não atualiza sozinha.

### Como um projeto consome

```bash
pnpm add "@heroui/react@git+ssh://git@github.com/TomasBalestrin/base-ui.git#release&path:packages/react" \
         "@heroui/styles@git+ssh://git@github.com/TomasBalestrin/base-ui.git#release&path:packages/styles"
```

E no CSS global:

```css
@import "@heroui/styles";
@import "@heroui/styles/themes/base";
```

Sempre os dois pacotes juntos — nunca só um.

## Puxando atualizações do HeroUI upstream

Os pacotes nunca foram renomeados (continuam `@heroui/react`/`@heroui/styles`) exatamente para manter isso viável:

```bash
git fetch upstream
git checkout v3
git merge upstream/v3          # deve ser fast-forward
git push origin v3

git checkout main
git merge v3                   # traz as mudanças pro trabalho ativo
```

O tema Base vive inteiro em `packages/styles/themes/base/` (pasta irmã de `themes/default/`), então conflito de merge é raro — só acontece se o upstream adicionar código na mesma linha que você editou fora dessa pasta. **Nunca edite `themes/default/` nem os `.css` em `packages/styles/components/`** — é onde o merge do upstream se aplica.

## Compatibilidade

A lib exige **React 19** e **Tailwind CSS v4**. Projetos em React 18 ou Tailwind v3 precisam migrar primeiro — a skill detecta isso automaticamente (`modo-consumir.md`, seção 1) e avisa em vez de gerar código que quebra.

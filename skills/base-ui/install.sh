#!/usr/bin/env bash
# Installs the base-ui skill for Claude Code via symlink, so `git pull`
# keeps it in sync automatically — no reinstall step needed after updates.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/.claude/skills/base-ui"

mkdir -p "$HOME/.claude/skills"

if [ -L "$TARGET" ]; then
  CURRENT_SRC="$(readlink "$TARGET")"
  if [ "$CURRENT_SRC" = "$SCRIPT_DIR" ]; then
    echo "base-ui já está instalada e aponta para este repositório."
    exit 0
  fi
  echo "Symlink existente aponta para outro lugar ($CURRENT_SRC) — atualizando."
  rm "$TARGET"
elif [ -e "$TARGET" ]; then
  echo "Erro: $TARGET já existe e não é um symlink (provavelmente a skill bethel-ux-ui antiga, ou uma cópia manual)."
  echo "Remova ou renomeie antes de rodar este script."
  exit 1
fi

if ln -s "$SCRIPT_DIR" "$TARGET" 2>/dev/null; then
  echo "Instalada via symlink: $TARGET -> $SCRIPT_DIR"
  echo "git pull neste repositório já mantém a skill atualizada."
else
  echo "Symlink falhou (ambiente sem suporte) — copiando arquivos como fallback."
  cp -R "$SCRIPT_DIR" "$TARGET"
  echo "Copiada para: $TARGET"
  echo "Atenção: cópia não atualiza sozinha. Rode este script de novo após cada git pull."
fi

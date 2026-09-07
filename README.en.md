[Русский](README.md) · English

# advisor-decision — Claude Code plugin

Command: `/advisor-decision`.

## Было → стало

To be written (README contract 2026-09, phase 3).

## Как это работает

Пять линз (вероятностная, системная, процессная, выпуклость, когнитивные искажения) и три структурные роли разбирают решение независимо, скептики перекрёстно проверяют утверждения, валидатор с роутером Канемана — Кляйна взвешивает линзы и пишет один вердикт файлом.

## Установка и первый запуск

```bash
claude plugin marketplace add https://github.com/beCyborg/jadlis-start.git
claude plugin install advisor-decision@jadlis --config MEMORY_DIR=~/advisors-memory
```

## Границы, стоимость, обновление

Book digests are derivative works, no licence: see [NOTICE.md](NOTICE.md). This repository is generated from a private source; open issues here, edits land in the source.

```bash
claude plugin marketplace update jadlis
claude plugin update advisor-decision@jadlis
```

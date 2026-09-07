Русский · [English](README.en.md)

# Трудное решение: 5 линз, скептики, один вердикт

Плагин `advisor-decision` для Claude Code. Команда — `/advisor-decision`.

## Было → стало

Раздел заполняется по контракту README 2026-09 (фаза 3 плана «GitHub beCyborg как витрина Jadlis»).

## Как это работает

Пять линз (вероятностная, системная, процессная, выпуклость, когнитивные искажения) и три структурные роли разбирают решение независимо, скептики перекрёстно проверяют утверждения, валидатор с роутером Канемана — Кляйна взвешивает линзы и пишет один вердикт файлом.

## Установка и первый запуск

```bash
claude plugin marketplace add https://github.com/beCyborg/jadlis-start.git
claude plugin install advisor-decision@jadlis --config MEMORY_DIR=~/advisors-memory
```

## Границы, стоимость, обновление

Конспекты книг — производные работы, лицензии нет: см. [NOTICE.md](NOTICE.md). Правки принимаются только в источнике (`jadlis-advisors-source`), этот репо генерируется.

```bash
claude plugin marketplace update jadlis
claude plugin update advisor-decision@jadlis
```

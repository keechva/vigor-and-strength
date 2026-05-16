---
name: Tech debt cleanup — stale training/kungfu/массаж refs, lint, README
description: Поиск и зачистка устаревшего именования (training без s, kungfu, массаж в /banya), проверки lint+tsc, актуализация README
---

# План зачистки технического долга

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (батч-исполнение в текущей сессии).

**Goal:** Привести репозиторий в согласованное состояние после переименования /training → /trainings и удаления массажа из /banya. Никаких визуальных правок — только текстовые рассогласования + lint + README.

**Architecture:** Прямолинейная зачистка. Сначала grep по 4 паттернам, выписываем находки в чат, потом точечные правки через Edit. В конце — npm run lint и npx tsc --noEmit, актуализация README, коммит и пуш.

**Tech Stack:** ripgrep (grep -r), Next.js 14, TypeScript, ESLint.

---

### Task 1: Discovery — собрать все находки

**Files:** read-only

- [ ] **Step 1.1:** Найти `training` (без s) в app/ и docs/, исключая node_modules и .next. Перечислить в чате (файл:строка + контекст).
- [ ] **Step 1.2:** Найти `kungfu` в app/ и docs/. Перечислить в чате.
- [ ] **Step 1.3:** Найти `массаж` (любая форма: массаж, массажа, массажу, массажный, массажист…) в `app/_components/banya/` и `app/banya/`. Перечислить в чате.
- [ ] **Step 1.4:** Найти захардкоженные `/training` (без s) в href / Link / meta. Часть пересечётся с 1.1, ничего страшного.

Команды:
```bash
cd /home/user/projects/vigor-and-strength
grep -rn 'training' app/ docs/ --include='*.ts' --include='*.tsx' --include='*.md' --include='*.css' | grep -v 'trainings'
grep -rn 'kungfu' app/ docs/ --include='*.ts' --include='*.tsx' --include='*.md' --include='*.css'
grep -rinE 'массаж' app/_components/banya/ app/banya/
grep -rn '"/training[^s]' app/ --include='*.ts' --include='*.tsx'
grep -rn "'/training[^s]" app/ --include='*.ts' --include='*.tsx'
```

После step 1.1–1.4 — выписать всё, что нашлось, в один список в чат. Только после этого приступать к Task 2.

---

### Task 2: Фиксы

**Files:** зависит от находок.

Правила правки:
- `/training` (href или ссылка, без s) → `/trainings`
- `/kungfu` (href или ссылка) → `/trainings`
- `direction === "training"` → `direction === "trainings"`
- `DIRECTION_LABELS["training"]` (или `.training`) → `DIRECTION_LABELS["trainings"]` (или `.trainings`)
- В метаданных и текстах: «кунгфу» сохраняем там, где про конкретное поднаправление; «тренировки» — там, где про общее направление.
- «Массаж» в любой форме в файлах banya/ — переписать в тоне страницы /banya: про ощущения, прогретое тело, отзывчивость. Никаких «не массаж» — говорим о том, что есть.

- [ ] **Step 2.1:** Для каждой находки из Task 1 — Edit с конкретной правкой.
- [ ] **Step 2.2:** Если попался файл данных (например `app/_lib/data/*.ts` с DIRECTION_LABELS) — поправить ключ + все места использования (TS даст ошибку, если что-то не сходится).

---

### Task 3: Lint + tsc

- [ ] **Step 3.1:** `npm run lint`. Если warnings/errors — выписать в чат. Если явный баг (unused imports/vars, hooks deps) — поправить. Косметику не трогать.
- [ ] **Step 3.2:** `npx tsc --noEmit`. Если ошибки — выписать; чинить только если очевидно как.

---

### Task 4: README актуализация

**Files:**
- Modify: `README.md`

- [ ] **Step 4.1:** Найти раздел «Что в работе». Привести чек-лист к виду:

```markdown
- [x] Главная (/)
- [x] Баня (/banya) с конфигуратором
- [x] Релаксология (/relax)
- [x] Локации (/locations + /locations/[slug])
- [x] Тренировки (/trainings)
- [ ] Хаб мастеров (/masters)
- [ ] Бэкенд формы заявки
- [ ] Замена placeholder-данных на реальные
- [ ] Деплой на боевой домен
```

(Сохранить существующий стиль раздела вокруг — не переписывать его целиком.)

---

### Task 5: Коммит и пуш

- [ ] **Step 5.1:** Если файлы изменились —
```bash
git add .
git commit -m "почисти рассогласования: остатки training/kungfu, README актуальный"
git push
```
- [ ] **Step 5.2:** Если ничего не нашлось и не правилось — сообщить в чат «репозиторий уже чистый, коммит не нужен».

---

## Self-Review

- ✅ Покрытие: все 5 задач из тз пользователя присутствуют.
- ✅ Без placeholder'ов: все команды конкретные.
- ✅ Type consistency: правка `direction === "training"` → `"trainings"` идёт парой с `DIRECTION_LABELS`, чтобы tsc был доволен.
- ⚠️ Discovery → правки: правки идут только после явного списка находок в чат. Это контракт с пользователем.

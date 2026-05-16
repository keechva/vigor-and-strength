---
name: Точечные правки данных и компонентов мастеров
description: directions Никиты/Марии, удаление tagsDisplay, общий DIRECTION_LABELS, фикс trainings→Тренировки
---

# Master Data Fixes Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (batch inline).

**Goal:** Исправить рассогласования предыдущего коммита: вернуть Никите/Марии правильные directions, удалить дубликат `tagsDisplay`, централизовать `DIRECTION_LABELS`, восстановить `trainings: "Тренировки"`.

**Architecture:** Точечные правки. Источник истины — `app/_lib/data/masters.ts`. Все остальные локальные определения `DIRECTION_LABELS` сносим, импортируем из data. Аналогично `DIRECTION_INFO` в `MasterDetailDirections.tsx` (отдельная константа, не DIRECTION_LABELS, но содержит ту же неправильную метку) — поправляем точечно.

**Ключевые наблюдения после разведки:**
- `Masters.tsx:30` — единственное использование `master.tagsDisplay`. Заменяем на вычисление через DIRECTION_LABELS.
- 5 файлов с локальным `DIRECTION_LABELS`: 2 неправильных (masters/Hero, masters/Contact), 3 правильных (locations/Hero, locations/Grid, locations/Contact) — но все переводим на импорт.
- `LocationDetailDirections.tsx:18` использует другую константу с `title: "Тренировки"` — уже корректно, не трогаем.
- `MasterDetailDirections.tsx:14` — `DIRECTION_INFO.trainings.label = "Кунгфу"` — точечный фикс, без переноса в data (это про cross-link с CTA и href, не просто метка).
- «Кунгфу» легитимно: `masters.ts:125` (caption фото Дмитрия), `TrainingsKungfu.tsx:3` (aria-label компонента-секции).

---

## File Structure

**Modify:**
- `app/_lib/data/masters.ts` — экспортный `DIRECTION_LABELS`, фикс directions Никиты/Марии (data + directionDetails), удаление tagsDisplay из типа и всех 6 мастеров
- `app/_components/Masters.tsx` — `master.tagsDisplay` → вычисление через DIRECTION_LABELS
- `app/_components/masters/MasterDetailHero.tsx` — снести локальный DIRECTION_LABELS, импорт
- `app/_components/masters/MasterDetailContact.tsx` — снести локальный DIRECTION_LABELS, импорт
- `app/_components/masters/MasterDetailDirections.tsx` — фикс `DIRECTION_INFO.trainings.label` → "Тренировки"
- `app/_components/locations/LocationDetailHero.tsx` — снести локальный, импорт
- `app/_components/locations/LocationDetailContact.tsx` — снести локальный, импорт
- `app/_components/locations/LocationsGrid.tsx` — снести локальный, импорт

---

### Task 1: data/masters.ts — экспорт DIRECTION_LABELS + фикс данных

**Files:** `app/_lib/data/masters.ts`

- [ ] **Step 1.1** — Добавить экспортный `DIRECTION_LABELS` сразу после объявления типа `Direction` (в начале файла):

```ts
export const DIRECTION_LABELS: Record<Direction, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};
```

- [ ] **Step 1.2** — Удалить поле `tagsDisplay: string;` из типа `Master`.

- [ ] **Step 1.3** — Удалить строки `tagsDisplay: "…",` у всех 6 мастеров (Дмитрий, Александр, Вадим, Никита, Анна, Мария).

- [ ] **Step 1.4** — У **Никиты**:
  - `directions: ["banya"]` → `directions: ["banya", "relax"]`
  - В `directionDetails` добавить `relax: PLACEHOLDER_DIRECTION,`

- [ ] **Step 1.5** — У **Марии**:
  - `directions: ["relax"]` → `directions: ["banya", "relax"]`
  - В `directionDetails` добавить `banya: PLACEHOLDER_DIRECTION,`

---

### Task 2: Masters.tsx — заменить tagsDisplay на вычисление

**Files:** `app/_components/Masters.tsx:30`

- [ ] **Step 2.1** — Добавить импорт `DIRECTION_LABELS` в существующую строку импорта из data:
  - was: `import { MASTERS, type Direction, type Master } from "../_lib/data/masters";`
  - new: `import { DIRECTION_LABELS, MASTERS, type Direction, type Master } from "../_lib/data/masters";`

- [ ] **Step 2.2** — Заменить `<div className="tags">{master.tagsDisplay}</div>` на:

```tsx
      <div className="tags">
        {master.directions.map((d) => DIRECTION_LABELS[d]).join(" · ")}
      </div>
```

---

### Task 3: masters/MasterDetailHero.tsx — импорт DIRECTION_LABELS

**Files:** `app/_components/masters/MasterDetailHero.tsx`

- [ ] **Step 3.1** — Заменить локальное определение:
  - удалить блок `const DIRECTION_LABELS: Record<string, string> = { banya:…, relax:…, trainings:"Кунгфу" };`
  - в импорте поменять `import type { Master } from "@/app/_lib/data/masters";` на `import { DIRECTION_LABELS, type Master } from "@/app/_lib/data/masters";`

- [ ] **Step 3.2** — В `.map((d) => DIRECTION_LABELS[d] ?? d)` оставить как есть — типы Direction теперь покрывают все ключи, но defensive `?? d` не мешает.

---

### Task 4: masters/MasterDetailContact.tsx — импорт DIRECTION_LABELS

**Files:** `app/_components/masters/MasterDetailContact.tsx`

- [ ] **Step 4.1** — Удалить локальный `const DIRECTION_LABELS = {…trainings:"Кунгфу"…};` и в импорте `import type { Master } from "@/app/_lib/data/masters";` заменить на `import { DIRECTION_LABELS, type Master } from "@/app/_lib/data/masters";`.

---

### Task 5: masters/MasterDetailDirections.tsx — точечный фикс label

**Files:** `app/_components/masters/MasterDetailDirections.tsx:14`

- [ ] **Step 5.1** — В `DIRECTION_INFO.trainings`:
  - was: `label: "Кунгфу",`
  - new: `label: "Тренировки",`

CTA и href не трогаем (они и так корректные: `/trainings`).

---

### Task 6: locations/LocationDetailHero.tsx — импорт DIRECTION_LABELS

**Files:** `app/_components/locations/LocationDetailHero.tsx`

- [ ] **Step 6.1** — Удалить локальный `const DIRECTION_LABELS = {…};`, в импорте `import type { Location } from "@/app/_lib/data/locations";` оставить как есть и **добавить** строку:

```ts
import { DIRECTION_LABELS } from "@/app/_lib/data/masters";
```

---

### Task 7: locations/LocationDetailContact.tsx — импорт DIRECTION_LABELS

**Files:** `app/_components/locations/LocationDetailContact.tsx`

- [ ] **Step 7.1** — Удалить локальный `const DIRECTION_LABELS = {…};`, добавить:

```ts
import { DIRECTION_LABELS } from "@/app/_lib/data/masters";
```

---

### Task 8: locations/LocationsGrid.tsx — импорт DIRECTION_LABELS

**Files:** `app/_components/locations/LocationsGrid.tsx`

- [ ] **Step 8.1** — Удалить локальный `const DIRECTION_LABELS = {…};`, добавить:

```ts
import { DIRECTION_LABELS } from "@/app/_lib/data/masters";
```

---

### Task 9: Проверки

- [ ] **Step 9.1** — `npx tsc --noEmit` — чисто.
- [ ] **Step 9.2** — `grep -rn 'tagsDisplay' app/` — должно быть пусто.
- [ ] **Step 9.3** — Список локальных DIRECTION_LABELS:

```bash
grep -rn 'DIRECTION_LABELS' app/ --include='*.ts' --include='*.tsx'
```

Ожидается: единственное `const DIRECTION_LABELS` в `app/_lib/data/masters.ts`. Все остальные — `import { DIRECTION_LABELS, … }` или использование `DIRECTION_LABELS[d]`.

- [ ] **Step 9.4** — «Кунгфу» осталось только в легитимных местах:

```bash
grep -rn 'Кунгфу' app/ --include='*.ts' --include='*.tsx'
```

Ожидаются: `app/_lib/data/masters.ts:…` (caption фото Дмитрия), `app/_components/trainings/TrainingsKungfu.tsx:…` (aria-label секции), и могут быть упоминания внутри `TrainingsKungfu.tsx` как название поднаправления (это норма).

- [ ] **Step 9.5** — Поднять dev и curl страницы Никиты и Марии — у обоих в hero/Directions/Contact-select должны появиться оба направления:

```bash
npm run dev > /tmp/devserver.log 2>&1 &
until grep -qE 'Ready|Local' /tmp/devserver.log; do sleep 1; done
PORT=$(grep -oE 'localhost:[0-9]+' /tmp/devserver.log | head -1 | cut -d: -f2)
echo "Port: $PORT"
echo '--- Никита ---'
curl -s "http://localhost:$PORT/masters/nikita" | grep -oE 'Баня · Релаксология|Баня|Релаксология' | sort | uniq -c
echo '--- Мария ---'
curl -s "http://localhost:$PORT/masters/mariya" | grep -oE 'Баня · Релаксология|Баня|Релаксология' | sort | uniq -c
pkill -f 'next dev' || true
```

---

### Task 10: Commit + push

- [ ] **Step 10.1**:

```bash
git add app/_lib/data/masters.ts \
  app/_components/Masters.tsx \
  app/_components/masters/MasterDetailHero.tsx \
  app/_components/masters/MasterDetailContact.tsx \
  app/_components/masters/MasterDetailDirections.tsx \
  app/_components/locations/LocationDetailHero.tsx \
  app/_components/locations/LocationDetailContact.tsx \
  app/_components/locations/LocationsGrid.tsx \
  docs/superpowers/plans/2026-05-16-master-data-fixes.md
git commit -m "исправь рассогласования: directions Никиты и Марии, убери дубликат tagsDisplay, верни trainings→Тренировки, общий DIRECTION_LABELS"
git push
```

---

## Self-Review

- ✅ Spec coverage: 6 user-задач — directions Никиты/Марии, удаление tagsDisplay, замена «Кунгфу»→«Тренировки», централизация DIRECTION_LABELS, проверки, коммит.
- ✅ Placeholder scan: нет.
- ✅ Type consistency: `DIRECTION_LABELS: Record<Direction, string>` — тип сужает ключи, в map `[d]` уже не вернёт undefined.
- ⚠️ Decision: `MasterDetailDirections.tsx` использует `DIRECTION_INFO` (отдельная структура с label+href+cta), фикс делаем точечно (label), без рефакторинга в централизацию — это другая структура данных.
- ⚠️ Decision: оставляю defensive `?? d` / `|| d` в местах использования, хотя `Record<Direction>` его делает излишним — не правлю чтобы не раздувать diff.

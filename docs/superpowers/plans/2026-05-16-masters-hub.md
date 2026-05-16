---
name: /masters hub page
description: Хаб всех мастеров — hero, фильтр по направлениям, сетка карточек, cross-links. Последняя из основных страниц MVP.
---

# /masters Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (batch inline в текущей сессии).

**Goal:** Запустить `/masters` — хаб всех мастеров с client-фильтром по направлениям. Server-shell + единственный client-wrapper для состояния фильтра.

**Architecture:**
- `app/masters/page.tsx` (server) — рендерит `<MastersHubClient />` + `<Footer />`. Footer остаётся server-component снаружи.
- `MastersHubClient` (client) — держит `selectedDirection` state, оркеструет Hero/Filters/Grid/CrossLinks с bridges между ними.
- Hero/Grid/CrossLinks — server-компоненты (без state). `MastersHubFilters` — client (нужен `onClick`).
- Grid фильтрует список через props (без state, чистая функция от `filterDirection`).

**Tech Stack:** Next.js 14 App Router, React client/server разделение, существующие CSS-классы `.zone.warm`, `.zone.cool`, `.master`, `.portrait`, `.crosslinks`, `.crosslink`, новые `.masters-hub-*`.

**Ключевые наблюдения после разведки:**
1. `MASTERS` data сейчас содержит 4 человека (Дмитрий, Александр, Вадим, Анна) — не 6. Спека упоминает 6 как абстрактное число. Сетка отрендерит фактическое количество.
2. `Masters.tsx:36-37` — дефолты уже `ctaHref="/masters"`, `ctaLabel="Все мастера →"`. На главной (`app/page.tsx:21`) `<Masters />` без props → CTA уже есть и уже ведёт на `/masters`. **Task 6 = verify-only.**
3. `Header.tsx:9` — уже есть `{ href: "/#masters", label: "Мастера" }`. **Task 5 = изменить href на `/masters`**, а не добавлять дубль.
4. `MasterCard` определён внутри `Masters.tsx`, не экспортируется. Решение: экспортируем как `MasterCard`, переиспользуем в `MastersHubGrid` — гарантия идентичной разметки и стилей.
5. На странице `/masters` после grid идёт переход warm→cool. Используем `bridge-warm-to-cool` (на `app/page.tsx:22` это уже занято под именем `bridge-warm-to-cool-2`, но в нашем потоке это первый переход → берём базовый).

---

## File Structure

- Create: `app/masters/page.tsx` (server)
- Create: `app/_components/masters-hub/MastersHubClient.tsx` (client)
- Create: `app/_components/masters-hub/MastersHubHero.tsx` (server)
- Create: `app/_components/masters-hub/MastersHubFilters.tsx` (client)
- Create: `app/_components/masters-hub/MastersHubGrid.tsx` (server)
- Create: `app/_components/masters-hub/MastersHubCrossLinks.tsx` (server)
- Modify: `app/_components/Masters.tsx` — добавить `export` у `MasterCard`
- Modify: `app/_components/Header.tsx:9` — `/#masters` → `/masters`
- Modify: `app/globals.css` — добавить `.masters-hub-title`, `.masters-hub-filters`, `.masters-hub-filter`, `.masters-hub-filter:hover`, `.masters-hub-filter.is-active`, `.masters-hub-grid` (+ адаптация под mobile)

---

### Task 1: Экспортировать MasterCard из Masters.tsx

**Files:** `app/_components/Masters.tsx:11`

- [ ] **Step 1.1** — В `Masters.tsx` поменять `function MasterCard(...)` на `export function MasterCard(...)`. Больше ничего не трогать.

---

### Task 2: MastersHubHero (server, статика)

**Files:** Create `app/_components/masters-hub/MastersHubHero.tsx`

- [ ] **Step 2.1** — Создать файл:

```tsx
export function MastersHubHero() {
  return (
    <section className="hero">
      <div className="hero-sub">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Мастера
          </div>
          <h1>Мастера</h1>
          <p className="banya-hero-lead">
            Все, кто работает в&nbsp;проектах бани, релаксологии и&nbsp;тренировок.
            Расписание зависит от&nbsp;направления и&nbsp;формата&nbsp;— обсуждается в&nbsp;звонке.
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 3: MastersHubFilters (client)

**Files:** Create `app/_components/masters-hub/MastersHubFilters.tsx`

- [ ] **Step 3.1** — Создать файл с client-директивой и типизированными props:

```tsx
"use client";

export type MastersHubFilterValue = "all" | "banya" | "relax" | "trainings";

type Props = {
  selected: MastersHubFilterValue;
  onChange: (value: MastersHubFilterValue) => void;
};

const OPTIONS: { value: MastersHubFilterValue; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "banya", label: "Баня" },
  { value: "relax", label: "Релаксология" },
  { value: "trainings", label: "Тренировки" },
];

export function MastersHubFilters({ selected, onChange }: Props) {
  return (
    <section className="zone warm" aria-label="Фильтр по направлению">
      <div className="wrap">
        <div className="meta">Команда</div>
        <h2 className="masters-hub-title">Кто работает</h2>

        <div className="masters-hub-filters" role="tablist">
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`masters-hub-filter${isActive ? " is-active" : ""}`}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Why type export:** `MastersHubFilterValue` будет переиспользован в `MastersHubClient` и `MastersHubGrid` — единый источник истины для значений фильтра.

---

### Task 4: MastersHubGrid (server)

**Files:** Create `app/_components/masters-hub/MastersHubGrid.tsx`

- [ ] **Step 4.1** — Создать файл с типизированной фильтрацией и переиспользованием `MasterCard`:

```tsx
import { MASTERS, type Direction } from "../../_lib/data/masters";
import { MasterCard } from "../Masters";
import type { MastersHubFilterValue } from "./MastersHubFilters";

type Props = {
  filterDirection: MastersHubFilterValue;
};

export function MastersHubGrid({ filterDirection }: Props) {
  const list =
    filterDirection === "all"
      ? MASTERS
      : MASTERS.filter((m) =>
          m.directions.includes(filterDirection as Direction),
        );

  return (
    <section
      className="zone warm"
      aria-label="Список мастеров"
      style={{ paddingTop: 0 }}
    >
      <div className="wrap">
        {list.length === 0 ? (
          <p className="banya-hero-lead">
            Нет мастеров в&nbsp;этом направлении.
          </p>
        ) : (
          <div className="masters-hub-grid">
            {list.map((m) => (
              <MasterCard key={m.name} master={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

**Why `paddingTop: 0`:** фильтры и grid визуально — одна warm-зона; на стыке двух `.zone warm` не нужен двойной верхний паддинг grid'а.

**Why `as Direction`:** type-narrowing — после `filterDirection === "all"` ветки в `else` остаются только литералы Direction.

---

### Task 5: MastersHubCrossLinks (server)

**Files:** Create `app/_components/masters-hub/MastersHubCrossLinks.tsx`

- [ ] **Step 5.1** — Создать файл по образцу `LocationsCrossLinks`:

```tsx
export function MastersHubCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/banya">
            <span className="cl-eyebrow">Направление</span>
            <h3 className="cl-title">Баня</h3>
            <span className="cl-arrow">Все программы и&nbsp;форматы&nbsp;→</span>
          </a>
          <a className="crosslink" href="/relax">
            <span className="cl-eyebrow">Направление</span>
            <h3 className="cl-title">Релаксология</h3>
            <span className="cl-arrow">Подход и&nbsp;формат&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 6: MastersHubClient (client wrapper со state)

**Files:** Create `app/_components/masters-hub/MastersHubClient.tsx`

- [ ] **Step 6.1** — Создать файл:

```tsx
"use client";

import { useState } from "react";
import { MastersHubHero } from "./MastersHubHero";
import {
  MastersHubFilters,
  type MastersHubFilterValue,
} from "./MastersHubFilters";
import { MastersHubGrid } from "./MastersHubGrid";
import { MastersHubCrossLinks } from "./MastersHubCrossLinks";

export function MastersHubClient() {
  const [selectedDirection, setSelectedDirection] =
    useState<MastersHubFilterValue>("all");

  return (
    <>
      <MastersHubHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <MastersHubFilters
        selected={selectedDirection}
        onChange={setSelectedDirection}
      />
      <MastersHubGrid filterDirection={selectedDirection} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <MastersHubCrossLinks />
    </>
  );
}
```

**Important:** Hero рендерится изнутри client wrapper'а (как в спеке user'а), но сам hero — обычный server-компонент. Next.js нормально импортирует server-компоненты внутрь client — они становятся «server-children» (без props без RSC).

---

### Task 7: app/masters/page.tsx

**Files:** Create `app/masters/page.tsx`

- [ ] **Step 7.1** — Создать файл (точно как user в спеке):

```tsx
import type { Metadata } from "next";
import { MastersHubClient } from "@/app/_components/masters-hub/MastersHubClient";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Мастера — Бодрость и Сила",
  description:
    "Команда мастеров: пар-мастера, релаксологи, тренеры. Все, кто работает в проектах бани, релаксологии и тренировок в Оренбурге.",
};

export default function MastersHubPage() {
  return (
    <main>
      <MastersHubClient />
      <Footer />
    </main>
  );
}
```

---

### Task 8: Header — поменять /#masters → /masters

**Files:** `app/_components/Header.tsx:9`

- [ ] **Step 8.1** — Edit:
  - old: `  { href: "/#masters", label: "Мастера" },`
  - new: `  { href: "/masters", label: "Мастера" },`

Бургер-меню использует тот же `LINKS` массив (строки 87–93), отдельная правка не нужна.

---

### Task 9: CSS — стили хаба

**Files:** Modify `app/globals.css` — добавить блок в конец файла.

- [ ] **Step 9.1** — Добавить в `globals.css`:

```css
/* ============ MASTERS HUB ============ */
.masters-hub-title {
  font-family: var(--font-serif), serif;
  font-weight: 500;
  font-size: clamp(40px, 6vw, 86px);
  line-height: 1.02;
  letter-spacing: -.01em;
  margin: 8px 0 0;
}
.masters-hub-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0 48px;
}
.masters-hub-filter {
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .12em;
  padding: 10px 18px;
  border: 1px solid currentColor;
  background: transparent;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
  color: var(--warm-text);
}
.masters-hub-filter:hover { background: rgba(0, 0, 0, .04); }
.masters-hub-filter.is-active {
  background: var(--warm-deep);
  color: #fff;
  border-color: var(--warm-deep);
}

.masters-hub-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 32px;
  padding-bottom: 24px;
}
.masters-hub-grid .master {
  flex: initial;
  width: auto;
}
@media (max-width: 880px) {
  .masters-hub-grid { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
}
@media (max-width: 560px) {
  .masters-hub-grid { grid-template-columns: 1fr; gap: 28px; }
}
```

**Why `.masters-hub-grid .master { flex: initial; width: auto; }`:** в существующем `.master` стиле задан `flex: 0 0 300px; width: 300px;` под marquee-ленту. В grid это даёт фиксированную ширину карточки и ломает адаптацию — переопределяем в контексте hub-grid.

---

### Task 10: Verify главная — CTA уже на месте

**Files:** read-only

- [ ] **Step 10.1** — Прогнать `curl -s http://localhost:3000 | grep -o '"/masters"\|Все мастера'` (если dev запущен) ИЛИ просто убедиться, что `app/page.tsx:21` рендерит `<Masters />` без props и `app/_components/Masters.tsx:36-37` сохраняет дефолты `ctaHref="/masters"`, `ctaLabel="Все мастера →"`. Это no-op task — только подтвердить.

---

### Task 11: tsc + curl smoke-test

- [ ] **Step 11.1** — `npx tsc --noEmit` — должно быть чисто.
- [ ] **Step 11.2** — `npm run dev` в фоне, дождаться готовности, `curl -s http://localhost:3000/masters | grep -oE 'breadcrumb|<h1>Мастера|masters-hub-filter|crosslink' | sort -u`. Должны быть: `breadcrumb`, `<h1>Мастера`, `masters-hub-filter` (×4), `crosslink`. Затем убить dev.
- [ ] **Step 11.3** — `curl -s http://localhost:3000/ | grep -oE 'href="/masters"|Все мастера'` — должно найтись CTA на главной.

---

### Task 12: Commit + push

- [ ] **Step 12.1** —

```bash
git add app/masters app/_components/masters-hub app/_components/Masters.tsx app/_components/Header.tsx app/globals.css docs/superpowers/plans/2026-05-16-masters-hub.md
git commit -m "создай страницу /masters: хаб с фильтром по направлениям, ссылки с главной"
git push
```

---

## Self-Review

- ✅ Spec coverage: hero / фильтр / grid / cross-links / Header / CTA на главной / стили — все 8 пунктов user'а закрыты.
- ✅ Placeholder scan: все компоненты с готовым JSX, все правки с точными значениями.
- ✅ Type consistency: `MastersHubFilterValue` определён в Filters, импортируется в Client и Grid. `Direction` из data импортируется в Grid с явным `as Direction` cast в правильной ветке.
- ✅ Server/client boundary: Hero/Grid/CrossLinks server (без хуков и handler'ов), Filters/Client client. Footer внешний к Client wrapper'у — остаётся server.
- ⚠️ Decision: NOT renaming the file `Training.tsx` или компонента `Training` — это не предмет этой задачи.
- ⚠️ Decision: Header.tsx — изменяем существующий пункт `/#masters` → `/masters`, не добавляем дубликат. Бургер использует тот же массив.

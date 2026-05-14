# Пакет правок главной №1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать 4 правки главной: хедер slide-in после hero, hero-directions слева, чистый meta-слот (только номер) на трёх direction-секциях, «Тренировки» без переноса.

**Architecture:** Хедер становится бинарным state-machine (`hidden` / `revealed`) — один CSS-класс `.is-revealed` правит transform и visibility одновременно. Остальное — точечные правки разметки и CSS. Никаких новых компонентов, никаких новых зависимостей.

**Tech Stack:** Next.js 14 (App Router, client component для Header), TypeScript, CSS-переменные. Тесты — нет (фреймворка нет в проекте), верификация через `next build` + `curl` + визуал.

---

## Spec reference

`docs/superpowers/specs/2026-05-13-homepage-edits-pack-1-design.md`

## Файловая структура

```
app/
├── _components/
│   ├── Header.tsx       [MODIFY]  переименовать state, инвертировать логику, обновить className/data-state
│   ├── Banya.tsx        [MODIFY]  meta "01 · Направление" → "01"
│   ├── Relax.tsx        [MODIFY]  meta "02 · Направление" → "02"
│   └── Training.tsx     [MODIFY]  meta "03 · Направление" → "03"; убрать &shy; в h2
└── globals.css          [MODIFY]  .site-header базовый transform+visibility; .is-filled → .is-revealed;
                                   .hero .directions text-align: left; .practice.training h2 nowrap
```

## Тестирование

В проекте не настроен тест-фреймворк. Верификация каждой задачи:
- `npx tsc --noEmit` — typecheck должен пройти.
- `npm run build` — должен заканчиваться `✓ Compiled successfully`, route `/` остаётся `○ (Static)`.
- Curl-санити: вытащить HTML/CSS и убедиться, что нужные классы/текст присутствуют, ненужные — нет.

## Деление на коммиты

Спец предписывает **2 коммита**:
- `(a)` Header — Task 1.
- `(b)` Hero/Sections/Training мини-правки — Task 2.

Task 3 — финальная верификация + push.

---

## Task 1 — Хедер: slide-in после hero

**Files:**
- Modify: `app/_components/Header.tsx`
- Modify: `app/globals.css`

### Step 1.1 — Перепиши Header.tsx

- [ ] Перепиши `/home/user/projects/vigor-and-strength/app/_components/Header.tsx` на этот код:

```tsx
"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#banya", label: "Баня" },
  { href: "/#relax", label: "Релаксология" },
  { href: "/#training", label: "Тренировки" },
  { href: "/#masters", label: "Мастера" },
  { href: "/#locations", label: "Локации" },
  { href: "/#contact", label: "Связаться" },
];

export function Header() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsRevealed(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`site-header${isRevealed ? " is-revealed" : ""}`}
        data-state={isRevealed ? "revealed" : "hidden"}
      >
        <div className="wrap">
          <a className="brand" href="/">
            бодрость&nbsp;и&nbsp;сила
          </a>

          <nav className="site-header__desktop-nav" aria-label="Основная навигация">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="site-header-menu"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div
        id="site-header-menu"
        className={`site-header__menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Меню">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
```

**Diff vs текущей версии:**
- `isOverHero` → `isRevealed` (имя + смысл инвертированы).
- `useState(true)` → `useState(false)`.
- `setIsOverHero(false)` в fallback → `setIsRevealed(true)` (sub-pages показывают сразу).
- `setIsOverHero(entry.isIntersecting)` → `setIsRevealed(!entry.isIntersecting)`.
- Убрана локальная переменная `const filled = !isOverHero;`.
- `is-filled`/`"filled"|"transparent"` → `is-revealed`/`"revealed"|"hidden"`.

### Step 1.2 — Обнови CSS блок `.site-header` в globals.css

- [ ] В `/home/user/projects/vigor-and-strength/app/globals.css` найти блок `.site-header` (он начинается с `/* ============ SITE HEADER (sticky) ============ */`).
- [ ] Заменить первые два правила (`.site-header` и `.site-header.is-filled`) на:

```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 56px;
  display: flex;
  align-items: center;
  color: var(--neutral-fg);
  background: var(--neutral-bg);
  border-bottom: 1px solid #38383c;
  transform: translateY(-100%);
  visibility: hidden;
  transition:
    transform 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    visibility 0s linear 320ms;
}
.site-header.is-revealed {
  transform: translateY(0);
  visibility: visible;
  transition:
    transform 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    visibility 0s linear 0s;
}
```

**Что меняется по сравнению с тем что было:**
- Базовый `background: transparent` → `background: var(--neutral-bg)` (теперь хедер всегда тёмный, прячется не прозрачностью, а смещением).
- Базовый `border-bottom: 1px solid transparent` → `border-bottom: 1px solid #38383c`.
- Удалены: `transition: background-color, border-color, box-shadow`.
- Добавлены: `transform: translateY(-100%)`, `visibility: hidden`, новые `transition` с `transform` и delayed `visibility` (паттерн как в мобильном меню).
- Селектор `.site-header.is-filled` переименован в `.site-header.is-revealed`, его свойства тоже изменились (`transform: translateY(0)`, `visibility: visible`).

### Step 1.3 — Typecheck + build

- [ ] Запусти из `/home/user/projects/vigor-and-strength`:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -10
```

**Expected:** `tsc` — exit 0 без вывода. Build — `✓ Compiled successfully`, таблица routes, `/` помечена `○ (Static)`.

### Step 1.4 — Коммит

- [ ] Закоммить:

```bash
git add app/_components/Header.tsx app/globals.css
git commit -m "хедер: slide-in после hero вместо transparent-over-hero"
```

---

## Task 2 — Hero left, meta-номера, Тренировки без переноса

**Files:**
- Modify: `app/globals.css`
- Modify: `app/_components/Banya.tsx`
- Modify: `app/_components/Relax.tsx`
- Modify: `app/_components/Training.tsx`

### Step 2.1 — `.hero .directions` text-align: left + training h2 nowrap

- [ ] В `/home/user/projects/vigor-and-strength/app/globals.css` найти правило `.hero .directions` и заменить значение `text-align`:

Было:
```css
.hero .directions {
  margin-top: 48px;
  font-family: var(--font-sans), sans-serif;
  font-weight: 300;
  font-size: clamp(18px, 2vw, 26px);
  letter-spacing: .04em;
  color: #cdc4b3;
  text-align: right;
}
```

Стало (единственная правка — `text-align: right` → `text-align: left`):
```css
.hero .directions {
  margin-top: 48px;
  font-family: var(--font-sans), sans-serif;
  font-weight: 300;
  font-size: clamp(18px, 2vw, 26px);
  letter-spacing: .04em;
  color: #cdc4b3;
  text-align: left;
}
```

- [ ] В том же файле найти правило `.practice.training { ... }` и сразу после блока `.practice.training .copy { padding-top: 60px; }` добавить:

```css
.practice.training h2 {
  text-wrap: nowrap;
}
```

### Step 2.2 — Banya.tsx: "01 · Направление" → "01"

- [ ] В `/home/user/projects/vigor-and-strength/app/_components/Banya.tsx` найти строку:

```tsx
<div className="meta">01 · Направление</div>
```

Заменить на:

```tsx
<div className="meta">01</div>
```

### Step 2.3 — Relax.tsx: "02 · Направление" → "02"

- [ ] В `/home/user/projects/vigor-and-strength/app/_components/Relax.tsx` найти строку:

```tsx
<div className="meta">02 · Направление</div>
```

Заменить на:

```tsx
<div className="meta">02</div>
```

### Step 2.4 — Training.tsx: "03 · Направление" → "03" + убрать `&shy;`

- [ ] В `/home/user/projects/vigor-and-strength/app/_components/Training.tsx` найти строку:

```tsx
<div className="meta">03 · Направление</div>
```

Заменить на:

```tsx
<div className="meta">03</div>
```

- [ ] В том же файле найти h2 со soft hyphen:

```tsx
<h2>Трени&shy;ровки</h2>
```

Заменить на:

```tsx
<h2>Тренировки</h2>
```

### Step 2.5 — Typecheck + build

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -10
```

**Expected:** `tsc` exit 0 без вывода; build — `✓ Compiled successfully`, `/` static.

### Step 2.6 — Коммит

- [ ] Закоммить:

```bash
git add app/globals.css app/_components/Banya.tsx app/_components/Relax.tsx app/_components/Training.tsx
git commit -m "hero: directions слева; meta — только номер; Тренировки без переноса"
```

---

## Task 3 — Проверка и push

**Files:** —

### Step 3.1 — Останови старый prod-сервер, запусти заново

Старый prod был запущен ДО изменений и сейчас отдаёт устаревший build.

- [ ] Если есть запущенный `npm run start` в фоне (контроллер исполнения знает task-id) — останови его.
- [ ] Запусти заново:

```bash
npm run start
```

(в фоне; ждать `Ready in`)

### Step 3.2 — Curl-санити

- [ ] Проверь HTML и CSS:

```bash
# 1. meta: НЕ должно остаться "Направление", должны быть номера 01/02/03
curl -s http://localhost:3000/ | grep -oE '<div class="meta">[^<]*</div>' | head -10
```

**Expected:** строки вида `<div class="meta">01</div>`, `<div class="meta">02</div>`, `<div class="meta">03</div>`, а также `<div class="meta">Команда</div>`, `<div class="meta">Где это происходит</div>`, `<div class="meta">Связаться</div>`. Слова «Направление» нигде нет.

```bash
# 2. soft hyphen в Тренировках должен пропасть
curl -s http://localhost:3000/ | grep -c 'Трени&shy;ровки\|Трени­ровки'
```

**Expected:** `0`.

```bash
# 3. header: убедиться что is-revealed класс есть в CSS, is-filled — нет
CSS=$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/[a-f0-9]+\.css' | tail -1)
curl -s "http://localhost:3000${CSS}" | grep -oE 'is-revealed|is-filled|translateY' | sort -u
```

**Expected:** `is-revealed` и `translateY` присутствуют. `is-filled` отсутствует.

```bash
# 4. hero directions: text-align: left в CSS
curl -s "http://localhost:3000${CSS}" | grep -oE '\.hero .directions[^}]+text-align:[^;]+'
```

**Expected:** строка содержит `text-align:left`.

### Step 3.3 — Визуальная проверка (если туннель ещё жив)

Чек-лист в браузере:
- На загрузке главной хедера не видно. Внизу — hero с заголовком справа, `Баня · Релаксология · Тренировки` слева.
- Над H2 каждой direction-секции — только номер (01/02/03), без слова «Направление».
- Слово «Тренировки» в H2 одной строкой, без дефиса.
- Скролл вниз — хедер плавно въезжает сверху с тёмной заливкой за ~300мс.
- Скролл обратно вверх — хедер уезжает.
- Бургер на мобиле виден только когда виден сам хедер (он внутри него).

### Step 3.4 — Push

- [ ] Запушить оба коммита из тасков 1 и 2:

```bash
git push origin main
```

**Expected:** `... -> main`.

---

## Self-Review (контролёр выполняет сам, не передаёт субагенту)

**1. Spec coverage:**
- §1 Хедер slide-in → Task 1 (.tsx + .css)
- §2 Hero directions left → Task 2 Step 2.1 (часть с `.hero .directions`)
- §3 Meta только номер → Task 2 Steps 2.2 / 2.3 / 2.4 (Banya, Relax, Training)
- §4 Тренировки без переноса → Task 2 Step 2.4 (часть с `&shy;`) + Step 2.1 (часть с `.practice.training h2 nowrap`)
- Out of scope (.topnav, SSR-флэш sub-pages, hero variants B/C/D, мобильный бургер) — НЕ затрагивается в плане, ОК.

**2. Placeholder scan:**
- Нет «TBD», «TODO», «similar to above», «handle edge cases». Все code-блоки полные.

**3. Type consistency:**
- `isRevealed` именуется и используется одинаково по всему Task 1.
- `.is-revealed` используется одинаково в Header.tsx и в globals.css.
- Файловые пути абсолютные, все совпадают с реальным состоянием репо.

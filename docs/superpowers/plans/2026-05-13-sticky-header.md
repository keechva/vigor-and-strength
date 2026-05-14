# Sticky Header

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Вынести навигацию из Hero в отдельный sticky-хедер, который прозрачен над hero и темнеет, когда hero уходит за пределы экрана. Хедер виден на всех страницах сайта.

**Architecture:** `<Header />` — client-компонент с `position: fixed; top: 0`, отслеживает пересечение `.hero` через `IntersectionObserver`. Над hero — прозрачный фон, после hero — заливка `var(--neutral-bg)`. На страницах без `.hero` (будущие /banya, /relax и т.д.) хедер сразу в «залитом» состоянии. Маунтится в `app/layout.tsx` — появляется на всех страницах. Из `Hero.tsx` `topnav` удаляется. Мобильный режим: ≤880px — бренд + кнопка-бургер; клик по бургеру открывает full-screen-оверлей.

**Tech Stack:** Next.js 14 (App Router, client component), TypeScript, CSS-переменные из `globals.css`, `IntersectionObserver` API. Тестов нет — в проекте ещё не настроен фреймворк, проверка через `next build` + curl + dev-сервер.

---

## Файловая структура

```
app/
├── _components/
│   ├── Header.tsx           [NEW]  Sticky header + mobile menu (client)
│   └── Hero.tsx             [MODIFY]  Убрать <nav className="topnav">
├── layout.tsx               [MODIFY]  Импорт + <Header /> над {children}
└── globals.css              [MODIFY]  +.site-header / .site-header__menu стили;
                                       старые .topnav стили оставить (Hero их больше
                                       не использует, но они никому не мешают —
                                       удалим в отдельном cleanup-коммите если хотим)
```

---

## Зафиксированные решения

Перед декомпозицией — то, что я выбрал по умолчанию (если ты не согласен — это место поправить ДО старта):

1. **Скролл-триггер:** `IntersectionObserver` на `.hero`, а не `scrollY > threshold`. Надёжнее, не нужно знать высоту hero.
2. **Позиционирование:** `position: fixed; top: 0` — оверлеит контент, не двигает hero вниз. У hero уже есть `padding-top` 80px (48px на мобиле), хедер 56px высотой влезает без артефактов.
3. **Состояние «прозрачный»:** полностью прозрачный фон, без `border-bottom`, цвет текста `var(--neutral-fg)`. Вариант «очень тонкий и приглушённый» отбросил — выглядит чище, когда хедер реально невидим над hero.
4. **Состояние «плотный»:** `background: var(--neutral-bg)`, цвет `var(--neutral-fg)`, лёгкий `border-bottom: 1px solid #38383c` (как в футере). Transition `background-color`, `border-color`, `box-shadow` — 250мс ease.
5. **Высота:** 56px (десктоп) / 52px (мобиль). Достаточно для бренда + ссылок одной строкой.
6. **Брейкпойнт мобильного меню:** 880px (совпадает с существующим CSS-breakpoint).
7. **Бургер-иконка:** 3 короткие полоски на CSS (`::before`/`::after`), без SVG.
8. **Оверлей меню:** `position: fixed; inset: 0; background: var(--neutral-bg)`. Ссылки — серифом, крупно, в столбик. Кнопка «×» в правом верхнем углу. Закрытие — клик по ссылке, по «×», или Escape. Бургер крестится в иконку «×», когда меню открыто.
9. **Стопор скролла под меню:** при открытом меню — `document.body.style.overflow = 'hidden'`. Возврат при закрытии.
10. **Sub-pages:** на страницах без `.hero` хедер инициализируется в «past-hero» состоянии (тёмный фон). Логика: если `document.querySelector('.hero')` вернул `null` — сразу ставим `isOverHero = false`.
11. **CSS .topnav:** оставляю в `globals.css` нетронутым — он перестанет использоваться, но и не сломает ничего. Уберём отдельным cleanup-PR, если будет неприятно держать мёртвый код.

---

## Tasks

### Task 1 — Стили хедера и оверлея в globals.css

**Files:**
- Modify: `app/globals.css` (добавить после блока `/* ============ TOP NAV ============ */`)

- [ ] **Step 1: добавь CSS-блок `.site-header`**

В `app/globals.css` после существующего блока `.topnav` (~line 50) вставить:

```css
/* ============ SITE HEADER (sticky) ============ */
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
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background-color 250ms ease,
    border-color 250ms ease,
    box-shadow 250ms ease,
    backdrop-filter 250ms ease;
}
.site-header.is-filled {
  background: var(--neutral-bg);
  border-bottom-color: #38383c;
}
.site-header .wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.site-header .brand {
  font-family: var(--font-serif), serif;
  font-size: 18px;
  letter-spacing: .02em;
  text-decoration: none;
  color: inherit;
}
.site-header nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 22px;
  font-size: 14px;
  color: #bdb6a8;
}
.site-header nav a {
  color: inherit;
  text-decoration: none;
  transition: color 150ms ease;
}
.site-header nav a:hover {
  color: var(--neutral-fg);
}

/* burger button — hidden on desktop */
.site-header__burger {
  display: none;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid #4a4a4f;
  color: inherit;
  cursor: pointer;
  position: relative;
  padding: 0;
}
.site-header__burger::before,
.site-header__burger::after,
.site-header__burger span {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  height: 1px;
  background: currentColor;
  transition: transform 200ms ease, opacity 200ms ease, top 200ms ease;
}
.site-header__burger::before { top: 12px; }
.site-header__burger span    { top: 17px; }
.site-header__burger::after  { top: 22px; }
.site-header__burger[aria-expanded="true"]::before {
  top: 17px;
  transform: rotate(45deg);
}
.site-header__burger[aria-expanded="true"] span {
  opacity: 0;
}
.site-header__burger[aria-expanded="true"]::after {
  top: 17px;
  transform: rotate(-45deg);
}

/* mobile overlay menu */
.site-header__menu {
  position: fixed;
  inset: 0;
  z-index: 49;
  background: var(--neutral-bg);
  color: var(--neutral-fg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 28px 56px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}
.site-header__menu.is-open {
  opacity: 1;
  pointer-events: auto;
}
.site-header__menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 18px;
}
.site-header__menu a {
  font-family: var(--font-serif), serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -.01em;
  line-height: 1.1;
  color: var(--neutral-fg);
  text-decoration: none;
}
.site-header__menu a:hover {
  color: #cdbd9f;
}

@media (max-width: 880px) {
  .site-header nav.site-header__desktop-nav {
    display: none;
  }
  .site-header__burger {
    display: block;
  }
  .site-header {
    height: 52px;
  }
}
```

- [ ] **Step 2: запусти `next build` чтобы убедиться, что CSS компилируется без ошибок**

```bash
npm run build 2>&1 | tail -10
```

Ожидаемый результат: `✓ Compiled successfully`, никаких CSS-ошибок в выводе.

- [ ] **Step 3: коммит**

```bash
git add app/globals.css
git commit -m "добавь стили sticky-хедера и мобильного оверлея"
```

---

### Task 2 — Компонент Header.tsx

**Files:**
- Create: `app/_components/Header.tsx`

- [ ] **Step 1: создай файл с client-компонентом**

`app/_components/Header.tsx`:

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
  const [isOverHero, setIsOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setIsOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsOverHero(entry.isIntersecting),
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

  const filled = !isOverHero;

  return (
    <>
      <header
        className={`site-header${filled ? " is-filled" : ""}`}
        data-state={filled ? "filled" : "transparent"}
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

- [ ] **Step 2: typecheck**

```bash
npx tsc --noEmit
```

Ожидаемый результат: команда завершается без вывода и с exit code 0.

- [ ] **Step 3: коммит**

```bash
git add app/_components/Header.tsx
git commit -m "добавь компонент Header: sticky + мобильный оверлей"
```

---

### Task 3 — Подключение в layout.tsx и удаление topnav из Hero

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/_components/Hero.tsx`

- [ ] **Step 1: импорт и маунт `<Header />` в `app/layout.tsx`**

В верхней части `app/layout.tsx`, после импортов шрифтов:

```ts
import { Header } from "./_components/Header";
```

В JSX, внутри `<body>`, перед `{children}`:

```tsx
<body>
  <Header />
  {children}
</body>
```

- [ ] **Step 2: удали блок `<nav className="topnav">...</nav>` из `app/_components/Hero.tsx`**

После правки `Hero.tsx` должен выглядеть так:

```tsx
export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="wrap">
        <div className="hero-inner">
          <div className="cold-dot" aria-hidden="true" />

          <h1>
            Бодрость&nbsp;<span className="amp">и</span>
            <br />
            Сила
          </h1>

          <div className="directions">
            Баня <span className="dot">·</span> Релаксология{" "}
            <span className="dot">·</span> Тренировки
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: typecheck + build**

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -15
```

Ожидаемый результат: typecheck — без ошибок; build — `✓ Compiled successfully`, страница `/` остаётся `○ (Static)`.

- [ ] **Step 4: коммит**

```bash
git add app/layout.tsx app/_components/Hero.tsx
git commit -m "подключи Header в layout и убери topnav из Hero"
```

---

### Task 4 — Проверка вживую

**Files:** —

- [ ] **Step 1: подними prod-сервер**

```bash
npm run start
```

(в фоне; ждать `Ready in`)

- [ ] **Step 2: HTTP-санити на десктоп-вьюпорте**

```bash
curl -s http://localhost:3000/ | grep -oE 'class="[^"]*(site-header|site-header__burger|site-header__menu)[^"]*"' | sort -u
```

Ожидаемый результат: видны как минимум `class="site-header"`, `class="site-header__burger"`, `class="site-header__menu"`.

- [ ] **Step 3: убедись, что topnav пропал**

```bash
curl -s http://localhost:3000/ | grep -c 'class="topnav"'
```

Ожидаемый результат: `0`.

- [ ] **Step 4: визуальная проверка в браузере (если туннель ещё жив — через trycloudflare URL; иначе локально)**

Чек-лист:
- При загрузке страницы: хедер прозрачный, поверх hero. Бренд и ссылки читаются как раньше.
- При скролле вниз до начала зоны «Баня»: хедер плавно темнеет, появляется заливка `--neutral-bg` и тонкая граница снизу.
- Скролл обратно вверх до hero: хедер снова становится прозрачным.
- На вьюпорте 375px / 880px: ссылки исчезают, появляется бургер. Клик по бургеру открывает full-screen оверлей с теми же ссылками. Клик по ссылке закрывает меню и скроллит к секции. Escape тоже закрывает.

- [ ] **Step 5: финальный push**

```bash
git push origin main
```

---

## Self-review checklist

- [x] Скролл-триггер описан (Task 2, Step 1)
- [x] Прозрачное → плотное состояние описано (Task 1 .site-header / .is-filled)
- [x] Хедер на всех страницах через layout (Task 3)
- [x] Topnav удалён из Hero (Task 3 Step 2)
- [x] Мобильный бургер + оверлей (Task 1 + Task 2)
- [x] Все file paths абсолютные
- [x] Нет «TODO» / «similar to above» — везде полный код
- [x] Sub-pages кейс закрыт (fallback в Task 2 Step 1: `if (!hero) setIsOverHero(false)`)

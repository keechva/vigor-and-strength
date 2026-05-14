# Страница `/banya` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать рабочую страницу `/banya` со всеми 11 блоками по спецификации, включая конфигуратор без цен, который передаёт сводку выбора в форму заявки.

**Architecture:** Маршрут App Router `app/banya/page.tsx` — server-компонент, композирующий 10 серверных + 2 клиентских блока. Конфигуратор и форма обмениваются данными через `window` CustomEvent (нет общего React-state-холдера, нет context-провайдера). Мастера выносятся в `app/_lib/data/masters.ts` как единый источник; `Masters.tsx` начинает принимать пропсы и используется и на главной, и на /banya с фильтром.

**Tech Stack:** Next.js 14 (App Router, server + client components), TypeScript, CSS-переменные. Без новых зависимостей.

**Spec:** `docs/superpowers/specs/2026-05-13-banya-page-design.md`

---

## Файловая структура

```
app/
├── banya/
│   └── page.tsx                       [NEW]
├── _components/
│   ├── banya/                         [NEW dir]
│   │   ├── BanyaHero.tsx
│   │   ├── BanyaIntro.tsx
│   │   ├── BanyaPricingNote.tsx
│   │   ├── BanyaBaseSteam.tsx
│   │   ├── BanyaAddons.tsx
│   │   ├── BanyaPrograms.tsx
│   │   ├── BanyaConfigurator.tsx      [CLIENT]
│   │   ├── BanyaMasters.tsx
│   │   ├── BanyaCrossLinks.tsx
│   │   └── BanyaContact.tsx           [CLIENT]
│   └── Masters.tsx                    [MODIFY]  accept props, use shared data
└── _lib/
    └── data/
        └── masters.ts                 [NEW]

app/globals.css                        [MODIFY]  +sub-page CSS primitives
```

## Верификация (тестов нет)

После каждой задачи:
- `npx tsc --noEmit` — exit 0, без вывода.
- `npm run build` — `✓ Compiled successfully`. После Task 3 — должен появиться route `○ /banya` в таблице.
- Curl-санити — конкретные проверки в шагах.

---

## Task 1 — Данные мастеров и refactor Masters.tsx

**Files:**
- Create: `app/_lib/data/masters.ts`
- Modify: `app/_components/Masters.tsx`

### Step 1.1 — Создай data-модуль

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_lib/data/masters.ts`:

```ts
export type Direction = "banya" | "relax" | "training";

export type Master = {
  name: string;
  role: string;
  directions: Direction[];
  tagsDisplay: string;
  bio: string;
};

export const MASTERS: Master[] = [
  {
    name: "Дмитрий",
    role: "Мастер",
    directions: ["banya", "relax", "training"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · 2–3 фразы о Дмитрии: что ведёт, как работает, какая интонация.]",
  },
  {
    name: "Александр",
    role: "Мастер",
    directions: ["banya", "relax"],
    tagsDisplay: "Баня · Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Вадим",
    role: "Мастер",
    directions: ["banya", "relax", "training"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Анна",
    role: "Мастер",
    directions: ["relax"],
    tagsDisplay: "Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
];
```

### Step 1.2 — Перепиши Masters.tsx

- [ ] Перепиши `/home/user/projects/vigor-and-strength/app/_components/Masters.tsx`:

```tsx
import { MASTERS, type Direction, type Master } from "../_lib/data/masters";

type MastersProps = {
  title?: string;
  filterDirection?: Direction | null;
  ctaHref?: string;
  ctaLabel?: string;
};

function MasterCard({
  master,
  ariaHidden = false,
}: {
  master: Master;
  ariaHidden?: boolean;
}) {
  return (
    <article
      className={ariaHidden ? "master master--clone" : "master"}
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    >
      <div className="portrait" />
      <h3 className="name">{master.name}</h3>
      <div className="role">{master.role}</div>
      <div className="tags">{master.tagsDisplay}</div>
      <p className="bio">{master.bio}</p>
    </article>
  );
}

export function Masters({
  title = "Мастера",
  filterDirection = null,
  ctaHref = "/masters",
  ctaLabel = "Все мастера →",
}: MastersProps = {}) {
  const list = filterDirection
    ? MASTERS.filter((m) => m.directions.includes(filterDirection))
    : MASTERS;

  return (
    <section className="zone warm" id="masters" aria-label={title}>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="masters-cold-dot" aria-hidden="true" />

        <div className="masters-head">
          <div>
            <div className="meta">Команда</div>
            <h2>{title}</h2>
          </div>
          <a className="cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      </div>

      <div className="masters-strip" role="region" aria-label="Лента мастеров">
        <div className="masters-track">
          {list.map((m) => (
            <MasterCard key={`a-${m.name}`} master={m} />
          ))}
          {list.map((m) => (
            <MasterCard key={`b-${m.name}`} master={m} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 1.3 — Build + verify homepage unchanged

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -10
```

**Expected:** typecheck exit 0; build OK; route `/` всё ещё `○ (Static)`.

- [ ] Curl-проверка: на главной должны быть 4 мастера (8 карточек с клонами):

```bash
curl -s http://localhost:3000/ | grep -o 'class="master"' | wc -l
```

Если prod-сервер свежий — `4`. Если нет, перезапусти и попробуй снова. (Если перезапуск не делать, эта проверка не критична — основная — build.)

### Step 1.4 — Commit

- [ ] Закоммить:

```bash
git add app/_lib/data/masters.ts app/_components/Masters.tsx
git commit -m "вынеси мастеров в _lib/data; Masters принимает фильтр и title"
```

---

## Task 2 — CSS-примитивы под-страниц

**Files:**
- Modify: `app/globals.css`

### Step 2.1 — Добавь блок sub-page primitives

- [ ] В `/home/user/projects/vigor-and-strength/app/globals.css` найди в конце файла последний `@media (max-width: 520px)` блок. Сразу ПЕРЕД ним вставь следующий блок:

```css
/* ============ SUB-PAGE PRIMITIVES ============ */

.hero-sub {
  padding: 80px 0 100px;
  position: relative;
}
.hero-sub .breadcrumb {
  font-family: var(--font-sans), sans-serif;
  font-size: 13px;
  letter-spacing: .04em;
  opacity: .65;
  margin-bottom: 32px;
}
.hero-sub .breadcrumb a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
}
.hero-sub h1 {
  font-family: var(--font-serif), serif;
  font-weight: 500;
  font-size: clamp(72px, 12vw, 180px);
  line-height: .95;
  letter-spacing: -.01em;
  margin: 0 0 36px;
}
.hero-sub .lead {
  font-family: var(--font-serif), serif;
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.4;
  max-width: 36ch;
  margin: 0;
  text-wrap: balance;
}

.manifesto {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  align-items: start;
}
.manifesto .lead-q {
  font-family: var(--font-serif), serif;
  font-style: italic;
  font-size: clamp(20px, 1.6vw, 24px);
  line-height: 1.4;
  max-width: 24ch;
  opacity: .7;
}
.manifesto .body {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 60ch;
}
.manifesto .body p {
  font-family: var(--font-serif), serif;
  font-size: clamp(19px, 1.4vw, 22px);
  line-height: 1.55;
  margin: 0;
}
.manifesto .body p.kicker {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.6;
  opacity: .7;
  text-transform: uppercase;
  letter-spacing: .16em;
}

.cards {
  display: grid;
  gap: 24px;
}
.cards.col-2 { grid-template-columns: 1fr 1fr; }
.cards.col-3 { grid-template-columns: repeat(3, 1fr); }

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 22px 26px;
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, .03);
  min-height: 200px;
}
.card .card-num {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: .16em;
  opacity: .55;
  text-transform: uppercase;
}
.card h3 {
  font-family: var(--font-serif), serif;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 500;
  margin: 6px 0 0;
}
.card p {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .85;
  margin: 0;
}
.card .meta-line {
  font-family: var(--font-sans), sans-serif;
  font-size: 12px;
  letter-spacing: .06em;
  opacity: .65;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid currentColor;
}

.format-list {
  display: grid;
  gap: 0;
  border-top: 1px solid currentColor;
}
.format-row {
  display: grid;
  grid-template-columns: 0.4fr 1.2fr 1.6fr;
  gap: 32px;
  padding: 24px 0;
  border-bottom: 1px solid currentColor;
  align-items: baseline;
}
.format-row .fr-num {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 13px;
  opacity: .55;
  letter-spacing: .08em;
}
.format-row .fr-title {
  font-family: var(--font-serif), serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.1;
}
.format-row .fr-desc {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .85;
}

.crosslinks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.crosslink {
  display: flex;
  flex-direction: column;
  padding: 32px 28px;
  border: 1px solid currentColor;
  text-decoration: none;
  color: inherit;
  gap: 12px;
  transition: background .15s;
  background: rgba(0, 0, 0, .02);
}
.crosslink:hover { background: rgba(0, 0, 0, .06); }
.crosslink .cl-eyebrow {
  font-family: var(--font-sans), sans-serif;
  font-size: 11px;
  letter-spacing: .22em;
  text-transform: uppercase;
  opacity: .6;
}
.crosslink .cl-title {
  font-family: var(--font-serif), serif;
  font-size: clamp(32px, 3.6vw, 48px);
  line-height: 1;
  font-weight: 500;
  margin: 0;
}
.crosslink .cl-arrow {
  margin-top: auto;
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  letter-spacing: .04em;
}

/* sub-page mobile */
@media (max-width: 880px) {
  .manifesto { grid-template-columns: 1fr; gap: 24px; }
  .cards.col-2, .cards.col-3 { grid-template-columns: 1fr 1fr; }
  .crosslinks { grid-template-columns: 1fr; }
  .format-row { grid-template-columns: 1fr; gap: 6px; padding: 22px 0; }
}
@media (max-width: 520px) {
  .cards.col-2, .cards.col-3 { grid-template-columns: 1fr; }
  .hero-sub { padding: 48px 0 64px; }
  .hero-sub h1 { font-size: clamp(56px, 16vw, 96px); margin-bottom: 24px; }
  .hero-sub .lead { font-size: 18px; }
}
```

### Step 2.2 — Build verify

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -10
```

**Expected:** typecheck + build green; CSS компилится без warning'ов.

### Step 2.3 — Commit

- [ ] Закоммить:

```bash
git add app/globals.css
git commit -m "добавь CSS-примитивы под-страниц: hero-sub, manifesto, cards, format-list, crosslinks"
```

---

## Task 3 — Статические блоки страницы /banya

**Files (новые):**
- Create: `app/_components/banya/BanyaHero.tsx`
- Create: `app/_components/banya/BanyaIntro.tsx`
- Create: `app/_components/banya/BanyaPricingNote.tsx`
- Create: `app/_components/banya/BanyaBaseSteam.tsx`
- Create: `app/_components/banya/BanyaAddons.tsx`
- Create: `app/_components/banya/BanyaPrograms.tsx`
- Create: `app/_components/banya/BanyaCrossLinks.tsx`
- Create: `app/banya/page.tsx`

### Step 3.1 — BanyaHero

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaHero.tsx`:

```tsx
export function BanyaHero() {
  return (
    <section className="hero" aria-label="Баня — заголовок">
      <div className="wrap">
        <div className="hero-sub">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Баня
          </div>
          <h1>Баня</h1>
          <p className="lead">
            Вечер, который вы себе устраиваете. Один или компанией до пятнадцати
            человек. Без процедур, без объяснений зачем.
          </p>
        </div>
      </div>
    </section>
  );
}
```

Заметка: `className="hero"` нужен, чтобы `IntersectionObserver` в `Header.tsx` видел секцию и оставался скрытым, пока она в viewport. Sub-page hero внутри использует свой `.hero-sub` для типографики.

### Step 3.2 — BanyaIntro

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaIntro.tsx`:

```tsx
export function BanyaIntro() {
  return (
    <section className="zone warm" aria-label="Описание направления">
      <div className="wrap">
        <div className="manifesto">
          <div className="lead-q">
            «Не процедура. Вечер.»
          </div>
          <div className="body">
            <p>
              Парим спокойно, с веником и чаем, иногда добавляем работу с телом
              после пара. Собираете под себя — один или компанией до пятнадцати
              человек.
            </p>
            <p className="kicker">Форматы</p>
            <p>
              Выезд к клиенту · партнёрские бани · своя локация (в разработке).
              Возможна работа в четыре руки — двумя мастерами.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 3.3 — BanyaPricingNote

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaPricingNote.tsx`:

```tsx
export function BanyaPricingNote() {
  return (
    <section className="zone warm" aria-label="Ориентир по цене">
      <div className="wrap">
        <p
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(20px, 1.6vw, 26px)",
            lineHeight: 1.5,
            maxWidth: "44ch",
            margin: 0,
            opacity: 0.85,
          }}
        >
          Цена согласуется индивидуально — соберите состав в конфигураторе ниже,
          и мы назовём ориентир.
        </p>
      </div>
    </section>
  );
}
```

### Step 3.4 — BanyaBaseSteam

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaBaseSteam.tsx`:

```tsx
export function BanyaBaseSteam() {
  return (
    <section className="zone warm" aria-label="Базовое парение">
      <div className="wrap">
        <div className="manifesto">
          <div className="lead-q">Базовое парение</div>
          <div className="body">
            <p>
              Приход, работа с паром, веник. Это основа, на которую нанизывается
              всё остальное — допники подбираются по настроению и под формат
              вечера.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 3.5 — BanyaAddons

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaAddons.tsx`:

```tsx
type Addon = {
  num: string;
  title: string;
  desc: string;
};

const ADDONS: Addon[] = [
  {
    num: "A · 01",
    title: "Веник",
    desc: "Берёза, дуб, эвкалипт, хвоя и др. — обсуждаем заранее или выбираем на месте.",
  },
  {
    num: "A · 02",
    title: "Скрабирование",
    desc: "Между заходами — мягкая работа с кожей.",
  },
  {
    num: "A · 03",
    title: "Ароматерапия",
    desc: "Эфирные масла на пар. По настроению или под цель.",
  },
  {
    num: "A · 04",
    title: "Звукотерапия",
    desc: "Поющие чаши в моменты тишины между заходами.",
  },
  {
    num: "A · 05",
    title: "Чай",
    desc: "Травяные сборы, согревающие или восстанавливающие.",
  },
  {
    num: "A · 06",
    title: "Работа с телом после пара",
    desc: "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
  },
];

export function BanyaAddons() {
  return (
    <section className="zone warm" aria-label="Допники">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Допники
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 36px",
            letterSpacing: "-.01em",
          }}
        >
          Что можно добавить
        </h2>
        <div className="cards col-3">
          {ADDONS.map((a) => (
            <article key={a.num} className="card">
              <div className="card-num">{a.num}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 3.6 — BanyaPrograms

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaPrograms.tsx`:

```tsx
type Program = {
  num: string;
  title: string;
  desc: string;
};

const PROGRAMS: Program[] = [
  {
    num: "P · 01",
    title: "Классика",
    desc: "Парение + веник на выбор + чай.",
  },
  {
    num: "P · 02",
    title: "Восстановление",
    desc: "Парение + скрабирование + работа с телом после пара + чай.",
  },
  {
    num: "P · 03",
    title: "Сенсорная",
    desc: "Парение + ароматерапия + звукотерапия.",
  },
  {
    num: "P · 04",
    title: "В четыре руки",
    desc: "Парение + работа с телом двумя мастерами.",
  },
  {
    num: "P · 05",
    title: "Полный релакс",
    desc: "Все допники включены.",
  },
  {
    num: "P · 06",
    title: "Компания",
    desc: "До пятнадцати человек, базовое + опции под группу.",
  },
];

export function BanyaPrograms() {
  return (
    <section className="zone warm" aria-label="Программы">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Программы
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 36px",
            letterSpacing: "-.01em",
          }}
        >
          Готовые наборы
        </h2>
        <div className="format-list">
          {PROGRAMS.map((p) => (
            <article key={p.num} className="format-row">
              <div className="fr-num">{p.num}</div>
              <div className="fr-title">{p.title}</div>
              <div className="fr-desc">{p.desc}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 3.7 — BanyaCrossLinks

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaCrossLinks.tsx`:

```tsx
export function BanyaCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/relax">
            <span className="cl-eyebrow">Хорошо сочетается</span>
            <h3 className="cl-title">Релаксология</h3>
            <span className="cl-arrow">Подробнее&nbsp;→</span>
          </a>
          <a className="crosslink" href="/locations">
            <span className="cl-eyebrow">Где это происходит</span>
            <h3 className="cl-title">Локации</h3>
            <span className="cl-arrow">Все локации&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Step 3.8 — app/banya/page.tsx (composition WITHOUT configurator/contact yet)

- [ ] Создай `/home/user/projects/vigor-and-strength/app/banya/page.tsx`:

```tsx
import type { Metadata } from "next";
import { BanyaHero } from "../_components/banya/BanyaHero";
import { BanyaIntro } from "../_components/banya/BanyaIntro";
import { BanyaPricingNote } from "../_components/banya/BanyaPricingNote";
import { BanyaBaseSteam } from "../_components/banya/BanyaBaseSteam";
import { BanyaAddons } from "../_components/banya/BanyaAddons";
import { BanyaPrograms } from "../_components/banya/BanyaPrograms";
import { BanyaCrossLinks } from "../_components/banya/BanyaCrossLinks";
import { Masters } from "../_components/Masters";
import { Footer } from "../_components/Footer";

export const metadata: Metadata = {
  title: "Баня — Бодрость и Сила",
  description:
    "Парим спокойно, с веником и чаем. Один или компанией до 15 человек. Выезд, партнёрские бани, своя локация в разработке.",
};

export default function BanyaPage() {
  return (
    <main>
      <BanyaHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <BanyaIntro />
      <BanyaPricingNote />
      <BanyaBaseSteam />
      <BanyaAddons />
      <BanyaPrograms />
      <Masters
        title="Мастера"
        filterDirection="banya"
        ctaHref="/masters"
        ctaLabel="Все мастера&nbsp;→"
      />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <BanyaCrossLinks />
      <div className="bridge-cool-to-darkneutral" aria-hidden="true" />
      <Footer />
    </main>
  );
}
```

### Step 3.9 — Build + curl-проверка наличия /banya

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -15
```

**Expected:** в таблице routes появилась строка `┌ ○ /banya ...`, и `○ /` тоже остаётся. Оба static.

- [ ] (Опц.) Перезапусти prod-сервер и curl:

```bash
curl -s -o /tmp/banya.html -w "HTTP %{http_code}\n" http://localhost:3000/banya
grep -oE 'class="(zone warm|zone cool|hero-sub|manifesto|cards col-3|format-list|crosslinks)"' /tmp/banya.html | sort -u
```

**Expected:** `HTTP 200`. Видны все ключевые классы: `hero-sub`, `manifesto`, `cards col-3`, `format-list`, `crosslinks`, `zone warm`, `zone cool`.

### Step 3.10 — Commit

- [ ] Закоммить:

```bash
git add app/_components/banya/ app/banya/page.tsx
git commit -m "/banya: статические блоки — hero, intro, pricing, программы, допники, мастера, кросс-линки"
```

---

## Task 4 — Конфигуратор и форма с передачей сводки

**Files:**
- Create: `app/_components/banya/BanyaConfigurator.tsx` (client)
- Create: `app/_components/banya/BanyaContact.tsx` (client)
- Modify: `app/banya/page.tsx`

### Step 4.1 — Конфигуратор

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaConfigurator.tsx`:

```tsx
"use client";

import { useState } from "react";

const ADDON_LABELS: Record<string, string> = {
  venik: "веник",
  scrub: "скрабирование",
  aroma: "ароматерапия",
  sound: "звукотерапия",
  tea: "чай",
  tactile: "работа с телом после пара",
};

const PROGRAM_PRESETS: Record<string, string[]> = {
  klassika: ["venik", "tea"],
  vosstanovlenie: ["scrub", "tactile", "tea"],
  sensornaya: ["aroma", "sound"],
  v_4_ruki: ["tactile"],
  polny_relaks: ["venik", "scrub", "aroma", "sound", "tea", "tactile"],
  kompaniya: [],
};

const PROGRAM_LABELS: Record<string, string> = {
  klassika: "Классика",
  vosstanovlenie: "Восстановление",
  sensornaya: "Сенсорная",
  v_4_ruki: "В четыре руки",
  polny_relaks: "Полный релакс",
  kompaniya: "Компания",
};

export const BANYA_APPLY_EVENT = "banya:apply";

export type BanyaApplyDetail = {
  direction: "Баня";
  message: string;
};

export function BanyaConfigurator() {
  const [people, setPeople] = useState(1);
  const [addons, setAddons] = useState<string[]>([]);
  const [program, setProgram] = useState<string>("");

  function toggleAddon(key: string) {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function pickProgram(key: string) {
    setProgram(key);
    if (key && PROGRAM_PRESETS[key]) {
      setAddons(PROGRAM_PRESETS[key]);
    }
  }

  function changePeople(delta: number) {
    setPeople((p) => Math.max(1, Math.min(15, p + delta)));
  }

  function buildSummary(): string {
    const parts: string[] = ["Парение"];
    parts.push(`${people} ${peopleWord(people)}`);
    if (program && PROGRAM_LABELS[program]) {
      parts.push(`программа: ${PROGRAM_LABELS[program]}`);
    }
    for (const k of addons) {
      if (ADDON_LABELS[k]) parts.push(ADDON_LABELS[k]);
    }
    return parts.join(" · ");
  }

  function handleApply() {
    const detail: BanyaApplyDetail = {
      direction: "Баня",
      message: buildSummary(),
    };
    window.dispatchEvent(new CustomEvent(BANYA_APPLY_EVENT, { detail }));
    const target = document.getElementById("contact");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const summary = buildSummary();

  return (
    <section className="zone warm" id="configurator" aria-label="Конфигуратор">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Конфигуратор
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 36px",
            letterSpacing: "-.01em",
          }}
        >
          Соберите вечер
        </h2>

        <div className="banya-config">
          <div className="banya-config__row">
            <span className="banya-config__label">Количество человек</span>
            <div className="banya-config__counter">
              <button
                type="button"
                aria-label="Меньше"
                onClick={() => changePeople(-1)}
              >
                −
              </button>
              <span className="banya-config__count">{people}</span>
              <button
                type="button"
                aria-label="Больше"
                onClick={() => changePeople(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="banya-config__row banya-config__row--col">
            <span className="banya-config__label">Программа (опционально)</span>
            <div className="banya-config__chips">
              <button
                type="button"
                className={`banya-config__chip${program === "" ? " is-active" : ""}`}
                onClick={() => {
                  setProgram("");
                }}
              >
                Без программы
              </button>
              {Object.entries(PROGRAM_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`banya-config__chip${program === key ? " is-active" : ""}`}
                  onClick={() => pickProgram(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="banya-config__row banya-config__row--col">
            <span className="banya-config__label">Допники</span>
            <div className="banya-config__chips">
              {Object.entries(ADDON_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`banya-config__chip${addons.includes(key) ? " is-active" : ""}`}
                  onClick={() => toggleAddon(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="banya-config__summary">
            <div className="banya-config__summary-label">Состав</div>
            <div className="banya-config__summary-text">{summary}</div>
          </div>

          <button
            type="button"
            className="cta banya-config__submit"
            onClick={handleApply}
          >
            Оставить заявку&nbsp;→
          </button>
        </div>
      </div>
    </section>
  );
}

function peopleWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "человек";
  if (mod10 === 1) return "человек";
  if (mod10 >= 2 && mod10 <= 4) return "человека";
  return "человек";
}
```

- [ ] В `/home/user/projects/vigor-and-strength/app/globals.css` найди конец файла. Перед последним `@media (max-width: 520px)` блоком (тот же, перед которым ты вставлял sub-page primitives) добавь стили конфигуратора:

```css
/* ============ BANYA CONFIGURATOR ============ */

.banya-config {
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, .03);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 720px;
}
.banya-config__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.banya-config__row--col {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.banya-config__label {
  font-family: var(--font-sans), sans-serif;
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  opacity: .7;
}
.banya-config__counter {
  display: flex;
  align-items: center;
  gap: 16px;
}
.banya-config__counter button {
  width: 36px;
  height: 36px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  font-family: var(--font-sans), sans-serif;
  line-height: 1;
}
.banya-config__counter button:hover {
  background: rgba(0, 0, 0, .06);
}
.banya-config__count {
  font-family: var(--font-serif), serif;
  font-size: 28px;
  font-weight: 500;
  min-width: 2ch;
  text-align: center;
}
.banya-config__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.banya-config__chip {
  font-family: var(--font-sans), sans-serif;
  font-size: 13px;
  padding: 8px 14px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  cursor: pointer;
  letter-spacing: .02em;
  transition: background .15s;
}
.banya-config__chip:hover { background: rgba(0, 0, 0, .06); }
.banya-config__chip.is-active {
  background: currentColor;
  color: var(--warm-bg);
}
.banya-config__summary {
  border-top: 1px solid currentColor;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.banya-config__summary-label {
  font-family: var(--font-sans), sans-serif;
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  opacity: .6;
}
.banya-config__summary-text {
  font-family: var(--font-serif), serif;
  font-size: clamp(18px, 1.5vw, 22px);
  line-height: 1.45;
}
.banya-config__submit {
  align-self: flex-start;
}

@media (max-width: 520px) {
  .banya-config { padding: 24px 20px; }
  .banya-config__row {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

### Step 4.2 — Форма /banya с приёмом event'а

- [ ] Создай `/home/user/projects/vigor-and-strength/app/_components/banya/BanyaContact.tsx`:

```tsx
"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  BANYA_APPLY_EVENT,
  type BanyaApplyDetail,
} from "./BanyaConfigurator";

export function BanyaContact() {
  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState("Баня");

  useEffect(() => {
    function onApply(e: Event) {
      const detail = (e as CustomEvent<BanyaApplyDetail>).detail;
      if (!detail) return;
      setMessage(detail.message);
      setDirection(detail.direction);
    }
    window.addEventListener(BANYA_APPLY_EVENT, onApply);
    return () => window.removeEventListener(BANYA_APPLY_EVENT, onApply);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Связаться">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Записаться</div>
            <h2>Оставьте&nbsp;заявку</h2>
            <p className="helper">
              Перезвоним, согласуем удобное время и назовём ориентир по цене.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <label>
              Имя
              <input
                type="text"
                name="name"
                placeholder="Как к вам обращаться"
                required
              />
            </label>
            <label>
              Телефон
              <input
                type="tel"
                name="phone"
                placeholder="+7 ___ ___-__-__"
                required
              />
            </label>

            <label className="full">
              Направление
              <select
                name="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option>Баня</option>
                <option>Релаксология</option>
                <option>Тренировки (лист ожидания)</option>
                <option>Не определился</option>
              </select>
            </label>

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Когда удобно, сколько человек, особые пожелания"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit">
                Отправить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Отправить», вы соглашаетесь с обработкой персональных
                данных.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
```

### Step 4.3 — Добавь конфигуратор и Contact в page.tsx

- [ ] В `/home/user/projects/vigor-and-strength/app/banya/page.tsx` добавь импорты и вставь в композицию. Финальный файл:

```tsx
import type { Metadata } from "next";
import { BanyaHero } from "../_components/banya/BanyaHero";
import { BanyaIntro } from "../_components/banya/BanyaIntro";
import { BanyaPricingNote } from "../_components/banya/BanyaPricingNote";
import { BanyaBaseSteam } from "../_components/banya/BanyaBaseSteam";
import { BanyaAddons } from "../_components/banya/BanyaAddons";
import { BanyaPrograms } from "../_components/banya/BanyaPrograms";
import { BanyaConfigurator } from "../_components/banya/BanyaConfigurator";
import { BanyaCrossLinks } from "../_components/banya/BanyaCrossLinks";
import { BanyaContact } from "../_components/banya/BanyaContact";
import { Masters } from "../_components/Masters";
import { Footer } from "../_components/Footer";

export const metadata: Metadata = {
  title: "Баня — Бодрость и Сила",
  description:
    "Парим спокойно, с веником и чаем. Один или компанией до 15 человек. Выезд, партнёрские бани, своя локация в разработке.",
};

export default function BanyaPage() {
  return (
    <main>
      <BanyaHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <BanyaIntro />
      <BanyaPricingNote />
      <BanyaBaseSteam />
      <BanyaAddons />
      <BanyaPrograms />
      <BanyaConfigurator />
      <Masters
        title="Мастера"
        filterDirection="banya"
        ctaHref="/masters"
        ctaLabel="Все мастера&nbsp;→"
      />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <BanyaCrossLinks />
      <div className="bridge-cool-to-neutral" aria-hidden="true" />
      <BanyaContact />
      <div className="bridge-cool-to-darkneutral" aria-hidden="true" />
      <Footer />
    </main>
  );
}
```

### Step 4.4 — Build verify

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -15
```

**Expected:** typecheck + build green; route `○ /banya` остаётся static (конфигуратор и контакт client-children не превращают page в dynamic).

### Step 4.5 — Commit

- [ ] Закоммить:

```bash
git add app/_components/banya/BanyaConfigurator.tsx app/_components/banya/BanyaContact.tsx app/banya/page.tsx app/globals.css
git commit -m "/banya: конфигуратор без цен + форма с приёмом сводки через CustomEvent"
```

---

## Task 5 — Проверка вживую и push

**Files:** —

### Step 5.1 — Перезапусти prod-сервер

- [ ] Останови старый prod-сервер (контроллер исполнения знает task-id).
- [ ] Запусти заново:

```bash
npm run start
```

(в фоне; жди `Ready in`)

### Step 5.2 — Curl /banya

- [ ] Проверь, что /banya отдаётся 200 и содержит все блоки:

```bash
curl -s -o /tmp/banya.html -w "HTTP %{http_code}\n" http://localhost:3000/banya
echo '--- классы блоков:'
grep -oE 'class="(zone warm|zone cool|zone neutral-light|hero-sub|manifesto|cards col-3|format-list|crosslinks|banya-config)"' /tmp/banya.html | sort -u
echo '--- мастера на /banya (должно быть 3 уникальных × 2 = 6 в HTML, но клоны с master--clone):'
grep -oE 'class="master(--clone)?"' /tmp/banya.html | sort | uniq -c
echo '--- master Анна должна отсутствовать (она только релаксация):'
grep -c 'Анна' /tmp/banya.html
echo '--- кросс-линки:'
grep -oE 'href="/(relax|locations)"' /tmp/banya.html | sort -u
```

**Expected:**
- HTTP 200
- Все ключевые классы присутствуют (hero-sub, manifesto, cards col-3, format-list, crosslinks, banya-config).
- Мастеров: `class="master"` × 3, `class="master--clone"` × 3.
- Анна: 0 вхождений (она relax-only).
- Кросс-линки: `/relax` и `/locations` оба присутствуют.

### Step 5.3 — Verify главная не сломалась

- [ ] После refactor Masters.tsx главная должна работать как раньше:

```bash
curl -s -o /tmp/home.html -w "HTTP %{http_code}\n" http://localhost:3000/
echo '--- мастера на главной (4 + 4 клона):'
grep -oE 'class="master(--clone)?"' /tmp/home.html | sort | uniq -c
echo '--- Анна должна быть на главной (1+1 = 2):'
grep -c 'Анна' /tmp/home.html
```

**Expected:**
- HTTP 200
- `class="master"` × 4, `class="master--clone"` × 4.
- Анна: 2 вхождения.

### Step 5.4 — Push

- [ ] Запушить все коммиты:

```bash
git push origin main
```

**Expected:** `... -> main` без force и без конфликтов.

---

## Self-Review

**1. Spec coverage (§ → Task):**
- §«Маршрут и файловая структура» — Tasks 1, 2, 3, 4 (создаются все файлы в плане).
- §«Структура страницы» (11 блоков) — Tasks 3 (статика) + 4 (конфигуратор + Contact) + Footer reuse в page.tsx.
- §«Конфигуратор» — Task 4 Step 4.1 (компонент + state + CustomEvent).
- §«Данные мастеров» — Task 1.
- §«CSS-примитивы под-страниц» — Task 2.
- §«Out of scope» — нет тасков на /relax, /training, цены, sticky drawer, /masters/[slug], /locations. ✓.

**2. Placeholder scan:** нет «TBD», «TODO», «similar to», «handle edge cases». Все code-блоки полные.

**3. Type consistency:**
- `Direction = "banya" | "relax" | "training"` определён в Task 1.1, используется в Task 1.2 (Masters props), Task 3.8 (page.tsx prop), Task 4.3 (то же).
- `BanyaApplyDetail` определён в Task 4.1, импортируется в Task 4.2.
- `BANYA_APPLY_EVENT` экспортируется из Configurator, импортируется в Contact.
- Master type fields (`name`, `role`, `directions`, `tagsDisplay`, `bio`) одинаковы во всех использованиях.
- ✓ Имена консистентны.

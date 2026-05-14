# Страница /relax — релаксология — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать страницу `/relax` (релаксология) по архитектуре файлов /banya, но с другой логикой: без конфигуратора, программ и фиксированного списка допников. Главный артефакт — мастера и подход. Ритм зон зеркальный: cool → warm → cool.

**Architecture:** Маршрут `app/relax/page.tsx` собирает 5 новых компонентов из `app/_components/relax/` (`RelaxHero`, `RelaxIntro`, `RelaxApproach`, `RelaxCrossLinks`, `RelaxContact`) плюс общий `Masters` (уже поддерживает `filterDirection`). В `globals.css` добавляются 2 моста (`.bridge-cool-in`, `.bridge-cool-to-warm`) и блок параллельных `.relax-*` классов под cool-зону. Переиспользуются: `.hero`/`.hero-sub`/`.breadcrumb`, `.banya-hero-tags`/`.banya-hero-lead`, `.crosslinks`/`.crosslink`, `.contact-grid`/`.lead-form`, `.meta`, third bridge `.bridge-warm-to-cool`.

**Tech Stack:** Next.js 14 App Router, TypeScript, React (client component только `RelaxContact`), чистый CSS. Без новых зависимостей.

---

## Файловая структура

```
app/relax/page.tsx                            [CREATE]  маршрут, сборка секций, metadata
app/_components/relax/RelaxHero.tsx           [CREATE]  hero (dark), breadcrumb/h1/теги/лид/CTA
app/_components/relax/RelaxIntro.tsx           [CREATE]  cool-зона: манифест + форматы + ноты
app/_components/relax/RelaxApproach.tsx        [CREATE]  warm-зона: манифест «Как мы работаем»
app/_components/relax/RelaxCrossLinks.tsx      [CREATE]  cool-зона: 2 crosslink-карточки
app/_components/relax/RelaxContact.tsx         [CREATE]  neutral-light: форма заявки (client)
app/globals.css                               [MODIFY]  +2 моста, +блок /* RELAX PAGE */
app/_components/Masters.tsx                    [NO CHANGE] уже поддерживает filterDirection
```

## Решения по неоднозначностям (зафиксировано)

- **Список мастеров в select формы** — по ответу пользователя: строится из `MASTERS` (`app/_lib/data/masters.ts`), отфильтрованных по `relax`. Сейчас это 4 мастера (Дмитрий, Александр, Вадим, Анна) + опция «Не определился». Никита/Мария появятся автоматически, когда их добавят в данные.
- **Импорты** — алиас `@/*` есть в `tsconfig.json`. Новая страница использует `@/app/...` (как в тексте задачи), хотя `app/banya/page.tsx` использует относительные пути. Расхождение незначительное, следуем тексту задачи.
- **Третий мост (warm → cool, после Masters)** — спецификация разрешает переиспользовать существующий `.bridge-warm-to-cool`. В `page.tsx` используется `className="bridge-warm-to-cool"`, новый класс `.bridge-warm-to-cool-relax` НЕ создаётся (был бы байт-в-байт идентичен).
- **`.relax-*` классы вместо переиспользования `.banya-*`** — спецификация прямо предпочитает параллельные классы под cool-зону. Создаётся полный набор `.relax-intro*`/`.relax-formats*`/`.relax-format-card`/`.relax-approach`. Нулевой риск регресса /banya, отдельный словарь cool-зоны пригодится для /training.
- **Hero-классы** — `.banya-hero-tags` и `.banya-hero-lead` цвето-нейтральны на тёмном hero, переиспользуются. Создаётся только `.relax-hero-cta` (cool-палитра: фон `--cool-deep`, текст `--neutral-fg`) — спецификация требует холодную CTA для контраста с тёплой на /banya.
- **Мосты между CrossLinks→Contact и Contact→Footer** — спецификация даёт явный список рендера БЕЗ мостов в этих местах. Следуем списку буквально (на /banya они есть, здесь — нет; если понадобится, добавит пользователь).
- **Текст terms в форме** — формулируется под кнопку «Оставить заявку» («Нажимая „Оставить заявку“…»), а не дословный banya-вариант с «Отправить» — иначе текст ссылался бы на несуществующую кнопку.
- **Иконки форматов** — те же геометрические символы ◇ ○ □, что в `BanyaIntro` (единый визуальный язык).

## Тестирование

Тестов нет. Верификация: `npx tsc --noEmit && npm run build` (route `/relax` появляется и статичен), перезапуск prod, `curl /relax` + grep секций, `grep -ri "массаж"` по relax-файлам должен быть пуст.

---

## Task 1 — globals.css: мосты и стили cool-зоны

**Files:**
- Modify: `app/globals.css`

### Step 1.1 — Добавить два моста

- [ ] В `app/globals.css` найди:

```css
.bridge-cool-to-darkneutral {
  height: 96px;
  background: linear-gradient(to bottom, var(--cool-bg), #6c7180 60%, var(--neutral-bg));
}

/* ============ ZONES ============ */
```

- [ ] Замени на:

```css
.bridge-cool-to-darkneutral {
  height: 96px;
  background: linear-gradient(to bottom, var(--cool-bg), #6c7180 60%, var(--neutral-bg));
}
.bridge-cool-in {
  height: 64px;
  background: linear-gradient(to bottom, var(--neutral-bg), var(--cool-bg));
}
.bridge-cool-to-warm {
  height: 120px;
  background: linear-gradient(to bottom, var(--cool-bg) 0%, var(--bridge) 50%, var(--warm-bg) 100%);
}

/* ============ ZONES ============ */
```

### Step 1.2 — Добавить блок стилей `/* RELAX PAGE */`

- [ ] В `app/globals.css` найди (конец banya-медиазапросов + начало `.cards`):

```css
@media (max-width: 520px) {
  .banya-hero-tags { font-size: clamp(24px, 7vw, 36px); }
  .banya-hero-cta { display: block; text-align: center; }
}

.cards {
```

- [ ] Замени на:

```css
@media (max-width: 520px) {
  .banya-hero-tags { font-size: clamp(24px, 7vw, 36px); }
  .banya-hero-cta { display: block; text-align: center; }
}

/* ============ RELAX PAGE ============ */

/* hero — CTA в холодной палитре */
.relax-hero-cta {
  display: inline-block;
  font-family: var(--font-sans), sans-serif;
  font-size: 15px;
  letter-spacing: .04em;
  padding: 16px 32px;
  text-decoration: none;
  background: var(--cool-deep);
  color: var(--neutral-fg);
  border: 1px solid var(--cool-deep);
  transition: filter .15s;
}
.relax-hero-cta:hover {
  filter: brightness(1.25);
}

/* intro — манифест + форматы + ноты в cool-зоне */
.relax-intro {
  display: flex;
  flex-direction: column;
  gap: 80px;
}
.relax-intro-manifesto {
  text-align: center;
  max-width: 62ch;
  margin: 0 auto;
}
.relax-intro-manifesto h3 {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.01em;
  margin: 0 0 28px;
}
.relax-intro-manifesto p {
  font-family: var(--font-serif), serif;
  font-size: clamp(20px, 1.6vw, 26px);
  line-height: 1.55;
  margin: 0;
}
.relax-intro-divider {
  width: 64px;
  height: 1px;
  background: var(--cool-text);
  opacity: .35;
  margin: 0 auto;
}
.relax-formats h3 {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.01em;
  margin: 0 0 36px;
}
.relax-formats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.relax-format-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 24px;
  border: 1px solid var(--cool-text);
  background: rgba(0, 0, 0, .03);
}
.relax-format-icon {
  font-size: 28px;
  line-height: 1;
  color: var(--cool-deep);
}
.relax-format-card h4 {
  font-family: var(--font-serif), serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
}
.relax-format-card p {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .85;
  margin: 0;
}
.relax-formats-note {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .7;
  margin: 28px 0 0;
  max-width: 60ch;
}
.relax-price-note {
  font-family: var(--font-sans), sans-serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.5;
  opacity: .7;
  max-width: 52ch;
  margin: 0;
}

/* approach — манифест в тёплой зоне */
.relax-approach {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 60ch;
}
.relax-approach p {
  font-family: var(--font-serif), serif;
  font-size: clamp(19px, 1.4vw, 22px);
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 880px) {
  .relax-intro { gap: 56px; }
  .relax-formats-grid { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .relax-hero-cta { display: block; text-align: center; }
}

.cards {
```

---

## Task 2 — Компоненты relax и маршрут

**Files:**
- Create: `app/_components/relax/RelaxHero.tsx`
- Create: `app/_components/relax/RelaxIntro.tsx`
- Create: `app/_components/relax/RelaxApproach.tsx`
- Create: `app/_components/relax/RelaxCrossLinks.tsx`
- Create: `app/_components/relax/RelaxContact.tsx`
- Create: `app/relax/page.tsx`

### Step 2.1 — RelaxHero.tsx

- [ ] Создай `app/_components/relax/RelaxHero.tsx`:

```tsx
export function RelaxHero() {
  return (
    <section className="hero" aria-label="Релаксология — заголовок">
      <div className="wrap">
        <div className="hero-sub">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Релаксология
          </div>
          <h1>Релаксология</h1>

          <div className="banya-hero-tags">
            Тактильное восстановление <span>·</span> Работа с телом{" "}
            <span>·</span> Нейрорелаксация
          </div>

          <div className="banya-hero-lead">
            <p>Работаем с телом руками — мягко, медленно, по ощущениям.</p>
            <p>Выезд по Оренбургу, у партнёров и в своих локациях.</p>
          </div>

          <a className="relax-hero-cta" href="#contact">
            Записаться к мастеру&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Step 2.2 — RelaxIntro.tsx

- [ ] Создай `app/_components/relax/RelaxIntro.tsx`:

```tsx
export function RelaxIntro() {
  return (
    <section className="zone cool" aria-label="Описание направления">
      <div className="wrap">
        <div className="relax-intro">
          <div className="relax-intro-manifesto">
            <h3>Что это</h3>
            <p>
              Релаксология — это работа с телом руками без медицинского
              контекста и без процедурной логики. Сеанс длится час или больше, в
              нём нет «зон по таймеру» и обязательных техник. Мастер слушает
              руками то, что в теле сейчас просится, и работает с этим —
              медленно, в тишине, по ощущениям.
            </p>
          </div>

          <div className="relax-intro-divider" aria-hidden="true" />

          <div className="relax-formats">
            <h3>Форматы работы</h3>
            <div className="relax-formats-grid">
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  ◇
                </div>
                <h4>Выезд</h4>
                <p>
                  Приезжаем к вам со своим — складной стол, валики, масла.
                  Работаем у вас дома, в номере или на природе.
                </p>
              </article>
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  ○
                </div>
                <h4>Партнёрские студии</h4>
                <p>
                  Работаем в проверенных пространствах, где есть всё нужное.
                  Список локаций ниже.
                </p>
              </article>
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  □
                </div>
                <h4>Своя локация</h4>
                <p>
                  В разработке. Откроемся в [адрес — placeholder]. Следите за
                  анонсами.
                </p>
              </article>
            </div>
            <p className="relax-formats-note">
              После пара тело отзывается совершенно иначе — работа с телом часто
              становится частью банного вечера.
            </p>
          </div>

          <p className="relax-price-note">
            Прайса нет — длительность и состав сеанса подбирает мастер под
            запрос. Цена обсуждается заранее, в звонке.
          </p>
        </div>
      </div>
    </section>
  );
}
```

### Step 2.3 — RelaxApproach.tsx

- [ ] Создай `app/_components/relax/RelaxApproach.tsx`:

```tsx
export function RelaxApproach() {
  return (
    <section className="zone warm" aria-label="Подход">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Подход
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
          Как мы работаем
        </h2>
        <div className="relax-approach">
          <p>
            Никакого протокола, никаких «зон» и никаких «обязательных техник». Мы
            работаем от того, что в теле сейчас.
          </p>
          <p>
            Перед сеансом можно коротко рассказать, что беспокоит, где зажато или
            просто что хочется отпустить. Этого достаточно — остальное мастер
            видит сам, через касание.
          </p>
          <p>
            Сеанс длится час, полтора, иногда два. Без таймера на стене. Когда
            тело отпустило — мы заканчиваем.
          </p>
        </div>
      </div>
    </section>
  );
}
```

### Step 2.4 — RelaxCrossLinks.tsx

- [ ] Создай `app/_components/relax/RelaxCrossLinks.tsx`:

```tsx
export function RelaxCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/banya">
            <span className="cl-eyebrow">Хорошо сочетается</span>
            <h3 className="cl-title">Баня</h3>
            <span className="cl-arrow">
              Работа с телом после пара глубже и спокойнее&nbsp;→
            </span>
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

### Step 2.5 — RelaxContact.tsx

- [ ] Создай `app/_components/relax/RelaxContact.tsx`:

```tsx
"use client";

import { type FormEvent } from "react";
import { MASTERS } from "@/app/_lib/data/masters";

const RELAX_MASTERS = MASTERS.filter((m) => m.directions.includes("relax"));

export function RelaxContact() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Заявка /relax:", data);
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Связаться">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>Запишитесь к&nbsp;мастеру</h2>
            <p className="helper">
              Опишите, что беспокоит или что хочется. Перезвоним, согласуем
              время, мастера и формат.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <label className="full">
              Имя
              <input
                type="text"
                name="name"
                placeholder="Как к вам обращаться"
                required
              />
            </label>
            <label className="full">
              Телефон
              <input
                type="tel"
                name="phone"
                placeholder="+7 ___ ___-__-__"
                required
              />
            </label>

            <label className="full">
              Мастер
              <select name="master">
                <option>Не определился</option>
                {RELAX_MASTERS.map((m) => (
                  <option key={m.name}>{m.name}</option>
                ))}
              </select>
            </label>

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Что беспокоит, какой формат удобнее, есть ли пожелания по мастеру."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit">
                Оставить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы соглашаетесь с обработкой
                персональных данных.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
```

### Step 2.6 — app/relax/page.tsx

- [ ] Создай `app/relax/page.tsx`:

```tsx
import type { Metadata } from "next";
import { RelaxHero } from "@/app/_components/relax/RelaxHero";
import { RelaxIntro } from "@/app/_components/relax/RelaxIntro";
import { RelaxApproach } from "@/app/_components/relax/RelaxApproach";
import { Masters } from "@/app/_components/Masters";
import { RelaxCrossLinks } from "@/app/_components/relax/RelaxCrossLinks";
import { RelaxContact } from "@/app/_components/relax/RelaxContact";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Релаксология — Бодрость и Сила",
  description:
    "Тактильное восстановление и работа с телом руками — мягко, медленно, по ощущениям. Выезд по Оренбургу, партнёрские студии, своя локация в разработке.",
};

export default function RelaxPage() {
  return (
    <main>
      <RelaxHero />
      <div className="bridge-cool-in" aria-hidden="true" />
      <RelaxIntro />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <RelaxApproach />
      <Masters filterDirection="relax" />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <RelaxCrossLinks />
      <RelaxContact />
      <Footer />
    </main>
  );
}
```

---

## Task 3 — Сборка, проверка, коммит

**Files:** нет (верификация и git)

### Step 3.1 — Build verify

- [ ] ```bash
npx tsc --noEmit && npm run build 2>&1 | tail -12
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; в списке роутов появилась строка `○ /relax` (static).

### Step 3.2 — Прогон вживую

- [ ] Останови старый prod-сервер (`fuser -k 3000/tcp; pkill -f next-server`), запусти заново `npm run start` в фоне, дождись `Ready in`.
- [ ] Curl-проверка:

```bash
curl -s http://localhost:3000/relax -o /tmp/relax.html -w "HTTP %{http_code}\n"
echo '--- hero:'
grep -c 'Главная / Релаксология' /tmp/relax.html
grep -c 'Записаться к мастеру' /tmp/relax.html
echo '--- intro (манифест + форматы + ноты):'
grep -c 'без медицинского' /tmp/relax.html
grep -o 'relax-format-card' /tmp/relax.html | wc -l
grep -c 'частью банного вечера' /tmp/relax.html
grep -c 'Прайса нет' /tmp/relax.html
echo '--- approach:'
grep -c 'Как мы работаем' /tmp/relax.html
grep -c 'Без таймера на стене' /tmp/relax.html
echo '--- masters только relax (Анна есть):'
grep -c 'Анна' /tmp/relax.html
echo '--- crosslinks:'
grep -c 'crosslink' /tmp/relax.html
echo '--- contact:'
grep -c 'Запишитесь к' /tmp/relax.html
echo '--- ритм зон (bridge-cool-in, bridge-cool-to-warm, bridge-warm-to-cool):'
grep -o 'bridge-cool-in\|bridge-cool-to-warm\|bridge-warm-to-cool' /tmp/relax.html | sort -u
echo '--- слова «массаж» нет (0):'
grep -ric "массаж" app/relax/ app/_components/relax/ ; echo "grep exit: $?"
```

**Expected:** HTTP 200; hero-строки = 1; «без медицинского» = 1; `relax-format-card` = 3; сноска и ценовая нота = 1; «Как мы работаем» и «Без таймера…» = 1; «Анна» ≥ 1; `crosslink` ≥ 2; «Запишитесь к» = 1; три моста перечислены; `grep "массаж"` пуст, exit 1.

### Step 3.3 — Commit + push

- [ ] ```bash
git add app/relax/page.tsx app/_components/relax/ app/globals.css docs/superpowers/plans/2026-05-15-relax-page.md
git commit -m "создай страницу /relax: hero, intro с форматами, approach-манифест, мастера релакса, cross-links, форма"
git push origin main
```

**Expected:** коммит из 8 файлов (6 новых .tsx + globals.css + план); push `... -> main`.

---

## Self-Review

**1. Spec coverage:**
- ЗАДАЧА 1 (маршрут, импорты, порядок render, мосты) → Step 2.6 (`page.tsx` точно по списку рендера), Step 1.1 (`.bridge-cool-in`, `.bridge-cool-to-warm`; третий мост — переиспользован `.bridge-warm-to-cool`, обосновано в решениях).
- ЗАДАЧА 2 (`RelaxHero`: breadcrumb, h1, теги, лид из 2 строк, CTA `#contact`, cool-палитра CTA) → Step 2.1 + `.relax-hero-cta` в Step 1.2.
- ЗАДАЧА 3 (`RelaxIntro`: cool-зона, манифест «Что это», 3 карточки форматов, сноска, ценовая нота) → Step 2.2 + `.relax-intro*`/`.relax-formats*`/`.relax-price-note` в Step 1.2.
- ЗАДАЧА 4 (`RelaxApproach`: warm-зона, meta «Подход», h2 «Как мы работаем», 3 абзаца) → Step 2.3 + `.relax-approach` в Step 1.2.
- ЗАДАЧА 5 (`Masters` фильтрация) → уже реализовано в `Masters.tsx` (`filterDirection?: Direction | null`, `MASTERS.filter(... .includes(filterDirection))`), `Direction` включает `"relax"`. Правок не требует; используется в Step 2.6.
- ЗАДАЧА 6 (`RelaxCrossLinks`: cool-зона, 2 карточки Баня/Локации, классы `.crosslinks`/`.crosslink`) → Step 2.4.
- ЗАДАЧА 7 (`RelaxContact`: neutral-light, id=contact, meta/h2/helper, форма имя/телефон/select мастера/textarea/submit+terms, заглушка console.log+alert, без CustomEvent) → Step 2.5.
- ЗАДАЧА 8 (проверка + grep массаж) → Steps 3.1–3.2.
- ЗАДАЧА 9 (коммит с точным сообщением + push) → Step 3.3.

**2. Placeholder scan:** нет «TBD/TODO». «[адрес — placeholder]» в карточке «Своя локация» — намеренный плейсхолдер из текста спецификации (и из `BanyaIntro`), не пропуск плана. Все файлы даны целиком, CSS — точными old/new парами с якорями.

**3. Type consistency:**
- `Masters` props: `filterDirection?: Direction | null`, `Direction = "banya" | "relax" | "training"` — `<Masters filterDirection="relax" />` валиден.
- `RelaxContact`: `MASTERS` импортируется из `@/app/_lib/data/masters` (named export есть), `m.directions.includes("relax")` — `directions: Direction[]`, `"relax"` валиден. `FormEvent<HTMLFormElement>` импортирован как type.
- Все 5 relax-компонентов — named export'ы (`RelaxHero` и т.д.), `page.tsx` импортирует именно их; `Footer` и `Masters` — named export'ы (как в `app/banya/page.tsx`).
- Только `RelaxContact` имеет `"use client"` (нужен `onSubmit`/`FormData`); остальные 4 компонента и `page.tsx` — серверные. Клиентский потомок серверного `page.tsx` валиден.
- CSS-классы из JSX покрыты: `.relax-hero-cta`, `.relax-intro`, `.relax-intro-manifesto`(+h3/p), `.relax-intro-divider`, `.relax-formats`(+h3), `.relax-formats-grid`, `.relax-format-card`(+h4/p), `.relax-format-icon`, `.relax-formats-note`, `.relax-price-note`, `.relax-approach`(+p), `.bridge-cool-in`, `.bridge-cool-to-warm` — все в Step 1. Переиспользуемые (`.hero`, `.hero-sub`, `.breadcrumb`, `.banya-hero-tags`, `.banya-hero-lead`, `.zone`/`.cool`/`.warm`/`.neutral-light`, `.wrap`, `.meta`, `.crosslinks`/`.crosslink`/`.cl-*`, `.contact-grid`/`.helper`/`.lead-form`/`.full`/`.submit-row`/`.terms`/`.cta`, `.bridge-warm-to-cool`) — существуют в `globals.css`.

# Hero и Intro /banya — ритмичная подача — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переработать верх `/banya` — Hero из «сплошняка» в трёхчастную структуру с CTA-якорем, Intro из трёх одинаковых рядов в два разных по форме блока (центрированный манифест + три формат-карточки), цену перенести в шапку конфигуратора.

**Architecture:** Точечные правки трёх компонентов (`BanyaHero`, `BanyaIntro`, `BanyaConfigurator`) + новые изолированные CSS-классы в `globals.css`. Hero CTA — обычный `<a href="#configurator">`, плавный скролл обеспечивается `scroll-behavior: smooth` на `html` (+ `scroll-padding-top` под фиксированный хедер, + отключение для `prefers-reduced-motion`). Удаляются классы `.banya-intro-grid/.banya-intro-row`, добавленные прошлой задачей и теперь мёртвые.

**Tech Stack:** Next.js 14, TypeScript, JSX, CSS-grid/flex. Без новых зависимостей, без JS для скролла.

---

## Файловая структура

```
app/_components/banya/
├── BanyaHero.tsx          [MODIFY]  <p className="lead"> → теги + лид + CTA
├── BanyaIntro.tsx         [MODIFY]  убрать «Цена», 2 блока разной формы
└── BanyaConfigurator.tsx  [MODIFY]  +плашка про цену перед .banya-config
app/globals.css            [MODIFY]  -.banya-intro-grid/row (dead);
                                     +scroll-behavior; +banya-hero/intro/formats/config-note классы
```

## Тестирование

Тестов в проекте нет. Верификация: `npm run build` (type/JSX-ошибки), перезапуск prod, `curl /banya` на наличие новой разметки и отсутствие старой.

---

## Task 1 — Hero, Intro, Configurator-плашка

**Files:**
- Modify: `app/globals.css`
- Modify: `app/_components/banya/BanyaHero.tsx`
- Modify: `app/_components/banya/BanyaIntro.tsx`
- Modify: `app/_components/banya/BanyaConfigurator.tsx`

### Step 1.1 — globals.css: smooth-scroll на html

- [ ] В `app/globals.css` найди в начале файла:

```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
```

Заменить на:

```css
* { box-sizing: border-box; }
html {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  scroll-padding-top: 72px;
}
body { margin: 0; padding: 0; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### Step 1.2 — globals.css: заменить dead `.banya-intro-grid` блок на новые классы

- [ ] В `app/globals.css` найди блок, добавленный прошлой задачей (начинается с `/* ============ BANYA INTRO GRID ============ */`), целиком:

```css
/* ============ BANYA INTRO GRID ============ */
.banya-intro-grid {
  display: flex;
  flex-direction: column;
  gap: 56px;
}
.banya-intro-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  align-items: start;
}
.banya-intro-row .kicker {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.6;
  opacity: .7;
  text-transform: uppercase;
  letter-spacing: .16em;
  margin: 0;
}
.banya-intro-row p:not(.kicker) {
  font-family: var(--font-serif), serif;
  font-size: clamp(19px, 1.4vw, 22px);
  line-height: 1.55;
  margin: 0;
  max-width: 60ch;
}
@media (max-width: 880px) {
  .banya-intro-grid { gap: 36px; }
  .banya-intro-row { grid-template-columns: 1fr; gap: 12px; }
}
```

Заменить этот блок целиком на:

```css
/* ============ BANYA PAGE — HERO / INTRO ============ */

/* hero — теги, лид, CTA */
.banya-hero-tags {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 3.4vw, 52px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.01em;
  margin: 0 0 28px;
  color: var(--neutral-fg);
}
.banya-hero-tags span {
  margin: 0 .4em;
  color: #7a7468;
}
.banya-hero-lead {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 36px;
}
.banya-hero-lead p {
  font-family: var(--font-sans), sans-serif;
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.5;
  margin: 0;
  color: #cdc4b3;
}
.banya-hero-cta {
  display: inline-block;
  font-family: var(--font-sans), sans-serif;
  font-size: 15px;
  letter-spacing: .04em;
  padding: 16px 32px;
  text-decoration: none;
  background: var(--warm-bg);
  color: var(--warm-text);
  border: 1px solid var(--warm-bg);
  transition: background .15s, border-color .15s;
}
.banya-hero-cta:hover {
  background: var(--warm-deep);
  border-color: var(--warm-deep);
}

/* intro — два блока разной формы */
.banya-intro {
  display: flex;
  flex-direction: column;
  gap: 80px;
}
.banya-intro-manifesto {
  text-align: center;
  max-width: 62ch;
  margin: 0 auto;
}
.banya-intro-manifesto h3 {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.01em;
  margin: 0 0 28px;
}
.banya-intro-manifesto p {
  font-family: var(--font-serif), serif;
  font-size: clamp(20px, 1.6vw, 26px);
  line-height: 1.55;
  margin: 0;
}
.banya-intro-divider {
  width: 64px;
  height: 1px;
  background: var(--warm-text);
  opacity: .35;
  margin: 0 auto;
}
.banya-formats h3 {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.01em;
  margin: 0 0 36px;
}
.banya-formats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.banya-format-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 24px;
  border: 1px solid var(--warm-text);
  background: rgba(0, 0, 0, .03);
}
.banya-format-icon {
  font-size: 28px;
  line-height: 1;
  color: var(--warm-deep);
}
.banya-format-card h4 {
  font-family: var(--font-serif), serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
}
.banya-format-card p {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .85;
  margin: 0;
}
.banya-formats-note {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: .7;
  margin: 28px 0 0;
  max-width: 60ch;
}

/* configurator — плашка про цену */
.banya-config-note {
  font-family: var(--font-sans), sans-serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.5;
  opacity: .7;
  max-width: 52ch;
  margin: 0 0 28px;
}

@media (max-width: 880px) {
  .banya-intro { gap: 56px; }
  .banya-formats-grid { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .banya-hero-tags { font-size: clamp(24px, 7vw, 36px); }
  .banya-hero-cta { display: block; text-align: center; }
}
```

### Step 1.3 — BanyaHero.tsx: трёхчастная структура

- [ ] Перепиши `app/_components/banya/BanyaHero.tsx` целиком:

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

          <div className="banya-hero-tags">
            Парная <span>·</span> Веник <span>·</span> Чай
          </div>

          <div className="banya-hero-lead">
            <p>Работаем по Оренбургу и области.</p>
            <p>До пятнадцати человек, при желании — в четыре руки.</p>
          </div>

          <a className="banya-hero-cta" href="#configurator">
            Собрать вечер&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Step 1.4 — BanyaIntro.tsx: два блока разной формы

- [ ] Перепиши `app/_components/banya/BanyaIntro.tsx` целиком:

```tsx
export function BanyaIntro() {
  return (
    <section className="zone warm" aria-label="Описание направления">
      <div className="wrap">
        <div className="banya-intro">
          <div className="banya-intro-manifesto">
            <h3>Как мы парим</h3>
            <p>
              Парение — основа любого вечера в бане. Заходы в парную, веник,
              перерывы на чай и воздух. Это ритм, на который нанизываются
              добавки: ароматерапия, поющие чаши, работа с телом после пара —
              по настроению или под цель.
            </p>
          </div>

          <div className="banya-intro-divider" aria-hidden="true" />

          <div className="banya-formats">
            <h3>Форматы работы</h3>
            <div className="banya-formats-grid">
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ◇
                </div>
                <h4>Выезд</h4>
                <p>
                  Приезжаем к вам со всем нужным — веничный набор, масла, чай.
                  Парим в вашей бане или сауне.
                </p>
              </article>
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ○
                </div>
                <h4>Партнёрские бани</h4>
                <p>
                  Работаем в проверенных банных комплексах с прямой записью к
                  мастеру. Список локаций ниже.
                </p>
              </article>
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  □
                </div>
                <h4>Своя локация</h4>
                <p>
                  В разработке. Откроемся в [адрес — placeholder]. Следите за
                  анонсами.
                </p>
              </article>
            </div>
            <p className="banya-formats-note">
              При большой компании или особом запросе — работа в четыре руки,
              двумя мастерами одновременно.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Заметка: `[адрес — placeholder]` оставлен дословно — намеренный маркер места под реальный адрес.

### Step 1.5 — BanyaConfigurator.tsx: плашка про цену

- [ ] В `app/_components/banya/BanyaConfigurator.tsx` найди фрагмент (h2 заголовок и сразу за ним `<div className="banya-config">`):

```tsx
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
```

Заменить на (между `</h2>` и `<div className="banya-config">` вставлена плашка):

```tsx
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

        <p className="banya-config-note">
          Прайса как такового нет — слишком много переменных. Соберите состав
          ниже, и мы назовём вилку.
        </p>

        <div className="banya-config">
```

### Step 1.6 — Build verify

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -12
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` остаётся static.

### Step 1.7 — Прогон вживую

- [ ] Останови старый prod-сервер (контроллер знает task-id), запусти заново `npm run start` (фон, жди `Ready in`).
- [ ] Curl-проверка:

```bash
curl -s -o /tmp/banya.html -w "HTTP %{http_code}\n" http://localhost:3000/banya
echo '--- hero:'
grep -c 'banya-hero-tags' /tmp/banya.html
grep -c 'banya-hero-cta' /tmp/banya.html
grep -oE 'href="#configurator"' /tmp/banya.html
echo '--- hero тексты:'
grep -c 'Работаем по Оренбургу' /tmp/banya.html
grep -c 'Собрать вечер' /tmp/banya.html
echo '--- intro: манифест + форматы:'
grep -c 'banya-intro-manifesto' /tmp/banya.html
grep -c 'banya-formats-grid' /tmp/banya.html
grep -o 'banya-format-card' /tmp/banya.html | wc -l
echo '--- формат-карточки тексты:'
grep -c 'веничный набор, масла, чай' /tmp/banya.html
grep -c 'банных комплексах' /tmp/banya.html
grep -c 'двумя мастерами одновременно' /tmp/banya.html
echo '--- config note:'
grep -c 'banya-config-note' /tmp/banya.html
grep -c 'мы назовём вилку' /tmp/banya.html
echo '--- старое НЕ должно остаться (всё 0):'
grep -c 'banya-intro-row' /tmp/banya.html
grep -c 'согласуем детали в звонке' /tmp/banya.html
```

**Expected:** HTTP 200; все «hero / intro / config note» проверки ≥1; `banya-format-card` = 3; обе «старые» проверки = 0.

### Step 1.8 — Commit + push

- [ ] Закоммить и запушить:

```bash
git add app/globals.css app/_components/banya/BanyaHero.tsx app/_components/banya/BanyaIntro.tsx app/_components/banya/BanyaConfigurator.tsx
git commit -m "переработай hero и intro страницы бани: подача ритмом, формат-карточки, цена в конфигуратор"
git push origin main
```

**Expected:** коммит из 4 файлов; push `... -> main`.

---

## Self-Review

**1. Spec coverage (шаг запроса → шаг плана):**
- ШАГ 1 Hero: теги «Парная · Веник · Чай», две лидовые строки, CTA «Собрать вечер →» href=#configurator, паузы-отступы, мобильный стек+растяжение CTA, новые классы → Step 1.2 (CSS) + Step 1.3 (JSX).
- ШАГ 2 Intro: убрать «Цена»; блок 1 — центрированный абзац-манифест с заголовком, без китчера; разделитель простой; блок 2 — заголовок + 3 карточки (символ + название + описание) + строка-сноска; новые классы → Step 1.2 (CSS) + Step 1.4 (JSX).
- ШАГ 3 «Цена» в шапку конфигуратора, курсив/приглушённо, перед `.banya-config` → Step 1.2 (`.banya-config-note`) + Step 1.5 (JSX).
- ШАГ 4 проверка → Steps 1.6–1.7.
- ШАГ 5 коммит с точным сообщением + push → Step 1.8.
- Плавный скролл по якорю (требование ШАГ 4 «клик плавно скроллит») → Step 1.1 (`scroll-behavior: smooth` + `scroll-padding-top` под фиксированный хедер).

**2. Placeholder scan:** `[адрес — placeholder]` — намеренный маркер по дословному тексту запроса. Других «TBD/TODO» нет. Все code-блоки полные (файлы целиком либо точные фрагменты замены).

**3. Type consistency:** правки текст + CSS + JSX-структура, типов/пропсов нет. Имена экспортов компонентов (`BanyaHero`, `BanyaIntro`, `BanyaConfigurator`) не меняются — `page.tsx` импорты валидны. Новые CSS-классы (`banya-hero-tags`, `banya-hero-lead`, `banya-hero-cta`, `banya-intro`, `banya-intro-manifesto`, `banya-intro-divider`, `banya-formats`, `banya-formats-grid`, `banya-format-card`, `banya-format-icon`, `banya-formats-note`, `banya-config-note`) консистентны между Step 1.2 (определение) и Steps 1.3–1.5 (использование). Удаляемые `.banya-intro-grid/.banya-intro-row` после Step 1.2 нигде не используются (BanyaIntro переписан в Step 1.4).

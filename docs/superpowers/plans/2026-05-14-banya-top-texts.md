# Тексты верхней части /banya — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Обновить тексты в четырёх верхних блоках страницы `/banya` — Hero, Intro, PricingNote, BaseSteam — без изменения структуры компонентов.

**Architecture:** Точечные правки JSX-текста в четырёх существующих компонентах. Структура страницы, роутинг, CSS — не трогаются. Два блока (Intro, BaseSteam) теряют псевдо-цитату `.lead-q` и переформулируются; подзаголовки внутри `.manifesto .body` оформляются классом `kicker` (в `globals.css` `.manifesto .body p.kicker` — established eyebrow-стиль подзаголовка).

**Tech Stack:** Next.js 14, TypeScript, JSX. Без новых зависимостей, без правок CSS.

---

## Файловая структура

```
app/_components/banya/
├── BanyaHero.tsx          [MODIFY]  текст <p className="lead">
├── BanyaIntro.tsx         [MODIFY]  переписать содержимое .manifesto: убрать .lead-q, два подраздела
├── BanyaPricingNote.tsx   [MODIFY]  текст <p>
└── BanyaBaseSteam.tsx     [MODIFY]  убрать .lead-q, переписать текст .body
```

## Тестирование

Тестов в проекте нет. Верификация: `npm run build` (ловит type/JSX-ошибки), затем перезапуск prod-сервера + `curl /banya` на HTTP 200 и наличие нового текста.

---

## Task 1 — Обновить тексты Hero / Intro / PricingNote / BaseSteam

**Files:**
- Modify: `app/_components/banya/BanyaHero.tsx`
- Modify: `app/_components/banya/BanyaIntro.tsx`
- Modify: `app/_components/banya/BanyaPricingNote.tsx`
- Modify: `app/_components/banya/BanyaBaseSteam.tsx`

### Step 1.1 — BanyaHero: текст lead

- [ ] В `app/_components/banya/BanyaHero.tsx` заменить содержимое `<p className="lead">`. Файл целиком после правки:

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
            Дровяная парная, веник, чай. Парим у вас, в партнёрских банях,
            скоро в своей. До пятнадцати человек, при желании — в четыре руки.
          </p>
        </div>
      </div>
    </section>
  );
}
```

### Step 1.2 — BanyaIntro: переписать .manifesto

- [ ] В `app/_components/banya/BanyaIntro.tsx` убрать `<div className="lead-q">…</div>`, переписать `.body` на два подраздела (подзаголовок `kicker` + абзац). Файл целиком после правки:

```tsx
export function BanyaIntro() {
  return (
    <section className="zone warm" aria-label="Описание направления">
      <div className="wrap">
        <div className="manifesto">
          <div className="body">
            <p className="kicker">Как мы парим</p>
            <p>
              Не быстро. Веник работает в нескольких слоях — сначала прогрев,
              потом разгон, потом расслабление. Между заходами — отдых, чай,
              тишина. Если хочется звуковую паузу с поющими чашами или
              ароматерапию — добавляем по настроению.
            </p>
            <p className="kicker">Форматы работы</p>
            <p>
              Выезжаем к вам с веничным набором и всем нужным. Работаем в
              партнёрских банях с прямой записью к мастеру. Своя локация в
              разработке — откроемся в [adress placeholder]. При большой
              компании или особом запросе — работа в четыре руки, двумя
              мастерами одновременно.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Заметка: `[adress placeholder]` оставлен дословно в квадратных скобках — это намеренный маркер места под реальный адрес.

### Step 1.3 — BanyaPricingNote: текст <p>

- [ ] В `app/_components/banya/BanyaPricingNote.tsx` заменить текст `<p>`. Файл целиком после правки:

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
          Прайса как такового нет — слишком много переменных. Соберите свой
          вечер в конфигураторе, и мы назовём вилку.
        </p>
      </div>
    </section>
  );
}
```

### Step 1.4 — BanyaBaseSteam: убрать .lead-q, переписать текст

- [ ] В `app/_components/banya/BanyaBaseSteam.tsx` убрать `<div className="lead-q">Базовое парение</div>`, заменить текст `<p>` внутри `.body`. Файл целиком после правки:

```tsx
export function BanyaBaseSteam() {
  return (
    <section className="zone warm" aria-label="Базовое парение">
      <div className="wrap">
        <div className="manifesto">
          <div className="body">
            <p>
              Сердцевина любого вечера — само парение. Заходы в парную, веник,
              перерывы на воду и воздух. Это базовый ритм, всё остальное
              нанизывается сверху.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 1.5 — Build verify

- [ ] Запусти из `/home/user/projects/vigor-and-strength`:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -12
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` остаётся в таблице, static.

### Step 1.6 — Прогон страницы вживую

- [ ] Останови старый prod-сервер (контроллер исполнения знает task-id) и запусти заново `npm run start` (в фоне, жди `Ready in`).
- [ ] Curl-проверка:

```bash
curl -s -o /tmp/banya.html -w "HTTP %{http_code}\n" http://localhost:3000/banya
echo '--- новые тексты присутствуют:'
grep -c 'Дровяная парная' /tmp/banya.html
grep -c 'Как мы парим' /tmp/banya.html
grep -c 'Форматы работы' /tmp/banya.html
grep -c 'adress placeholder' /tmp/banya.html
grep -c 'назовём вилку' /tmp/banya.html
grep -c 'Сердцевина любого вечера' /tmp/banya.html
echo '--- старые тексты удалены (всё должно быть 0):'
grep -c 'Не процедура. Вечер' /tmp/banya.html
grep -c 'Парим спокойно, с веником и чаем' /tmp/banya.html
```

**Expected:** HTTP 200; каждая «новая» проверка ≥ 1; обе «старые» проверки = 0.

### Step 1.7 — Commit + push

- [ ] Закоммить и запушить:

```bash
git add app/_components/banya/BanyaHero.tsx app/_components/banya/BanyaIntro.tsx app/_components/banya/BanyaPricingNote.tsx app/_components/banya/BanyaBaseSteam.tsx
git commit -m "обнови тексты верхней части страницы бани"
git push origin main
```

**Expected:** `... -> main` без конфликтов.

---

## Self-Review

**1. Spec coverage (запрос пользователя → шаг):**
- ФАЙЛ 1 BanyaHero lead → Step 1.1.
- ФАЙЛ 2 BanyaIntro переписать .manifesto, убрать псевдо-цитату, два подраздела с kicker → Step 1.2.
- ФАЙЛ 3 BanyaPricingNote текст <p> → Step 1.3.
- ФАЙЛ 4 BanyaBaseSteam убрать .lead-q, переписать .body → Step 1.4.
- «запусти dev-сборку, убедись что /banya открывается» → Steps 1.5–1.6 (build + curl; prod-server вместо dev — функционально эквивалентно для проверки «открывается без ошибок»).
- «git add, git commit, git push» с сообщением «обнови тексты верхней части страницы бани» → Step 1.7.

**2. Placeholder scan:** `[adress placeholder]` — намеренный (по явному указанию пользователя), не plan-failure. Других «TBD/TODO» нет. Все code-блоки полные (файлы целиком).

**3. Type consistency:** правки только текстовые, типы/пропсы/имена компонентов не меняются. `BanyaHero`, `BanyaIntro`, `BanyaPricingNote`, `BanyaBaseSteam` — экспортируемые имена не трогаются, `page.tsx` импорты остаются валидны.

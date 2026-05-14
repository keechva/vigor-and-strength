# Точечные стили конфигуратора бани — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Визуально улучшить конфигуратор бани на `/banya` — центрирование, контраст активных допников, акцентная полоска у шагов, выделение блока сводки. Логика компонентов не трогается.

**Architecture:** Только правки CSS в блоке `/* BANYA CONFIGURATOR */` файла `app/globals.css`. Пять точечных `Edit`-замен. JSX/TS компонентов не меняется — все используемые классы (`.banya-config__step`, `.banya-config__chip.is-active`, `.banya-config__program-card.is-active`, `.banya-config__summary`) уже присутствуют в разметке `BanyaConfigurator.tsx`.

**Tech Stack:** Next.js 14, чистый CSS. Без новых зависимостей.

---

## Файловая структура

```
app/globals.css   [MODIFY]   блок /* BANYA CONFIGURATOR */ (≈строки 1266–1474), 5 точечных замен
```

## Решения по неоднозначностям (зафиксировано)

- **PRAVKA 1 — max-width:** поднимаем `720px → 880px`. Совпадает с уже существующим брейкпоинтом `@media (max-width: 880px)`, на котором сетка карточек схлопывается в одну колонку — единая точка отсчёта. Карточки в три колонки получают ~264px ширины внутри (880 − 64 padding − 24 gap)/3.
- **PRAVKA 3б — заголовки шагов:** делаем лёгкий вариант (`font-size: 14px`, `font-weight: 600`, `opacity: .8`). Кружочки-цифры ① ② ③ НЕ добавляем — текст уже содержит «Шаг 1.», «Шаг 2.», «Шаг 3.», символ дублировал бы номер.
- **PRAVKA 3в — маркер выбранной карточки:** делаем. `::after` с `✓` в правом верхнем углу `.banya-config__program-card.is-active`. Требует `position: relative` на самой карточке. Применяется и к `.is-custom.is-active` («Собрать самому») — это консистентно, маркер уместен.
- **PRAVKA 4 — сводка:** к `padding-top: 24px` и боковым `16px` добавляем `padding-bottom: 16px` для визуального баланса фоновой плашки. Скругление НЕ делаем — острые углы в тон остальной «коробке».
- **PRAVKA 2 — активный чип hover:** отдельное правило `.banya-config__chip.is-active:hover` с `filter: brightness(.92)` и сохранением медного фона (иначе общий `.banya-config__chip:hover` затемнил бы его в серый).

## Тестирование

Тестов нет. Верификация: `npm run build` (CSS не ломает сборку), перезапуск prod, `curl /banya` + grep новых правил в инлайн-CSS бандле.

---

## Task 1 — Точечные правки CSS конфигуратора

**Files:**
- Modify: `app/globals.css` (блок `/* BANYA CONFIGURATOR */`, ≈строки 1266–1474)

### Step 1.1 — PRAVKA 1 + 3а: центрирование, max-width, акцентная полоска шагов

- [ ] В `app/globals.css` замени:

```css
.banya-config {
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, .03);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 720px;
}
.banya-config__step-label {
```

на:

```css
.banya-config {
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, .03);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 880px;
  margin: 0 auto;
}
.banya-config__step {
  border-left: 3px solid var(--warm-deep);
  padding-left: 20px;
}
.banya-config__step-label {
```

### Step 1.2 — PRAVKA 3б: заголовки шагов заметнее

- [ ] Замени:

```css
.banya-config__step-label {
  font-family: var(--font-sans), sans-serif;
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .65;
  margin-bottom: 14px;
}
```

на:

```css
.banya-config__step-label {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .8;
  margin-bottom: 14px;
}
```

### Step 1.3 — PRAVKA 3в: маркер «✓» на выбранной карточке программы

- [ ] Замени:

```css
.banya-config__program-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px;
  border: 1px solid var(--warm-text);
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: background .15s, border-color .15s, color .15s;
}
.banya-config__program-card:hover { background: rgba(0, 0, 0, .05); }
```

на:

```css
.banya-config__program-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px;
  border: 1px solid var(--warm-text);
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: background .15s, border-color .15s, color .15s;
}
.banya-config__program-card:hover { background: rgba(0, 0, 0, .05); }
.banya-config__program-card.is-active::after {
  content: "✓";
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 13px;
  line-height: 1;
}
```

### Step 1.4 — PRAVKA 2: контрастные активные допники

- [ ] Замени:

```css
.banya-config__chip:hover { background: rgba(0, 0, 0, .06); }
.banya-config__chip.is-active {
  background: currentColor;
  color: var(--warm-bg);
}
```

на:

```css
.banya-config__chip:hover { background: rgba(0, 0, 0, .06); }
.banya-config__chip.is-active {
  background: var(--warm-deep);
  color: #fff;
  border-color: var(--warm-deep);
}
.banya-config__chip.is-active:hover {
  background: var(--warm-deep);
  filter: brightness(.92);
}
```

### Step 1.5 — PRAVKA 4: выделить блок сводки

- [ ] Замени:

```css
.banya-config__summary {
  border-top: 1px solid currentColor;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

на:

```css
.banya-config__summary {
  border-top: 1px solid currentColor;
  padding: 24px 16px 16px;
  background: rgba(184, 138, 74, .08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

### Step 1.6 — Build verify

- [ ] ```bash
npx tsc --noEmit && npm run build 2>&1 | tail -8
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` static.

### Step 1.7 — Прогон вживую

- [ ] Останови старый prod-сервер (`fuser -k 3000/tcp; pkill -f next-server`), запусти заново `npm run start` в фоне, дождись `Ready in`.
- [ ] Curl-проверка инлайн-CSS бандла:

```bash
curl -s http://localhost:3000/banya -o /tmp/banya.html -w "HTTP %{http_code}\n"
CSS=$(grep -oE '/_next/static/css/[^"]+\.css' /tmp/banya.html | head -1)
curl -s "http://localhost:3000$CSS" -o /tmp/banya.css
echo '--- центрирование (margin:0 auto на .banya-config):'
grep -c 'banya-config{[^}]*margin:0 auto' /tmp/banya.css
echo '--- max-width 880px:'
grep -c 'banya-config{[^}]*max-width:880px' /tmp/banya.css
echo '--- полоска шага (border-left ... var(--warm-deep)):'
grep -c 'banya-config__step{[^}]*border-left:3px solid var(--warm-deep)' /tmp/banya.css
echo '--- активный чип медный:'
grep -c 'banya-config__chip.is-active{[^}]*background:var(--warm-deep)' /tmp/banya.css
echo '--- маркер выбранной карточки:'
grep -c 'banya-config__program-card.is-active::after' /tmp/banya.css
echo '--- фон сводки:'
grep -c 'banya-config__summary{[^}]*rgba(184,138,74' /tmp/banya.css
```

**Expected:** HTTP 200; каждый `grep -c` ≥ 1 (минифицированный CSS, имена классов и значения сохраняются).

### Step 1.8 — Commit + push

- [ ] ```bash
git add app/globals.css docs/superpowers/plans/2026-05-14-banya-configurator-styling.md
git commit -m "улучши стили конфигуратора бани: центрирование, контраст активных допников, акцент шагов"
git push origin main
```

**Expected:** коммит из 2 файлов; push `... -> main`.

---

## Self-Review

**1. Spec coverage:**
- PRAVKA 1 (центрирование + max-width) → Step 1.1.
- PRAVKA 2 (контрастные активные допники + hover) → Step 1.4.
- PRAVKA 3а (полоска слева у шага, обязательно) → Step 1.1.
- PRAVKA 3б (заголовок шага заметнее, опционально) → Step 1.2 (лёгкий вариант, без кружочков-цифр — обосновано выше).
- PRAVKA 3в (маркер на активной карточке, опционально) → Step 1.3 (делаем).
- PRAVKA 4 (выделить сводку) → Step 1.5.
- ПРОВЕРКА → Steps 1.6–1.7.
- КОММИТ с точным сообщением → Step 1.8.

**2. Placeholder scan:** нет «TBD/TODO». Все 5 замен — полные old/new CSS-блоки, дословно совпадающие с текущим файлом.

**3. Type consistency:**
- Все классы в правках уже отрисовываются `BanyaConfigurator.tsx` — `.banya-config__step` (обёртки шагов), `.banya-config__chip.is-active`, `.banya-config__program-card.is-active`, `.banya-config__summary`. Новых классов нет, JSX менять не нужно.
- Переменные `--warm-deep` (#b88a4a), `--warm-bg` (#e9ddc8), `--warm-text` (#3a2a16) определены в `:root` (строки 13–15).
- Специфичность: `.banya-config__chip.is-active:hover` (0,3,0) перекрывает `.banya-config__chip:hover` (0,2,0) независимо от порядка — серый hover не «съест» медный фон.

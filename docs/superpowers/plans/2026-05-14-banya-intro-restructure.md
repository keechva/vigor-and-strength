# Реструктуризация верха /banya — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать узкую колонку и повторы в верхней части `/banya` — слить три блока (Intro / PricingNote / BaseSteam) в один BanyaIntro с нормальной двухколоночной сеткой (китчер слева, текст справа).

**Architecture:** Удаляются компоненты `BanyaBaseSteam` и `BanyaPricingNote`, их контент перемещается в `BanyaIntro` как два дополнительных подраздела. `BanyaIntro` перестаёт использовать `.manifesto` (двухколоночный грид, рассчитанный на пару «цитата + текст» — единственный ребёнок падал в узкую 33%-колонку). Вместо него — новые классы `.banya-intro-grid` / `.banya-intro-row`: каждый подраздел — строка `1fr 2fr` (китчер слева, текст справа ≤60ch), на ≤880px схлопывается в одну колонку.

**Tech Stack:** Next.js 14, TypeScript, JSX, CSS-grid. Без новых зависимостей.

---

## Файловая структура

```
app/_components/banya/
├── BanyaBaseSteam.tsx       [DELETE]
├── BanyaPricingNote.tsx     [DELETE]
└── BanyaIntro.tsx           [MODIFY]  три подраздела в новой сетке
app/banya/page.tsx           [MODIFY]  убрать 2 импорта + 2 использования
app/globals.css              [MODIFY]  +.banya-intro-grid / .banya-intro-row
```

Заметка про `.manifesto`: после правки этот класс больше нигде не используется (BanyaBaseSteam удаляется, BanyaIntro переходит на новую сетку). Оставляем как dead CSS — по тому же принципу, что `.topnav` (убирается отдельным cleanup-PR, не в скоупе этой задачи).

## Тестирование

Тестов в проекте нет. Верификация: `npm run build` (ловит type/JSX-ошибки), перезапуск prod-сервера, `curl /banya` — HTTP 200, новая разметка присутствует, удалённые компоненты отсутствуют.

---

## Task 1 — Реструктуризация верха /banya

**Files:**
- Delete: `app/_components/banya/BanyaBaseSteam.tsx`
- Delete: `app/_components/banya/BanyaPricingNote.tsx`
- Modify: `app/_components/banya/BanyaIntro.tsx`
- Modify: `app/banya/page.tsx`
- Modify: `app/globals.css`

### Step 1.1 — Добавь CSS-сетку для intro

- [ ] В `app/globals.css` найди блок `.manifesto .body p.kicker { … }` (заканчивается на строке `}` около строки 977). Сразу ПОСЛЕ него вставь:

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

### Step 1.2 — Перепиши BanyaIntro.tsx

- [ ] Перепиши `app/_components/banya/BanyaIntro.tsx` целиком:

```tsx
export function BanyaIntro() {
  return (
    <section className="zone warm" aria-label="Описание направления">
      <div className="wrap">
        <div className="banya-intro-grid">
          <div className="banya-intro-row">
            <p className="kicker">Как мы парим</p>
            <p>
              Парение — основа любого вечера в бане. Заходы в парную, веник,
              перерывы на чай и воздух. Это ритм, на который нанизываются
              добавки: ароматерапия, поющие чаши, работа с телом после пара —
              по настроению или под цель.
            </p>
          </div>
          <div className="banya-intro-row">
            <p className="kicker">Форматы работы</p>
            <p>
              Выезжаем к вам со всем нужным. Работаем в партнёрских банях с
              прямой записью к мастеру. Своя локация в разработке — откроемся в
              [адрес — placeholder]. При большой компании или особом запросе —
              работа в четыре руки.
            </p>
          </div>
          <div className="banya-intro-row">
            <p className="kicker">Цена</p>
            <p>
              Прайса как такового нет — слишком много переменных. Соберите свой
              вечер в конфигураторе ниже, мы назовём вилку и согласуем детали в
              звонке.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Заметка: `[адрес — placeholder]` оставлен дословно — намеренный маркер места под реальный адрес.

### Step 1.3 — Удали BanyaBaseSteam и BanyaPricingNote

- [ ] Удали файлы через git:

```bash
git rm app/_components/banya/BanyaBaseSteam.tsx app/_components/banya/BanyaPricingNote.tsx
```

### Step 1.4 — Обнови page.tsx

- [ ] Перепиши `app/banya/page.tsx` целиком (убраны импорты и использования `BanyaPricingNote`, `BanyaBaseSteam`):

```tsx
import type { Metadata } from "next";
import { BanyaHero } from "../_components/banya/BanyaHero";
import { BanyaIntro } from "../_components/banya/BanyaIntro";
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

### Step 1.5 — Build verify

- [ ] Запусти:

```bash
npx tsc --noEmit && npm run build 2>&1 | tail -12
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` остаётся static. Никаких ошибок «module not found» (импорты удалённых компонентов вычищены).

### Step 1.6 — Прогон вживую

- [ ] Останови старый prod-сервер (контроллер знает task-id), запусти заново `npm run start` (фон, жди `Ready in`).
- [ ] Curl-проверка:

```bash
curl -s -o /tmp/banya.html -w "HTTP %{http_code}\n" http://localhost:3000/banya
echo '--- новая сетка присутствует:'
grep -oc 'class="banya-intro-grid"' /tmp/banya.html
grep -oc 'class="banya-intro-row"' /tmp/banya.html
echo '--- три китчера:'
grep -oE '<p class="kicker">[^<]+</p>' /tmp/banya.html
echo '--- новые тексты:'
grep -c 'основа любого вечера в бане' /tmp/banya.html
grep -c 'согласуем детали в звонке' /tmp/banya.html
echo '--- старое НЕ должно остаться (всё 0):'
grep -c 'Сердцевина любого вечера' /tmp/banya.html
grep -c 'class="manifesto"' /tmp/banya.html
```

**Expected:** HTTP 200; `banya-intro-grid` ≥1; `banya-intro-row` (одна строка с тремя совпадениями или три — `grep -oc` считает строки, не критично — главное >0); три китчера «Как мы парим», «Форматы работы», «Цена»; новые тексты ≥1; старые = 0.

### Step 1.7 — Commit + push

- [ ] Закоммить и запушить:

```bash
git add app/_components/banya/BanyaIntro.tsx app/banya/page.tsx app/globals.css
git commit -m "реструктурируй верх страницы бани: один intro вместо трёх, нормальная сетка"
git push origin main
```

(`git rm` из Step 1.3 уже застейджил удаления — они войдут в этот же коммит.)

**Expected:** коммит включает 5 изменений (M BanyaIntro.tsx, M page.tsx, M globals.css, D BanyaBaseSteam.tsx, D BanyaPricingNote.tsx); push `... -> main`.

---

## Self-Review

**1. Spec coverage (запрос → шаг):**
- «удалить BanyaBaseSteam.tsx, BanyaPricingNote.tsx» → Step 1.3.
- «убрать их импорты в page.tsx» → Step 1.4.
- «объединить в один BanyaIntro: 2 подраздела + третий про цену, тексты» → Step 1.2 (все три текста дословно из запроса).
- «решить проблему узкой колонки — нормальная сетка, новые классы с понятными именами в globals.css» → Step 1.1 (`.banya-intro-grid`, `.banya-intro-row`, двухколоночные, mobile-collapse).
- «не ломай стили остальных компонентов» → новые классы изолированы, `.manifesto` не трогается (остаётся dead CSS, как `.topnav`).
- «page.tsx порядок: Hero → bridge → Intro → Addons → Programs → Configurator → …» → Step 1.4 даёт ровно этот порядок.
- «git commit с сообщением …, git push» → Step 1.7.

**2. Placeholder scan:** `[адрес — placeholder]` — намеренный маркер по явному тексту запроса, не plan-failure. Других «TBD/TODO» нет. Все code-блоки полные.

**3. Type consistency:** правка текстовая + CSS + удаление компонентов. `BanyaIntro` экспортирует то же имя. `page.tsx` импортирует только существующие после правки компоненты. Новые CSS-классы (`banya-intro-grid`, `banya-intro-row`) консистентны между Step 1.1 (определение) и Step 1.2 (использование).

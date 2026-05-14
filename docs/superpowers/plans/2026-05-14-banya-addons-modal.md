# Переработка допников /banya — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить допник «в четыре руки», переименовать программу «Глубоко» → «Интенсив» с расширенным составом, переписать описания всех программ под сценарии, сделать карточки допников кликабельными с модальным окном (placeholder под визуал + расширенный текст).

**Architecture:** Три файла. `BanyaConfigurator.tsx` — три точечные правки (новый ключ в `ADDON_LABELS`/`ADDON_TOOLTIPS`, полная замена массива `PROGRAMS`). `BanyaAddons.tsx` — полный переписан: становится клиентским компонентом, тип `Addon` расширяется (`id`, `visualKind`, `fullText: ReactNode`), 7 допников, встроенный модальный компонент с `useState`/`useEffect` (Escape, блокировка скролла body). `globals.css` — новый блок стилей для `.banya-addon-card` + модалки.

**Tech Stack:** Next.js 14 App Router, React client component, TypeScript, чистый CSS. Без новых зависимостей.

---

## Файловая структура

```
app/_components/banya/BanyaConfigurator.tsx  [MODIFY]  +four_hands в ADDON_LABELS/TOOLTIPS, замена PROGRAMS
app/_components/banya/BanyaAddons.tsx        [REWRITE] клиентский компонент, 7 допников, модалка
app/globals.css                              [MODIFY]  +блок /* BANYA ADDONS — карточки + модалка */
```

## Решения по неоднозначностям (зафиксировано)

- **Элемент карточки допника:** остаётся `<article>`, но получает `role="button"`, `tabIndex={0}`, `onClick` и `onKeyDown` (Enter/Space) — сохраняет существующие стили `.card`, добавляет доступную кликабельность без переписывания на `<button>`. Класс — `card banya-addon-card` (база `.card` + модификатор).
- **`fullText` как `ReactNode`, не `string`:** у допника `tactile` в тексте настоящая ссылка `<a href="/relax">`. Поэтому поле `fullText` типизируется как `ReactNode`; для пяти допников это строка, для `tactile` — JSX-фрагмент со ссылкой, для остальных строки.
- **Анимация появления модалки:** через CSS `@keyframes banya-modal-in` (`opacity 0→1`) на бэкдропе — проще и надёжнее, чем управлять transition-стейтом в React при условном рендеринге.
- **Состав программы `polny_relaks` («Не торопиться»):** спецификация (ПРАВКА 2) предписывает менять состав только у `v_4_ruki`. `composition` у `polny_relaks` остаётся `["venik","scrub","aroma","sound","tea","tactile"]` — `four_hands` НЕ добавляется, хотя новое описание говорит «всё включено». Расхождение флагнуть пользователю в финальном отчёте, не менять без указания.
- **Метка placeholder-визуала:** формат `[{visualKind} — {id}]`, напр. `[видео — venik]`, `[фото — scrub]` — ровно как в спецификации (английский `id`).
- **Модалка рендерится внутри `<section>`** — без React-портала (спецификация портал не требует); бэкдроп `position: fixed; inset: 0` достаточно.

## Тестирование

Тестов нет. Верификация: `npx tsc --noEmit && npm run build`, перезапуск prod, `curl /banya` + grep разметки и CSS-бандла.

---

## Task 1 — Переработка допников и программ

**Files:**
- Modify: `app/_components/banya/BanyaConfigurator.tsx`
- Rewrite: `app/_components/banya/BanyaAddons.tsx`
- Modify: `app/globals.css`

### Step 1.1 — BanyaConfigurator: добавить `four_hands` в `ADDON_LABELS`

- [ ] В `app/_components/banya/BanyaConfigurator.tsx` замени:

```tsx
const ADDON_LABELS: Record<string, string> = {
  venik: "веник",
  scrub: "скрабирование",
  aroma: "ароматерапия",
  sound: "звукотерапия",
  tea: "чай",
  tactile: "работа с телом после пара",
};
```

на:

```tsx
const ADDON_LABELS: Record<string, string> = {
  venik: "веник",
  scrub: "скрабирование",
  aroma: "ароматерапия",
  sound: "звукотерапия",
  tea: "чай",
  tactile: "работа с телом после пара",
  four_hands: "в четыре руки",
};
```

### Step 1.2 — BanyaConfigurator: добавить `four_hands` в `ADDON_TOOLTIPS`

- [ ] Замени:

```tsx
  tactile:
    "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
};
```

на:

```tsx
  tactile:
    "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
  four_hands:
    "Два мастера работают одновременно — другой уровень глубины.",
};
```

### Step 1.3 — BanyaConfigurator: заменить массив `PROGRAMS` целиком

- [ ] Замени весь блок `const PROGRAMS: Program[] = [ ... ];` на:

```tsx
const PROGRAMS: Program[] = [
  {
    key: "klassika",
    name: "Знакомство",
    desc: "Для тех, кто впервые. Спокойное парение и чай — без лишних слоёв, чтобы понять, как вам подходит.",
    composition: ["venik", "tea"],
  },
  {
    key: "vosstanovlenie",
    name: "Восстановление",
    desc: "Когда тело устало и нужно его отпустить. После плотной недели, дальней дороги или тяжёлой тренировки.",
    composition: ["scrub", "tactile", "tea"],
  },
  {
    key: "sensornaya",
    name: "Сенсорная",
    desc: "Когда хочется не телесной нагрузки, а ощущения момента. С ароматами и звуком — без интенсивной работы с телом.",
    composition: ["aroma", "sound"],
  },
  {
    key: "intensiv",
    name: "Интенсив",
    desc: "Когда обычной бани мало. Два мастера работают одновременно — это короче по времени и глубже по эффекту.",
    composition: ["tactile", "four_hands"],
  },
  {
    key: "polny_relaks",
    name: "Не торопиться",
    desc: "Когда хочется выключиться полностью. Всё включено, без счёта времени — от двух часов и больше.",
    composition: ["venik", "scrub", "aroma", "sound", "tea", "tactile"],
  },
  {
    key: "kompaniya",
    name: "Компанией",
    desc: "Для дней рождения, мальчишников, корпоративов, сборов после походов. До пятнадцати человек, программу подстраиваем под группу.",
    composition: [],
  },
];
```

### Step 1.4 — BanyaAddons: переписать компонент целиком

- [ ] Перепиши `app/_components/banya/BanyaAddons.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Addon = {
  id: string;
  num: string;
  title: string;
  desc: string;
  visualKind: "видео" | "фото";
  fullText: ReactNode;
};

const ADDONS: Addon[] = [
  {
    id: "venik",
    num: "A · 01",
    title: "Веник",
    desc: "Берёза, дуб, эвкалипт, хвоя и др. — обсуждаем заранее или выбираем на месте.",
    visualKind: "видео",
    fullText:
      "Веник — основа русской бани. У нас есть берёза для мягкого пара, дуб для тяжёлого и интенсивного, эвкалипт для дыхательной системы, хвоя для самой жёсткой работы. Можно собрать микс под цель — например, берёза + эвкалипт для общего восстановления. Веники мы готовим сами или берём у проверенных банщиков. Обсуждаем заранее или подбираем на месте — по тому, как тело отзывается на пар.",
  },
  {
    id: "scrub",
    num: "A · 02",
    title: "Скрабирование",
    desc: "Между заходами — мягкая работа с кожей.",
    visualKind: "фото",
    fullText:
      "Между заходами в парную делаем скрабирование. Соль или кофейная масса — на прогретой коже работают совершенно иначе, чем в домашней ванной. Кожа становится мягкой, открытой, лучше воспринимает следующий заход. Это не косметическая процедура, а часть банного ритма — подготовка тела к следующему этапу.",
  },
  {
    id: "aroma",
    num: "A · 03",
    title: "Ароматерапия",
    desc: "Эфирные масла на пар. По настроению или под цель.",
    visualKind: "фото",
    fullText:
      "На раскалённые камни — несколько капель эфирных масел. Пар приобретает характер: хвоя для бодрости и дыхания, мята для холода в голове и ясности, лаванда для расслабления к концу вечера. Используем чистые масла без отдушек. Выбор аромата подстраивается под программу и настроение.",
  },
  {
    id: "sound",
    num: "A · 04",
    title: "Звукотерапия",
    desc: "Поющие чаши в моменты тишины между заходами.",
    visualKind: "видео",
    fullText:
      "Поющие чаши и гонг — в паузах между заходами. Тело уже расслаблено паром, и вибрация звука попадает в него глубже, чем в обычном состоянии. Это не музыка фоном — это отдельный этап вечера, который мы держим в тишине, без разговоров. Обычно 10–15 минут.",
  },
  {
    id: "tea",
    num: "A · 05",
    title: "Чай",
    desc: "Травяные сборы, согревающие или восстанавливающие.",
    visualKind: "фото",
    fullText:
      "Травяные сборы своего приготовления. Согревающий перед заходом — имбирь, корица, шиповник. Восстанавливающий после — мята, мелисса, ромашка. Травяной в любой момент — иван-чай, шалфей, чабрец. Чай — это пауза, в которую мы возвращаем телу баланс между заходами.",
  },
  {
    id: "tactile",
    num: "A · 06",
    title: "Работа с телом после пара",
    desc: "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
    visualKind: "видео",
    fullText: (
      <>
        Тактильное восстановление руками мастера. После пара тело отзывается на
        касание иначе: мышцы прогретые, дыхание глубокое, нервная система
        спокойна. Работа идёт по ощущениям тела — не по точкам и не по таймеру.
        Часто это и есть кульминация вечера, после которой остальное уже не
        нужно. Подробнее о подходе — в разделе{" "}
        <a href="/relax">Релаксология</a>.
      </>
    ),
  },
  {
    id: "four_hands",
    num: "A · 07",
    title: "В четыре руки",
    desc: "Два мастера одновременно — это другой уровень глубины и работы с телом.",
    visualKind: "видео",
    fullText:
      "Два мастера работают с вами одновременно. Один ведёт пар, второй параллельно делает работу с телом — или оба работают руками. Это не «быстрее», а глубже — тело получает в полтора-два раза больше внимания за то же время, и эффект другого уровня. Обычно берётся в составе программы «Интенсив», но можно добавить к любой программе.",
  },
];

export function BanyaAddons() {
  const [selected, setSelected] = useState<string | null>(null);

  const active = ADDONS.find((a) => a.id === selected) ?? null;

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

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
            <article
              key={a.id}
              className="card banya-addon-card"
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={() => setSelected(a.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(a.id);
                }
              }}
            >
              <div className="card-num">{a.num}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="banya-addon-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="banya-addon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="banya-addon-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="banya-addon-modal__close"
              aria-label="Закрыть"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <h3
              id="banya-addon-modal-title"
              className="banya-addon-modal__title"
            >
              {active.title}
            </h3>
            <div className="banya-addon-modal__visual" aria-hidden="true">
              [{active.visualKind} — {active.id}]
            </div>
            <div className="banya-addon-modal__text">{active.fullText}</div>
          </div>
        </div>
      )}
    </section>
  );
}
```

### Step 1.5 — globals.css: добавить блок стилей допников и модалки

- [ ] В `app/globals.css` найди (это конец блока конфигуратора + начало общего мобильного медиа-блока):

```css
@media (max-width: 520px) {
  .banya-config { padding: 24px 20px; }
}

@media (max-width: 520px) {
  .wrap { padding: 0 20px; }
```

- [ ] Замени на (вставляется новый блок между двумя медиа-запросами):

```css
@media (max-width: 520px) {
  .banya-config { padding: 24px 20px; }
}

/* ============ BANYA ADDONS — карточки + модалка ============ */

.banya-addon-card {
  cursor: pointer;
  transition: background .15s;
}
.banya-addon-card:hover,
.banya-addon-card:focus-visible {
  background: rgba(0, 0, 0, .07);
}

.banya-addon-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: banya-modal-in .15s ease;
}
@keyframes banya-modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.banya-addon-modal {
  background: var(--warm-bg);
  color: var(--warm-text);
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  border: 1px solid var(--warm-text);
}
.banya-addon-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}
.banya-addon-modal__close:hover {
  background: rgba(0, 0, 0, .06);
}
.banya-addon-modal__title {
  font-family: var(--font-serif), serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 500;
  line-height: 1.1;
  margin: 0 40px 0 0;
}
.banya-addon-modal__visual {
  aspect-ratio: 16 / 9;
  background: rgba(0, 0, 0, .08);
  border: 1px dashed var(--warm-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .12em;
  opacity: .7;
  margin: 24px 0;
}
.banya-addon-modal__text {
  font-family: var(--font-serif), serif;
  font-size: 18px;
  line-height: 1.55;
}
.banya-addon-modal__text a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 520px) {
  .banya-addon-modal { padding: 28px 20px; }
  .banya-addon-modal__title { margin-right: 36px; }
}

@media (max-width: 520px) {
  .wrap { padding: 0 20px; }
```

### Step 1.6 — Build verify

- [ ] ```bash
npx tsc --noEmit && npm run build 2>&1 | tail -8
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` static.

### Step 1.7 — Прогон вживую

- [ ] Останови старый prod-сервер (`fuser -k 3000/tcp; pkill -f next-server`), запусти заново `npm run start` в фоне, дождись `Ready in`.
- [ ] Curl-проверка разметки и CSS:

```bash
curl -s http://localhost:3000/banya -o /tmp/banya.html -w "HTTP %{http_code}\n"
echo '--- карточек допников banya-addon-card (7):'
grep -o 'banya-addon-card' /tmp/banya.html | wc -l
echo '--- «В четыре руки» (≥2: карточка допника + чип конфигуратора):'
grep -o 'В четыре руки\|в четыре руки' /tmp/banya.html | wc -l
echo '--- «Интенсив» есть (≥1), «Глубоко» нет (0):'
grep -c 'Интенсив' /tmp/banya.html
grep -c 'Глубоко' /tmp/banya.html
echo '--- новые сценарные описания программ:'
grep -c 'Для тех, кто впервые' /tmp/banya.html
grep -c 'Когда тело устало' /tmp/banya.html
grep -c 'мальчишников' /tmp/banya.html
echo '--- CSS: классы модалки в бандле:'
CSS=$(grep -oE '/_next/static/css/[^"]+\.css' /tmp/banya.html | sort -u | while read c; do curl -s "http://localhost:3000$c" | grep -l . >/dev/null && echo "$c"; done)
for c in $(grep -oE '/_next/static/css/[^"]+\.css' /tmp/banya.html | sort -u); do
  curl -s "http://localhost:3000$c" -o /tmp/c.css
  if grep -q 'banya-addon-modal' /tmp/c.css; then
    echo "найден в $c:"
    grep -oE '\.banya-addon-modal-backdrop\{[^}]*\}' /tmp/c.css
    grep -oE '\.banya-addon-card\{[^}]*\}' /tmp/c.css
    grep -c 'banya-modal-in' /tmp/c.css
  fi
done
```

**Expected:** HTTP 200; `banya-addon-card` = 7; «в четыре руки» ≥ 2; «Интенсив» ≥ 1; «Глубоко» = 0; каждое новое описание = 1; в CSS-бандле найдены `.banya-addon-modal-backdrop` (с `position:fixed`), `.banya-addon-card` (с `cursor:pointer`), keyframes `banya-modal-in` ≥ 1.

### Step 1.8 — Commit + push

- [ ] ```bash
git add app/_components/banya/BanyaConfigurator.tsx app/_components/banya/BanyaAddons.tsx app/globals.css docs/superpowers/plans/2026-05-14-banya-addons-modal.md
git commit -m "добавь four_hands допник, переделай Глубоко→Интенсив, попапы с визуалом, сценарные описания программ"
git push origin main
```

**Expected:** коммит из 4 файлов; push `... -> main`.

---

## Self-Review

**1. Spec coverage:**
- ПРАВКА 1 (новый допник `four_hands`: `ADDON_LABELS`, `ADDON_TOOLTIPS`, карточка в `BanyaAddons` после `tactile`, последняя) → Steps 1.1, 1.2, 1.4 (`id: four_hands`, `num: "A · 07"`, в конце массива).
- ПРАВКА 2 («Глубоко» → «Интенсив»: `key: intensiv`, `name: Интенсив`, `composition: ["tactile","four_hands"]`) → Step 1.3.
- ПРАВКА 3 (сценарные описания всех 6 программ) → Step 1.3 (все `desc` дословно из спецификации).
- ПРАВКА 4 (кликабельные карточки + модалка: заголовок, placeholder-визуал 16:9 с меткой `[тип — id]`, расширенный текст, кнопка X, закрытие по бэкдропу/Escape, блокировка скролла body, `aria-modal`/`aria-labelledby`, ссылка `<a href="/relax">` в `tactile`) → Step 1.4 (компонент + state + 2×`useEffect`), Step 1.5 (все CSS-классы из спецификации: `.banya-addon-card`, `.banya-addon-modal-backdrop`, `.banya-addon-modal`, `__close`, `__title`, `__visual`, `__text`).
- ПРОВЕРКА → Steps 1.6–1.7.
- КОММИТ с точным сообщением → Step 1.8.

**2. Placeholder scan:** нет «TBD/TODO». Все code-блоки полные: 3 точные old/new пары для `BanyaConfigurator.tsx`, полный файл `BanyaAddons.tsx`, полный вставляемый CSS-блок с якорями.

**3. Type consistency:**
- `Addon` тип (`id/num/title/desc/visualKind/fullText`) консистентен между объявлением, массивом `ADDONS` и использованием в JSX (`a.id`, `a.num`, `a.title`, `a.desc`, `a.visualKind`, `a.fullText`).
- `visualKind: "видео" | "фото"` — все 7 значений в массиве из этого юнион-типа.
- `fullText: ReactNode` — строки и JSX-фрагмент (`tactile`) оба валидны как `ReactNode`.
- `selected: string | null`, `active: Addon | null` — `setSelected(a.id)`/`setSelected(null)` согласованы.
- CSS-классы Step 1.5 покрывают все классы из JSX Step 1.4: `banya-addon-card`, `banya-addon-modal-backdrop`, `banya-addon-modal`, `banya-addon-modal__close`, `banya-addon-modal__title`, `banya-addon-modal__visual`, `banya-addon-modal__text`. Базовые `card`/`card-num`/`cards col-3` — уже существуют в `globals.css`.
- `BanyaConfigurator.tsx`: `ADDON_LABELS`/`ADDON_TOOLTIPS` рендерятся через `Object.entries` — новый ключ `four_hands` автоматически даёт 7-й чип с tooltip. `PROGRAMS` ключ `intensiv` + `composition: ["tactile","four_hands"]` — оба значения есть в `ADDON_LABELS`, `buildSummary` отрисует их корректно.
- `BanyaAddons` становится `"use client"` — импортируется в серверный `app/banya/page.tsx`, клиентский потомок серверного компонента валиден.

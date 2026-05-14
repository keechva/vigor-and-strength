# Чистка /banya от слова «массаж» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать все упоминания слова «массаж» (и оборонительных конструкций «не массаж — …») со страницы направления «Баня», переписав формулировки про `tactile` через ощущения.

**Architecture:** Две точечные правки текста. `BanyaAddons.tsx` — в карточке `tactile` заменяются поля `desc` и `fullText`. `BanyaConfigurator.tsx` — в `ADDON_TOOLTIPS` заменяется значение ключа `tactile`. Логика, типы, разметка не трогаются.

**Tech Stack:** Next.js 14, TypeScript, React. Без новых зависимостей.

---

## Файловая структура

```
app/_components/banya/BanyaAddons.tsx        [MODIFY]  карточка tactile: desc + fullText
app/_components/banya/BanyaConfigurator.tsx  [MODIFY]  ADDON_TOOLTIPS.tactile
```

## Результат Шага 1 (поиск, зафиксировано)

`grep -rin "массаж" app/_components/banya/ app/banya/` дал ровно 2 совпадения:
- `BanyaAddons.tsx:65` — `tactile.desc`: «…Не массаж — отдельное ремесло.»
- `BanyaConfigurator.tsx:22` — `ADDON_TOOLTIPS.tactile`: «…Не массаж — отдельное ремесло.»

Обе строки — именно те места, что названы в Шаге 2 задания. Других вхождений слова «массаж» нет. Шаг 3 (прочие места со словом «массаж») — пусто, дополнительных правок не порождает.

**Вне scope (флагнуть, не трогать):** `BanyaAddons.tsx:32` — `scrub.fullText` содержит конструкцию «не косметическая процедура, а часть банного ритма». Это «не Y, а Z», но без слова «массаж» и не про массаж — по Шагу 3 не подпадает.

## Тестирование

Тестов нет. Верификация: `npx tsc --noEmit && npm run build`, `grep -ri "массаж"` по banya-файлам должен быть пуст, перезапуск prod + curl-проверка нового текста.

---

## Task 1 — Убрать «массаж», переписать tactile через ощущения

**Files:**
- Modify: `app/_components/banya/BanyaAddons.tsx`
- Modify: `app/_components/banya/BanyaConfigurator.tsx`

### Step 1.1 — BanyaAddons: заменить `desc` карточки `tactile`

- [ ] В `app/_components/banya/BanyaAddons.tsx` замени:

```tsx
    desc: "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
```

на:

```tsx
    desc: "Тактильное восстановление руками мастера. Тело долго прогрето — ощущения другие.",
```

### Step 1.2 — BanyaAddons: заменить `fullText` карточки `tactile`

- [ ] В том же файле замени:

```tsx
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
```

на:

```tsx
    fullText: (
      <>
        После пара тело отзывается на касание совершенно иначе. Мышцы прогретые
        и податливые, дыхание глубокое, нервная система отпустила напряжение
        дня. Мастер работает не по точкам и не по таймеру — а по ощущениям тела,
        по тому, как оно сейчас просит. Это про возвращение себе ощущения целого
        тела — без отдельных «зон» и без задач. Многие говорят, что именно после
        этого вечер становится полным. Подробнее о подходе — в разделе{" "}
        <a href="/relax">Релаксология</a>.
      </>
    ),
```

### Step 1.3 — BanyaConfigurator: заменить `ADDON_TOOLTIPS.tactile`

- [ ] В `app/_components/banya/BanyaConfigurator.tsx` замени:

```tsx
  tactile:
    "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
```

на:

```tsx
  tactile:
    "Тактильное восстановление. После пара мышцы и кожа отзываются иначе.",
```

### Step 1.4 — Проверка: слово «массаж» исчезло

- [ ] ```bash
grep -ri "массаж" app/_components/banya/ app/banya/ ; echo "exit: $?"
```

**Expected:** вывод пуст, `exit: 1` (grep ничего не нашёл).

### Step 1.5 — Build verify

- [ ] ```bash
npx tsc --noEmit && npm run build 2>&1 | tail -8
```

**Expected:** typecheck exit 0; build `✓ Compiled successfully`; route `○ /banya` static.

### Step 1.6 — Прогон вживую

- [ ] Останови старый prod-сервер (`fuser -k 3000/tcp; pkill -f next-server`), запусти заново `npm run start` в фоне, дождись `Ready in`.
- [ ] Curl-проверка:

```bash
curl -s http://localhost:3000/banya -o /tmp/banya.html -w "HTTP %{http_code}\n"
echo '--- слова «массаж» на странице нет (0):'
grep -oic "массаж" /tmp/banya.html
echo '--- новый desc tactile (1):'
grep -c "Тело долго прогрето — ощущения другие" /tmp/banya.html
echo '--- новый fullText tactile (1):'
grep -c "возвращение себе ощущения целого тела" /tmp/banya.html
echo '--- новый tooltip tactile (1):'
grep -c "После пара мышцы и кожа отзываются иначе" /tmp/banya.html
```

**Expected:** HTTP 200; «массаж» = 0; каждая новая фраза = 1.

### Step 1.7 — Commit + push

- [ ] ```bash
git add app/_components/banya/BanyaAddons.tsx app/_components/banya/BanyaConfigurator.tsx docs/superpowers/plans/2026-05-15-banya-remove-massage.md
git commit -m "убери все упоминания массажа со страницы бани, перепиши tactile через ощущения"
git push origin main
```

**Expected:** коммит из 3 файлов; push `... -> main`.

---

## Self-Review

**1. Spec coverage:**
- ШАГ 1 (найти все упоминания) → выполнено до плана, результат зафиксирован в разделе «Результат Шага 1».
- ШАГ 2 (три известных места) → Steps 1.1 (`desc`), 1.2 (`fullText`), 1.3 (`ADDON_TOOLTIPS.tactile`). Тексты — дословно из задания.
- ШАГ 3 (прочие места со словом «массаж») → пусто, новых правок нет (зафиксировано в «Результат Шага 1»).
- ШАГ 4 (проверка) → Steps 1.4 (`grep`), 1.6 (curl).
- ШАГ 5 (коммит с точным сообщением + push) → Step 1.7.

**2. Placeholder scan:** нет «TBD/TODO». Все три замены — полные точные old/new пары, дословно совпадающие с текущим содержимым файлов.

**3. Type consistency:**
- `desc` остаётся `string`, `fullText` остаётся JSX-фрагментом (`ReactNode`) — типы карточки `Addon` не меняются.
- `ADDON_TOOLTIPS.tactile` остаётся `string` — тип `Record<string, string>` не меняется.
- Ссылка `<a href="/relax">Релаксология</a>` сохранена в новом `fullText` — стиль `.banya-addon-modal__text a` продолжает применяться.
- Ключ `tactile` нигде не переименовывается — `composition` программ (`vosstanovlenie`, `intensiv`, `polny_relaks`) и рендер чипов остаются валидны.

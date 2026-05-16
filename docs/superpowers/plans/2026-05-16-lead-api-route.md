---
name: API-route /api/lead и переключение форм на fetch
description: Архитектурный каркас бэкенда заявки — заглушка-route + утилита sendLead + интеграция в 4 формы. Реальный получатель (Telegram/email/db) — отдельный шаг issue #12.
---

# Lead API & Forms Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (batch inline).

**Goal:** Заявки с 4 форм уходят на единый `POST /api/lead`, который сейчас только валидирует и логирует. UI форм показывает success/error состояние, кнопка блокируется во время отправки.

**Architecture:**
- `app/api/lead/route.ts` — серверный handler. Принимает `LeadPayload`, валидирует `name/phone/source`, обогащает `receivedAt/ua/referrer`, логирует. Никаких внешних интеграций.
- `app/_lib/sendLead.ts` — тонкая клиентская обёртка над `fetch`. Возвращает `{ ok, error? }`.
- Каждая `*Contact.tsx` приобретает 3 локальных state (`isSubmitting / result / errorMessage`), собирает `LeadData` (общие + специфичные поля), вызывает `sendLead`, рендерит блок `.form-result`, дисейблит submit-кнопку.
- `BanyaApplyDetail` расширяется до `{ direction, message, program?, people?, addons? }` — структурные поля летят и в payload, и сохраняются в state. Конфигуратор кладёт всё, BanyaContact читает.

**Tech Stack:** Next.js 14 App Router Route Handler, `fetch`, существующая `lead-form` разметка.

**Ключевые наблюдения после разведки:**
- В `BanyaContact` уже есть слушатель `BANYA_APPLY_EVENT` (state `message`, `direction`). Для structured payload расширяем `BanyaApplyDetail` + state.
- В `RelaxContact` нет select направления — `direction` хардкодю `"relax"`.
- В `TrainingsContact` есть `<input type="hidden" name="page" value="trainings" />` — это дублирует `source` payload'а. Hidden убираю.
- Во всех формах `name="message"` — в payload идёт как `message`.
- Все 4 формы делят класс `.lead-form` и обёртку `.submit-row` — стили `.form-result` добавляю один раз в globals.css.

---

## File Structure

- Create: `app/api/lead/route.ts`
- Create: `app/_lib/sendLead.ts`
- Modify: `app/_components/banya/BanyaConfigurator.tsx` — расширить `BanyaApplyDetail` и detail в `handleApply`
- Modify: `app/_components/banya/BanyaContact.tsx` — state + sendLead + UI
- Modify: `app/_components/relax/RelaxContact.tsx` — state + sendLead + UI
- Modify: `app/_components/trainings/TrainingsContact.tsx` — state + sendLead + UI + убрать hidden `page`
- Modify: `app/_components/locations/LocationDetailContact.tsx` — state + sendLead + UI
- Modify: `app/globals.css` — `.form-result*`

---

### Task 1: API-route `/api/lead`

**Files:** Create `app/api/lead/route.ts`

- [ ] **Step 1.1** — Создать файл:

```ts
import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  name: string;
  phone: string;
  source: string;
  direction?: string;
  master?: string;
  location?: string;
  program?: string;
  people?: number;
  addons?: string[];
  interest?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: LeadPayload = await req.json();

    if (!data.name || !data.phone) {
      return NextResponse.json(
        { ok: false, error: "name и phone обязательны" },
        { status: 400 },
      );
    }

    if (!data.source) {
      return NextResponse.json(
        { ok: false, error: "source обязательно" },
        { status: 400 },
      );
    }

    const enriched = {
      ...data,
      receivedAt: new Date().toISOString(),
      ua: req.headers.get("user-agent") ?? undefined,
      referrer: req.headers.get("referer") ?? undefined,
    };

    // TODO (issue #12): отправка в Telegram-бот / email / база
    console.log("[lead]", JSON.stringify(enriched, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] error:", err);
    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
```

---

### Task 2: Клиентская утилита `sendLead`

**Files:** Create `app/_lib/sendLead.ts`

- [ ] **Step 2.1** — Создать файл:

```ts
export type LeadData = {
  name: string;
  phone: string;
  source: string;
  direction?: string;
  master?: string;
  location?: string;
  program?: string;
  people?: number;
  addons?: string[];
  interest?: string;
  message?: string;
};

export async function sendLead(
  data: LeadData,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = (await res.json()) as { ok?: boolean; error?: string };

    if (!res.ok) {
      return { ok: false, error: json.error ?? "Ошибка отправки" };
    }

    return { ok: true };
  } catch (err) {
    console.error("sendLead error:", err);
    return { ok: false, error: "Не удалось отправить заявку" };
  }
}
```

---

### Task 3: Расширить `BanyaApplyDetail` + конфигуратор

**Files:** `app/_components/banya/BanyaConfigurator.tsx:75-78,127-135`

- [ ] **Step 3.1** — Расширить тип (строки 75–78):

```ts
export type BanyaApplyDetail = {
  direction: "Баня";
  message: string;
  program?: string;
  people?: number;
  addons?: string[];
};
```

- [ ] **Step 3.2** — В `handleApply` собирать structured поля (строки 127–135):

```ts
function handleApply() {
  const detail: BanyaApplyDetail = {
    direction: "Баня",
    message: buildSummary(),
    program: program || undefined,
    people,
    addons: addons.length > 0 ? addons : undefined,
  };
  window.dispatchEvent(new CustomEvent(BANYA_APPLY_EVENT, { detail }));
  const target = document.getElementById("contact");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}
```

**Why `program || undefined`:** payload предпочитаем без пустых строк — undefined-ключ выкинется из JSON.

---

### Task 4: BanyaContact — sendLead + state + UI

**Files:** `app/_components/banya/BanyaContact.tsx` (полная перезапись compoненты)

- [ ] **Step 4.1** — Заменить файл:

```tsx
"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  BANYA_APPLY_EVENT,
  type BanyaApplyDetail,
} from "./BanyaConfigurator";
import { sendLead } from "@/app/_lib/sendLead";

export function BanyaContact() {
  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState("Баня");
  const [program, setProgram] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<number | undefined>(undefined);
  const [addons, setAddons] = useState<string[] | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    function onApply(e: Event) {
      const detail = (e as CustomEvent<BanyaApplyDetail>).detail;
      if (!detail) return;
      setMessage(detail.message);
      setDirection(detail.direction);
      setProgram(detail.program);
      setPeople(detail.people);
      setAddons(detail.addons);
    }
    window.addEventListener(BANYA_APPLY_EVENT, onApply);
    return () => window.removeEventListener(BANYA_APPLY_EVENT, onApply);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("idle");
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    const res = await sendLead({
      name,
      phone,
      source: "banya",
      direction,
      program,
      people,
      addons,
      message: message || undefined,
    });

    if (res.ok) {
      setResult("success");
      form.reset();
      setMessage("");
      setProgram(undefined);
      setPeople(undefined);
      setAddons(undefined);
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
    setIsSubmitting(false);
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

          <form ref={formRef} className="lead-form" onSubmit={onSubmit}>
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
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Отправить заявку →"}
              </button>
              <div className="terms">
                Нажимая «Отправить», вы соглашаетесь с обработкой персональных
                данных.
              </div>
            </div>

            {result === "success" && (
              <p className="form-result form-result--ok">
                Заявка принята. Перезвоним в&nbsp;ближайшее время.
              </p>
            )}
            {result === "error" && (
              <p className="form-result form-result--error">
                {errorMessage ||
                  "Что-то пошло не так. Попробуйте ещё раз или напишите в Telegram."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
```

**Decision — оставляем `direction` как русский label.** В BanyaContact пользователь выбирает направление человеческой меткой ("Баня"/"Релаксология"/"Не определился"). Эта строка летит в payload как `direction`. Бэкенд (в issue #12) сам решит, как маппить. Сейчас не нормализуем.

---

### Task 5: RelaxContact — sendLead

**Files:** `app/_components/relax/RelaxContact.tsx` (полная перезапись)

- [ ] **Step 5.1** — Заменить файл:

```tsx
"use client";

import { type FormEvent, useState } from "react";
import { MASTERS } from "@/app/_lib/data/masters";
import { sendLead } from "@/app/_lib/sendLead";

const RELAX_MASTERS = MASTERS.filter((m) => m.directions.includes("relax"));

export function RelaxContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("idle");
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const masterRaw = String(fd.get("master") ?? "");

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: "relax",
      direction: "relax",
      master: masterRaw && masterRaw !== "Не определился" ? masterRaw : undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
    });

    if (res.ok) {
      setResult("success");
      form.reset();
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
    setIsSubmitting(false);
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
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Оставить заявку →"}
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы соглашаетесь с обработкой
                персональных данных.
              </div>
            </div>

            {result === "success" && (
              <p className="form-result form-result--ok">
                Заявка принята. Перезвоним в&nbsp;ближайшее время.
              </p>
            )}
            {result === "error" && (
              <p className="form-result form-result--error">
                {errorMessage ||
                  "Что-то пошло не так. Попробуйте ещё раз или напишите в Telegram."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
```

**Decision — `master: "Не определился"` → `undefined`.** Это «нет выбора», в payload не пускаем.

---

### Task 6: TrainingsContact — sendLead

**Files:** `app/_components/trainings/TrainingsContact.tsx` (полная перезапись)

- [ ] **Step 6.1** — Заменить файл:

```tsx
"use client";

import { type FormEvent, useState } from "react";
import { sendLead } from "@/app/_lib/sendLead";

export function TrainingsContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("idle");
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const interestRaw = String(fd.get("interest") ?? "");

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: "trainings",
      direction: "trainings",
      interest: interestRaw || undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
    });

    if (res.ok) {
      setResult("success");
      form.reset();
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Лист ожидания">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>В&nbsp;лист ожидания</h2>
            <p className="helper">
              Расскажите что интересно — кунгфу индивидуально, группа, или
              ждёте медитаций и дыхания. Соберём первый набор, когда наберём
              состав.
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
              Что интересно
              <select name="interest" defaultValue="">
                <option value="">Не определился</option>
                <option value="kungfu-individual">Кунгфу индивидуально</option>
                <option value="kungfu-group">Кунгфу в группе</option>
                <option value="meditation">Медитации (когда появятся)</option>
                <option value="breathing">Дыхание (когда появится)</option>
                <option value="workshops">
                  Открытые мастерские (когда появятся)
                </option>
              </select>
            </label>

            <label className="full">
              Чего ожидаете от тренировок
              <textarea
                name="message"
                placeholder="Есть ли опыт, цели, ограничения здоровья, удобные дни и время."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Оставить заявку →"}
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы соглашаетесь с обработкой
                персональных данных.
              </div>
            </div>

            {result === "success" && (
              <p className="form-result form-result--ok">
                Заявка принята. Перезвоним в&nbsp;ближайшее время.
              </p>
            )}
            {result === "error" && (
              <p className="form-result form-result--error">
                {errorMessage ||
                  "Что-то пошло не так. Попробуйте ещё раз или напишите в Telegram."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
```

**Decision — убираем `<input type="hidden" name="page" value="trainings" />`.** Это поле дублировало `source` payload'а, в новой схеме оно лишнее.

---

### Task 7: LocationDetailContact — sendLead

**Files:** `app/_components/locations/LocationDetailContact.tsx` (полная перезапись)

- [ ] **Step 7.1** — Заменить файл:

```tsx
"use client";

import { type FormEvent, useState } from "react";
import type { Location } from "@/app/_lib/data/locations";
import { sendLead } from "@/app/_lib/sendLead";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};

export function LocationDetailContact({ location }: { location: Location }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("idle");
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const directionRaw = String(fd.get("direction") ?? "");
    const masterRaw = String(fd.get("master") ?? "");

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: `location/${location.slug}`,
      location: location.slug,
      direction:
        directionRaw && directionRaw !== "Не определился"
          ? directionRaw
          : undefined,
      master:
        masterRaw && masterRaw !== "Не определился" ? masterRaw : undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
    });

    if (res.ok) {
      setResult("success");
      form.reset();
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <section
      className="zone neutral-light"
      id="contact"
      aria-label="Связаться"
    >
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>Записаться в&nbsp;{location.name}</h2>
            <p className="helper">
              Перезвоним, согласуем время и&nbsp;формат.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <input
              type="hidden"
              name="locationSlug"
              value={location.slug}
            />

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
              Направление
              <select name="direction">
                <option>Не определился</option>
                {location.directions.map((d) => (
                  <option key={d} value={d}>
                    {DIRECTION_LABELS[d] || d}
                  </option>
                ))}
              </select>
            </label>

            {location.masters.length > 0 && (
              <label className="full">
                Мастер
                <select name="master">
                  <option>Не определился</option>
                  {location.masters.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Когда удобно, состав, особые пожелания."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Оставить заявку →"}
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы&nbsp;соглашаетесь с&nbsp;обработкой
                персональных данных.
              </div>
            </div>

            {result === "success" && (
              <p className="form-result form-result--ok">
                Заявка принята. Перезвоним в&nbsp;ближайшее время.
              </p>
            )}
            {result === "error" && (
              <p className="form-result form-result--error">
                {errorMessage ||
                  "Что-то пошло не так. Попробуйте ещё раз или напишите в Telegram."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
```

**Decision — оставляем `<input type="hidden" name="locationSlug" />` в разметке** (на случай, если кто-то парсит DOM-форму без JS — fallback). В payload же location передаём из `location.slug` явно, не из FormData.

---

### Task 8: CSS `.form-result*`

**Files:** `app/globals.css` — добавить в конец

- [ ] **Step 8.1** — Добавить:

```css
/* ============ FORM RESULT ============ */
.form-result {
  margin-top: 16px;
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  padding: 12px 16px;
  border: 1px solid currentColor;
}
.form-result--ok {
  color: #2d5a3d;
  background: rgba(45, 90, 61, .08);
}
.form-result--error {
  color: #8c3a3a;
  background: rgba(140, 58, 58, .08);
}
```

---

### Task 9: Проверки

- [ ] **Step 9.1** — `npx tsc --noEmit` — чисто.
- [ ] **Step 9.2** — `npm run dev` в фоне, дождаться готовности.
- [ ] **Step 9.3** — curl happy-path:

```bash
curl -s -X POST http://localhost:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","phone":"+79991234567","source":"banya"}'
```

Ожидается: `{"ok":true}`. В логах dev — строка `[lead]` с JSON.

- [ ] **Step 9.4** — curl без phone:

```bash
curl -s -o /tmp/out.json -w '%{http_code}\n' -X POST http://localhost:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест"}'
cat /tmp/out.json
```

Ожидается: HTTP `400`, тело `{"ok":false,"error":"name и phone обязательны"}`.

- [ ] **Step 9.5** — Проверить, что страницы рендерятся:

```bash
for p in /banya /relax /trainings /locations/zagorodnyy-klub-banya; do
  echo -n "$p "; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000$p"
done
```

(Если первой локации с таким slug нет — заменю на любой существующий.)

- [ ] **Step 9.6** — Убить dev.

---

### Task 10: Commit + push

- [ ] **Step 10.1** —

```bash
git add app/api app/_lib/sendLead.ts \
  app/_components/banya/BanyaConfigurator.tsx \
  app/_components/banya/BanyaContact.tsx \
  app/_components/relax/RelaxContact.tsx \
  app/_components/trainings/TrainingsContact.tsx \
  app/_components/locations/LocationDetailContact.tsx \
  app/globals.css \
  docs/superpowers/plans/2026-05-16-lead-api-route.md
git commit -m "создай API-route /api/lead и переключи все формы на отправку через fetch"
git push
```

---

## Self-Review

- ✅ Spec coverage: route + sendLead + 4 формы + CSS + проверки + коммит — все 6 user-задач закрыты.
- ✅ Placeholder scan: все формы с готовым JSX. Никаких TBD.
- ✅ Type consistency: `LeadData` / `LeadPayload` идентичны по полям (явно дублирую — один в client lib, один в API; общий import не делаем, чтобы не тянуть server-types в bundle).
- ✅ Decision: `BanyaApplyDetail` расширен — structured payload, без regex-парсинга summary.
- ✅ Decision: «Не определился» / пустая строка → `undefined` в payload, не пускаем мусор в БД будущего бэка.
- ⚠️ Decision: TrainingsContact теряет `<input type="hidden" name="page" />` — payload и без него содержит `source: "trainings"`.

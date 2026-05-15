# Locations Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `/locations` hub page and `/locations/[slug]` dynamic route pages with real Orenburg location data (4 locations).

**Architecture:** Static data file in `app/_lib/data/locations.ts`; hub page composed of small section components in `app/_components/locations/`; dynamic route uses Next.js 14 sync params (NOT 15 Promise pattern); `generateStaticParams` for SSG of detail pages; reuse existing `Masters` component, extending it with `filterByNames` + conditional CTA.

**Tech Stack:** Next.js 14.2.18 App Router, TypeScript, Tailwind (utility) + globals.css (custom), reuse existing `.zone`, `.bridge-*`, `.crosslinks` styles.

---

## Decisions (deviations from spec)

1. **Next.js version is 14.2.18, not 15.** `params` is a plain sync object, not a Promise. Page signatures use `{ params: { slug: string } }` and no `await`. The spec's "Next.js 15 → Promise params" guidance does not apply here.
2. **`Direction` type stays `"training"` (singular)** to match existing `app/_lib/data/masters.ts`. Spec used `"trainings"` (plural) — that's a typo, aligned to project type.
3. **`Masters` CTA conditional render** — when `ctaLabel === ""` or `null`, skip rendering the `<a className="cta">` entirely. Lets us hide the "Все мастера →" CTA on per-location masters strip.
4. **Bridges already exist** in `app/globals.css` (lines 290, 314, 318): `.bridge-warm-to-cool`, `.bridge-cool-in`, `.bridge-cool-to-warm`. No new bridge styles needed.
5. **`Location.directions` uses `"training"`** to match existing `Direction` type; on UI we render the label "Тренировки" for that value.

---

## File Structure

**Create:**
- `app/_lib/data/locations.ts` — data + utility funcs
- `app/locations/page.tsx` — hub route
- `app/locations/[slug]/page.tsx` — dynamic detail route
- `app/_components/locations/LocationsHero.tsx`
- `app/_components/locations/LocationsGrid.tsx`
- `app/_components/locations/LocationsAside.tsx`
- `app/_components/locations/LocationsCrossLinks.tsx`
- `app/_components/locations/LocationDetailHero.tsx`
- `app/_components/locations/LocationDetailInfo.tsx`
- `app/_components/locations/LocationDetailDirections.tsx`
- `app/_components/locations/LocationDetailMasters.tsx`
- `app/_components/locations/LocationDetailContact.tsx` (`"use client"`)
- `app/_components/locations/LocationDetailCrossLinks.tsx`

**Modify:**
- `app/_components/Masters.tsx` — add `filterByNames` prop + conditional CTA
- `app/_components/Header.tsx` — change `/#locations` → `/locations`
- `app/globals.css` — add `.location-card*`, `.location-detail-hero`, `.location-amenities`, `.location-directions-grid` rules

---

## Task 1: Data model

**Files:**
- Create: `app/_lib/data/locations.ts`

- [ ] **Step 1.1: Create the data file**

```ts
import type { Direction } from "./masters";

export type LocationType = "own" | "partner";
export type LocationStatus = "active" | "development";

export type Location = {
  slug: string;
  name: string;
  type: LocationType;
  status: LocationStatus;
  shortDescription: string;
  fullDescription: string;
  address: string;
  district?: string;
  capacity?: string;
  priceHint?: string;
  workingHours?: string;
  directions: Direction[];
  masters: string[];
  amenities: string[];
};

export const LOCATIONS: Location[] = [
  {
    slug: "samoletnaya-59",
    name: "Самолётная 59",
    type: "own",
    status: "development",
    address: "ул. Самолётная, 59 [уточнить — placeholder]",
    shortDescription: "Своя локация в разработке. Откроемся скоро.",
    fullDescription:
      "Готовим к открытию пространство, в котором будут жить все наши направления. Дровяная парная, комната отдыха с большим столом, отдельная зона для работы с телом и тренировочный зал. Анонсируем дату открытия, когда всё будет готово.",
    directions: ["banya", "relax", "training"],
    masters: [],
    amenities: [],
  },
  {
    slug: "lukomorie",
    name: "Усадьба Лукоморье",
    type: "partner",
    status: "active",
    address: "ул. Базовая, 23к1",
    district: "Дзержинский район",
    capacity: "до 10 человек",
    priceHint: "аренда от 1500 ₽/час",
    workingHours: "круглосуточно",
    shortDescription:
      "Двухэтажная баня на дровах с купелью и бассейном на большой огороженной территории.",
    fullDescription:
      "Партнёрская локация, в которой мы регулярно работаем. Двухэтажный дом 130 м², дровяная парная, гриль-домик, тёплый бассейн с гидромассажем и водопадом, инфракрасная сауна на втором этаже. На улице — родниковая купель (4°) и молодильный чан на огне. Огороженная территория, парковка под видеонаблюдением. Запись возможна напрямую к нашему пар-мастеру через нас.",
    directions: ["banya"],
    masters: ["Дмитрий", "Александр", "Вадим", "Никита"],
    amenities: [
      "Дровяная парная",
      "Тёплый бассейн с гидромассажем",
      "Родниковая купель",
      "Молодильный чан на огне",
      "Инфракрасная сауна",
      "Гриль-домик с мангалом",
      "Комната отдыха",
      "Караоке",
      "Чай",
    ],
  },
  {
    slug: "kitusya",
    name: "Китуся",
    type: "partner",
    status: "active",
    address: "ул. Ваана-Теряна, 38",
    capacity: "до 6 человек",
    priceHint: "аренда от 600 ₽/час",
    workingHours: "круглосуточно",
    shortDescription:
      "Камерная баня и площадка для работы с телом. Подходит для пары и небольшой компании.",
    fullDescription:
      "Партнёрское пространство для небольших групп. Парная и зона для работы с телом после пара. Бассейн, чайная, комната отдыха. Удобно для тех, кто хочет совместить баню и работу с телом за один визит, без большой компании.",
    directions: ["banya", "relax"],
    masters: ["Дмитрий", "Александр", "Мария"],
    amenities: [
      "Парная",
      "Бассейн",
      "Чайная комната",
      "Комната отдыха",
      "Зона для работы с телом",
    ],
  },
  {
    slug: "oazis-otdyha",
    name: "Оазис отдыха",
    type: "partner",
    status: "active",
    address: "ул. Полевая (имени Куйбышева), 23/1",
    capacity: "большая компания",
    priceHint: "аренда коттеджа от 30 000 ₽ / сутки, в будни скидка 10%",
    shortDescription:
      "Загородный клуб с баней на дровах. Для большой компании, дня рождения, корпоратива или сборов на сутки.",
    fullDescription:
      "Партнёрский загородный клуб с баней на дровах. Формат — аренда коттеджа на сутки, для большой компании. Здесь работаем по программе «Компанией»: парение, веник, программы под группу. Подходит для дней рождения, мальчишников, корпоративов, выпускных и сборов после походов.",
    directions: ["banya"],
    masters: ["Дмитрий", "Вадим"],
    amenities: [
      "Баня на дровах",
      "Коттедж с проживанием на сутки",
      "Большая территория",
      "Зона для компаний",
      "Мангал",
    ],
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getLocationsByDirection(dir: Direction): Location[] {
  return LOCATIONS.filter((l) => l.directions.includes(dir));
}

export function getLocationsByMaster(masterName: string): Location[] {
  return LOCATIONS.filter((l) => l.masters.includes(masterName));
}
```

- [ ] **Step 1.2: Typecheck**

Run: `npm run typecheck`
Expected: clean.

---

## Task 2: Extend Masters component

**Files:**
- Modify: `app/_components/Masters.tsx`

- [ ] **Step 2.1: Add `filterByNames` prop + conditional CTA**

Replace the file contents with:

```tsx
import { MASTERS, type Direction, type Master } from "../_lib/data/masters";

type MastersProps = {
  title?: string;
  filterDirection?: Direction | null;
  filterByNames?: string[] | null;
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
  filterByNames = null,
  ctaHref = "/masters",
  ctaLabel = "Все мастера →",
}: MastersProps = {}) {
  let list = MASTERS;
  if (filterDirection) {
    list = list.filter((m) => m.directions.includes(filterDirection));
  }
  if (filterByNames && filterByNames.length > 0) {
    list = list.filter((m) => filterByNames.includes(m.name));
  }

  const showCta = ctaLabel !== "" && ctaHref !== "";

  return (
    <section className="zone warm" id="masters" aria-label={title}>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="masters-cold-dot" aria-hidden="true" />

        <div className="masters-head">
          <div>
            <div className="meta">Команда</div>
            <h2>{title}</h2>
          </div>
          {showCta && (
            <a className="cta" href={ctaHref}>
              {ctaLabel}
            </a>
          )}
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

- [ ] **Step 2.2: Typecheck**

Run: `npm run typecheck`
Expected: clean.

---

## Task 3: Hub page sections

**Files:**
- Create: `app/_components/locations/LocationsHero.tsx`
- Create: `app/_components/locations/LocationsGrid.tsx`
- Create: `app/_components/locations/LocationsAside.tsx`
- Create: `app/_components/locations/LocationsCrossLinks.tsx`

- [ ] **Step 3.1: LocationsHero**

```tsx
export function LocationsHero() {
  return (
    <section className="hero">
      <div className="hero-sub">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Локации
          </div>
          <h1>Локации</h1>
          <p className="banya-hero-lead">
            Своя локация в&nbsp;разработке. Партнёрские бани и&nbsp;загородный клуб
            по&nbsp;Оренбургу. Также&nbsp;— выезд к&nbsp;клиенту.
          </p>
          <p className="banya-hero-lead">
            Свои локации&nbsp;— те, за&nbsp;которые отвечаем полностью. Партнёрские&nbsp;—
            проверенные места, где работают наши мастера.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.2: LocationsGrid**

```tsx
import Link from "next/link";
import { LOCATIONS, type Location } from "@/app/_lib/data/locations";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  training: "Тренировки",
};

function LocationCard({ location }: { location: Location }) {
  const typeLabel = location.type === "own" ? "своя" : "партнёрская";
  const typeClass = location.type === "own" ? "is-own" : "is-partner";
  const isDev = location.status === "development";

  return (
    <article className="location-card">
      <div className="location-card__badges">
        <span className={`location-card__badge ${typeClass}`}>{typeLabel}</span>
        {isDev && (
          <span className="location-card__badge is-development">
            в разработке
          </span>
        )}
      </div>

      <h3 className="location-card__title">
        <Link href={`/locations/${location.slug}`}>{location.name}</Link>
      </h3>

      <div className="location-card__address">
        {location.address}
        {location.district ? ` · ${location.district}` : ""}
      </div>

      <p className="location-card__desc">{location.shortDescription}</p>

      {(location.capacity || location.priceHint) && (
        <div className="location-card__meta">
          {[location.capacity, location.priceHint].filter(Boolean).join(" · ")}
        </div>
      )}

      <div className="location-card__tags">
        {location.directions
          .map((d) => DIRECTION_LABELS[d] || d)
          .join(" · ")}
      </div>

      <Link
        href={`/locations/${location.slug}`}
        className="location-card__cta"
      >
        Подробнее&nbsp;→
      </Link>
    </article>
  );
}

export function LocationsGrid() {
  return (
    <section className="zone cool" aria-label="География">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          География
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
          Где мы работаем
        </h2>
        <div className="locations-grid">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.slug} location={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.3: LocationsAside**

```tsx
export function LocationsAside() {
  return (
    <section className="zone warm" aria-label="Особый формат">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Особый формат
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 24px",
            letterSpacing: "-.01em",
          }}
        >
          Выезд к&nbsp;клиенту
        </h2>
        <p style={{ maxWidth: 720, marginBottom: 16 }}>
          Не&nbsp;все встречи требуют адреса. Выезд&nbsp;— отдельный формат,
          работает везде по&nbsp;Оренбургу и&nbsp;области.
        </p>
        <p style={{ maxWidth: 720, marginBottom: 32 }}>
          Привозим всё нужное&nbsp;— пар-мастер с&nbsp;веничным набором,
          релаксолог со&nbsp;столом и&nbsp;маслами. Подбираем формат под место
          и&nbsp;компанию.
        </p>
        <a className="cta" href="/banya#contact">
          Записаться на&nbsp;выезд&nbsp;→
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.4: LocationsCrossLinks**

```tsx
export function LocationsCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/banya">
            <span className="cl-eyebrow">Направление</span>
            <h3 className="cl-title">Баня</h3>
            <span className="cl-arrow">Все программы и&nbsp;форматы&nbsp;→</span>
          </a>
          <a className="crosslink" href="/relax">
            <span className="cl-eyebrow">Направление</span>
            <h3 className="cl-title">Релаксология</h3>
            <span className="cl-arrow">Мастера и&nbsp;подход&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 4: Hub page route

**Files:**
- Create: `app/locations/page.tsx`

- [ ] **Step 4.1: Write the page**

```tsx
import type { Metadata } from "next";
import { LocationsHero } from "@/app/_components/locations/LocationsHero";
import { LocationsGrid } from "@/app/_components/locations/LocationsGrid";
import { LocationsAside } from "@/app/_components/locations/LocationsAside";
import { LocationsCrossLinks } from "@/app/_components/locations/LocationsCrossLinks";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Локации — Бодрость и Сила",
  description:
    "Где мы работаем: своя локация на Самолётной 59 (в разработке), партнёрские бани и загородный клуб в Оренбурге. Также — выезд к клиенту.",
};

export default function LocationsPage() {
  return (
    <main>
      <LocationsHero />
      <div className="bridge-cool-in" aria-hidden="true" />
      <LocationsGrid />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <LocationsAside />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <LocationsCrossLinks />
      <Footer />
    </main>
  );
}
```

---

## Task 5: Detail page sections

**Files:**
- Create: `app/_components/locations/LocationDetailHero.tsx`
- Create: `app/_components/locations/LocationDetailInfo.tsx`
- Create: `app/_components/locations/LocationDetailDirections.tsx`
- Create: `app/_components/locations/LocationDetailMasters.tsx`
- Create: `app/_components/locations/LocationDetailContact.tsx`
- Create: `app/_components/locations/LocationDetailCrossLinks.tsx`

- [ ] **Step 5.1: LocationDetailHero**

```tsx
import type { Location } from "@/app/_lib/data/locations";

export function LocationDetailHero({ location }: { location: Location }) {
  const typeLabel = location.type === "own" ? "своя" : "партнёрская";
  const typeClass = location.type === "own" ? "is-own" : "is-partner";
  const isDev = location.status === "development";

  return (
    <section className="hero">
      <div className="hero-sub">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Главная</a> / <a href="/locations">Локации</a> /{" "}
            {location.name}
          </div>

          <div className="location-card__badges" style={{ marginBottom: 16 }}>
            <span className={`location-card__badge ${typeClass}`}>
              {typeLabel}
            </span>
            {isDev && (
              <span className="location-card__badge is-development">
                в разработке
              </span>
            )}
          </div>

          <h1>{location.name}</h1>

          <div className="location-detail-hero__address">
            {location.address}
            {location.district ? ` · ${location.district}` : ""}
          </div>

          <div className="location-detail-hero__meta">
            {location.capacity && <div>Вместимость: {location.capacity}</div>}
            {location.priceHint && <div>Цена: {location.priceHint}</div>}
            {location.workingHours && (
              <div>Время работы: {location.workingHours}</div>
            )}
          </div>

          <p className="banya-hero-lead">{location.shortDescription}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5.2: LocationDetailInfo**

```tsx
import type { Location } from "@/app/_lib/data/locations";

export function LocationDetailInfo({ location }: { location: Location }) {
  return (
    <section className="zone cool" aria-label="Описание">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Описание
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1,
            fontWeight: 500,
            margin: "0 0 24px",
            letterSpacing: "-.01em",
          }}
        >
          Что внутри
        </h2>
        <p style={{ maxWidth: 760, marginBottom: 32, lineHeight: 1.6 }}>
          {location.fullDescription}
        </p>

        {location.amenities.length > 0 && (
          <>
            <h3 style={{ margin: "32px 0 16px", fontSize: 22, fontWeight: 600 }}>
              Что есть на&nbsp;месте
            </h3>
            <ul className="location-amenities">
              {location.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5.3: LocationDetailDirections**

```tsx
import type { Location } from "@/app/_lib/data/locations";

const DIRECTION_CARDS: Record<
  string,
  { title: string; arrow: string; href: string }
> = {
  banya: {
    title: "Баня",
    arrow: "Все программы и форматы →",
    href: "/banya",
  },
  relax: {
    title: "Релаксология",
    arrow: "Мастера и подход →",
    href: "/relax",
  },
  training: {
    title: "Тренировки",
    arrow: "В разработке, лист ожидания →",
    href: "/training",
  },
};

export function LocationDetailDirections({
  location,
}: {
  location: Location;
}) {
  return (
    <section className="zone warm" aria-label="Направления">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Направления
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1,
            fontWeight: 500,
            margin: "0 0 32px",
            letterSpacing: "-.01em",
          }}
        >
          Какие направления здесь работают
        </h2>
        <div className="crosslinks">
          {location.directions.map((d) => {
            const card = DIRECTION_CARDS[d];
            if (!card) return null;
            return (
              <a key={d} className="crosslink" href={card.href}>
                <span className="cl-eyebrow">Направление</span>
                <h3 className="cl-title">{card.title}</h3>
                <span className="cl-arrow">{card.arrow}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5.4: LocationDetailMasters**

```tsx
import type { Location } from "@/app/_lib/data/locations";
import { Masters } from "@/app/_components/Masters";

export function LocationDetailMasters({ location }: { location: Location }) {
  if (location.masters.length === 0) {
    return (
      <section className="zone warm" aria-label="Команда">
        <div className="wrap">
          <div className="meta" style={{ marginBottom: 16 }}>
            Команда
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(32px, 5vw, 64px)",
              lineHeight: 1,
              fontWeight: 500,
              margin: "0 0 16px",
              letterSpacing: "-.01em",
            }}
          >
            Кто здесь работает
          </h2>
          <p style={{ opacity: 0.7, maxWidth: 560 }}>
            Список мастеров появится при&nbsp;открытии локации.
          </p>
        </div>
      </section>
    );
  }

  return (
    <Masters
      title="Кто здесь работает"
      filterByNames={location.masters}
      ctaLabel=""
      ctaHref=""
    />
  );
}
```

- [ ] **Step 5.5: LocationDetailContact**

```tsx
"use client";

import { type FormEvent } from "react";
import type { Location } from "@/app/_lib/data/locations";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  training: "Тренировки",
};

export function LocationDetailContact({ location }: { location: Location }) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Заявка /locations:", data);
    alert("Заявка отправлена (демо)");
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
              <button className="cta" type="submit">
                Оставить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы&nbsp;соглашаетесь с&nbsp;обработкой
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

- [ ] **Step 5.6: LocationDetailCrossLinks**

```tsx
export function LocationDetailCrossLinks() {
  return (
    <section className="zone warm" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/locations">
            <span className="cl-eyebrow">Назад</span>
            <h3 className="cl-title">Все локации</h3>
            <span className="cl-arrow">Карта мест&nbsp;→</span>
          </a>
          <a className="crosslink" href="/">
            <span className="cl-eyebrow">На&nbsp;главную</span>
            <h3 className="cl-title">Бодрость и&nbsp;Сила</h3>
            <span className="cl-arrow">Обо всём проекте&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 6: Detail dynamic route

**Files:**
- Create: `app/locations/[slug]/page.tsx`

- [ ] **Step 6.1: Write the route file**

NOTE: Next.js 14 — `params` is sync. No `Promise<...>`, no `await`.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS, getLocationBySlug } from "@/app/_lib/data/locations";
import { LocationDetailHero } from "@/app/_components/locations/LocationDetailHero";
import { LocationDetailInfo } from "@/app/_components/locations/LocationDetailInfo";
import { LocationDetailDirections } from "@/app/_components/locations/LocationDetailDirections";
import { LocationDetailMasters } from "@/app/_components/locations/LocationDetailMasters";
import { LocationDetailContact } from "@/app/_components/locations/LocationDetailContact";
import { LocationDetailCrossLinks } from "@/app/_components/locations/LocationDetailCrossLinks";
import { Footer } from "@/app/_components/Footer";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const location = getLocationBySlug(params.slug);
  if (!location) return { title: "Локация не найдена" };
  return {
    title: `${location.name} — Локация — Бодрость и Сила`,
    description: location.shortDescription,
  };
}

export default function LocationPage({ params }: Props) {
  const location = getLocationBySlug(params.slug);
  if (!location) notFound();

  return (
    <main>
      <LocationDetailHero location={location} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <LocationDetailInfo location={location} />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <LocationDetailDirections location={location} />
      <LocationDetailMasters location={location} />
      <LocationDetailContact location={location} />
      <LocationDetailCrossLinks />
      <Footer />
    </main>
  );
}
```

---

## Task 7: Header navigation

**Files:**
- Modify: `app/_components/Header.tsx`

- [ ] **Step 7.1: Change `/#locations` → `/locations`**

In the `LINKS` array, replace:

```ts
  { href: "/#locations", label: "Локации" },
```

with:

```ts
  { href: "/locations", label: "Локации" },
```

---

## Task 8: CSS for location cards

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 8.1: Append the LOCATIONS block at end of file**

```css
/* ==== LOCATIONS ==== */

.locations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-top: 8px;
}
@media (max-width: 760px) {
  .locations-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.location-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border-radius: 18px;
  background: var(--paper-cool, #eef0f3);
  border: 1px solid var(--line-cool, #c8cdd3);
  color: var(--cool-text);
}

.location-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.02em;
  font-weight: 500;
  line-height: 1.4;
}
.location-card__badge.is-own {
  background: var(--cool-deep);
  color: var(--neutral-fg, #f3eee5);
}
.location-card__badge.is-partner {
  background: transparent;
  color: var(--cool-text);
  border: 1px solid var(--cool-text);
}
.location-card__badge.is-development {
  background: rgba(61, 74, 94, 0.12);
  color: var(--cool-text);
  border: 1px dashed var(--cool-text);
  opacity: 0.85;
}

.location-card__title {
  font-family: var(--font-serif), serif;
  font-size: 28px;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 4px 0 0;
}
.location-card__title a {
  color: inherit;
  text-decoration: none;
}
.location-card__title a:hover {
  text-decoration: underline;
}

.location-card__address {
  font-size: 13px;
  opacity: 0.75;
}

.location-card__desc {
  font-size: 15px;
  line-height: 1.55;
  margin: 4px 0;
}

.location-card__meta {
  font-size: 13px;
  opacity: 0.85;
}

.location-card__tags {
  font-size: 13px;
  opacity: 0.85;
  letter-spacing: 0.01em;
}

.location-card__cta {
  align-self: flex-start;
  margin-top: 8px;
  font-size: 14px;
  color: var(--cool-deep);
  text-decoration: none;
  border-bottom: 1px solid var(--cool-deep);
  padding-bottom: 2px;
}
.location-card__cta:hover {
  opacity: 0.7;
}

/* Detail page hero meta */
.location-detail-hero__address {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.8;
}
.location-detail-hero__meta {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  opacity: 0.85;
}

/* Detail page amenities list */
.location-amenities {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
  max-width: 760px;
}
@media (max-width: 560px) {
  .location-amenities {
    grid-template-columns: 1fr;
  }
}
.location-amenities li {
  position: relative;
  padding-left: 18px;
  font-size: 15px;
}
.location-amenities li::before {
  content: "·";
  position: absolute;
  left: 4px;
  top: -2px;
  font-size: 22px;
  font-weight: 700;
  color: var(--cool-deep);
}
```

- [ ] **Step 8.2: Typecheck and build**

Run:
```bash
npm run typecheck && npm run build
```
Expected: clean typecheck; build succeeds; new routes appear in output:
- `○ /locations`
- `● /locations/[slug]` with 4 static params (samoletnaya-59, lukomorie, kitusya, oazis-otdyha)

---

## Task 9: Verify in browser

**Files:** (no edits)

- [ ] **Step 9.1: Restart prod server**

```bash
fuser -k 3000/tcp 2>/dev/null; pkill -f next-server 2>/dev/null; sleep 1
nohup npm run start > /tmp/next-prod.log 2>&1 &
sleep 4
```

- [ ] **Step 9.2: Curl-verify hub**

```bash
curl -s http://localhost:3000/locations | grep -c "Самолётная 59"   # expect ≥1
curl -s http://localhost:3000/locations | grep -c "Лукоморье"         # expect ≥1
curl -s http://localhost:3000/locations | grep -c "Китуся"            # expect ≥1
curl -s http://localhost:3000/locations | grep -c "Оазис отдыха"      # expect ≥1
curl -s http://localhost:3000/locations | grep -c "Выезд"             # expect ≥1
```

- [ ] **Step 9.3: Curl-verify detail (Лукоморье)**

```bash
curl -s http://localhost:3000/locations/lukomorie | grep -c "Дзержинский район"   # expect ≥1
curl -s http://localhost:3000/locations/lukomorie | grep -c "Родниковая купель"   # expect ≥1
curl -s http://localhost:3000/locations/lukomorie | grep -c "Никита"              # expect ≥1
```

- [ ] **Step 9.4: Curl-verify detail (Самолётная 59 — empty masters branch)**

```bash
curl -s http://localhost:3000/locations/samoletnaya-59 | grep -c "Список мастеров появится"   # expect ≥1
curl -s http://localhost:3000/locations/samoletnaya-59 | grep -c "в разработке"               # expect ≥1
```

- [ ] **Step 9.5: 404 path**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/locations/несуществующий
# expect 404
```

- [ ] **Step 9.6: Header**

```bash
curl -s http://localhost:3000/ | grep -o 'href="/locations"' | head -1   # expect a match
```

---

## Task 10: Commit + push

- [ ] **Step 10.1: Stage & commit**

```bash
git add app/_lib/data/locations.ts \
  app/locations \
  app/_components/locations \
  app/_components/Masters.tsx \
  app/_components/Header.tsx \
  app/globals.css \
  docs/superpowers/plans/2026-05-15-locations-pages.md

git commit -m "создай страницы /locations и /locations/[slug] с реальными данными локаций Оренбурга"
git push
```

---

## Self-review notes

- Spec coverage: all 10 tasks from spec mapped to plan tasks 1–10.
- Placeholder scan: no TBD/TODO/«similar to» in steps; every step has code or exact commands.
- Type consistency: `Direction` consistently `"banya" | "relax" | "training"` across data/components; `Masters` props (`filterByNames`, `ctaLabel`/`ctaHref` for hide) used identically in `LocationDetailMasters`.
- Deviations from spec are explicitly documented in the Decisions block.

---
name: /masters/[slug] master detail pages
description: Динамический маршрут страницы мастера — расширенная модель данных, hero+портрет, био, направления, форматы, галерея с lightbox, форма.
---

# /masters/[slug] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (batch inline).

**Goal:** Запустить динамический маршрут `/masters/[slug]` — визитные карточки мастеров для QR-входа и углубления с хаба `/masters`. 6 мастеров (Дмитрий + 5 placeholder'ов) с structured данными.

**Architecture:**
- Динамический маршрут по образцу `app/locations/[slug]/page.tsx` (sync params — Next 14 стиль, в спеке user'а был async/await Next 15 стиль; ради консистентности с существующим маршрутом использую sync).
- Все компоненты в `app/_components/masters/` (отдельно от `masters-hub/`).
- Сервер-компоненты везде, кроме `MasterDetailGallery` (lightbox со state) и `MasterDetailContact` (форма).
- Lightbox — внутри Gallery компонента, useState + Escape/click-backdrop. Никаких внешних зависимостей.

**Tech Stack:** Next.js 14 App Router, sync params, `notFound()` для 404, `generateStaticParams` для SSG, существующие `.zone.warm/.cool/.neutral-light/.hero/.crosslinks`, новый набор `.master-detail-*`.

**Ключевые наблюдения после разведки:**
1. `MASTERS` сейчас 4 человека, без поля `slug`. **Добавляем Никиту и Марию + slug всем.** Никита уже упомянут в `lukomorie.masters`, Мария — в `kitusya.masters`. data/locations.ts эти имена ждёт.
2. Slug'и: `dmitry`, `aleksandr`, `vadim`, `nikita`, `anna`, `mariya` (транслит).
3. На главной (`app/page.tsx:21`) `<Masters />` без props → покажет всех. Чтобы Никита не появлялся — передам `<Masters filterByNames={["Дмитрий","Александр","Вадим","Анна","Мария"]} />`. Минимальная правка, без правок Masters.tsx.
4. В `MasterCard` (`Masters.tsx`) делаем имя ссылкой `/masters/${master.slug}`.
5. `LocationDetailMasters` фильтрует мастеров по location.masters[] (имена) — никак не задеваем.

---

## File Structure

**Modify:**
- `app/_lib/data/masters.ts` — расширить тип Master + добавить Никиту/Марию + новые поля для всех 6
- `app/_components/Masters.tsx` — обернуть имя в `<a href={'/masters/${slug}'}>`
- `app/page.tsx` — `<Masters filterByNames={[…5 имён]} />`
- `app/globals.css` — добавить `.master-detail-*` стили

**Create:**
- `app/masters/[slug]/page.tsx`
- `app/_components/masters/MasterDetailHero.tsx`
- `app/_components/masters/MasterDetailBio.tsx`
- `app/_components/masters/MasterDetailDirections.tsx`
- `app/_components/masters/MasterDetailFormats.tsx`
- `app/_components/masters/MasterDetailGallery.tsx` (client)
- `app/_components/masters/MasterDetailContact.tsx` (client)
- `app/_components/masters/MasterDetailCrossLinks.tsx`

---

### Task 1: Расширить тип Master и MASTERS

**Files:** `app/_lib/data/masters.ts` (полная перезапись)

- [ ] **Step 1.1** — Заменить файл:

```ts
export type Direction = "banya" | "relax" | "trainings";

export type DirectionDetail = {
  description: string;
  specializations: string[];
};

export type MasterGalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
};

export type Master = {
  slug: string;
  name: string;
  role: string;
  directions: Direction[];
  tagsDisplay: string;
  bio: string;
  tagline: string;
  bioFull: string;
  directionDetails: {
    banya?: DirectionDetail;
    relax?: DirectionDetail;
    trainings?: DirectionDetail;
  };
  formatsDetails: {
    travel?: boolean;
    travelNote?: string;
    ownLocation?: string;
    partnerLocations?: string[];
  };
  gallery?: MasterGalleryItem[];
};

const PLACEHOLDER_DIRECTION: DirectionDetail = {
  description:
    "[Placeholder — описание подхода мастера в этом направлении, 2-3 предложения. Заменим после интервью.]",
  specializations: [
    "[Специализация — placeholder]",
    "[Специализация — placeholder]",
    "[Специализация — placeholder]",
  ],
};

const PLACEHOLDER_BIO_FULL =
  "[Placeholder — полное описание мастера от первого лица, 5-10 предложений. Расскажет о пути в практике, о подходе, о том как пришёл к каждому из направлений в которых работает. Текст заменим после интервью с мастером. Сохраняем ровно тот же объём, чтобы вёрстка ложилась одинаково для всех. Спокойная интонация, без обещаний, без маркетинговых формулировок. Тон проекта.]";

const PLACEHOLDER_TAGLINE =
  "[Placeholder — короткая визитка из 1-2 предложений в тоне проекта.]";

const PLACEHOLDER_TRAVEL_NOTE =
  "[Placeholder — особенности выезда: район, набор оборудования, ограничения.]";

export const MASTERS: Master[] = [
  {
    slug: "dmitry",
    name: "Дмитрий",
    role: "Ведущий мастер",
    directions: ["banya", "relax", "trainings"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · 2–3 фразы о Дмитрии: что ведёт, как работает, какая интонация.]",
    tagline:
      "Веду все три направления. Парю в банях по Оренбургу, делаю работу с телом после пара, преподаю кунгфу. Основа практики в проекте.",
    bioFull:
      "Дмитрий — основатель проекта «Бодрость и Сила» и ведущий мастер по всем трём направлениям. Работает с телом и движением уже не первый десяток лет. Сначала пришёл в баню — учился у разных пар-мастеров, постепенно сформировал свой подход к парению. Параллельно работал с телом руками — то что сейчас называем релаксологией. К кунгфу пришёл позже, как к практике, объединяющей всё остальное: тело, дыхание, внимание. Сейчас обучает остальных мастеров команды, ведёт первый набор группы кунгфу, продолжает работать в бане и с телом. [плейсхолдер — заменим на реальную историю]",
    directionDetails: {
      banya: {
        description:
          "Парю медленно, по ощущениям. У каждого гостя своя глубина — нет смысла гнать. Работаю с тем что в теле сейчас, не по протоколу.",
        specializations: [
          "Полное парение",
          "Работа в четыре руки",
          "Программа «Не торопиться»",
          "Работа с группами до 15 человек",
        ],
      },
      relax: {
        description:
          "Работа с телом после пара — то, что у меня получается лучше всего. Тактильно, медленно, в тишине. От часа и больше.",
        specializations: [
          "Работа после пара",
          "Тактильное восстановление",
          "Сеанс от часа до двух",
          "Без таймера",
        ],
      },
      trainings: {
        description:
          "Кунгфу для меня — основа всей практики. Преподаю медленно, от стоек и дыхания. Первый набор группы — скоро.",
        specializations: [
          "Кунгфу индивидуально",
          "Группа (готовится)",
          "Базовые формы",
          "Работа со стойками и дыханием",
        ],
      },
    },
    formatsDetails: {
      travel: true,
      travelNote:
        "Выезжаю по Оренбургу и области со своим — веничный набор, масла, валики.",
      ownLocation: "samoletnaya-59",
      partnerLocations: ["lukomorie", "kitusya", "oazis-otdyha"],
    },
    gallery: [
      {
        type: "video",
        src: "/placeholder/dima-banya.mp4",
        alt: "Дмитрий в парной",
        caption: "В работе с веником",
      },
      {
        type: "image",
        src: "/placeholder/dima-relax.jpg",
        alt: "Дмитрий — работа с телом",
        caption: "Работа с телом после пара",
      },
      {
        type: "image",
        src: "/placeholder/dima-kungfu.jpg",
        alt: "Дмитрий на тренировке",
        caption: "Кунгфу",
      },
    ],
  },
  {
    slug: "aleksandr",
    name: "Александр",
    role: "Мастер",
    directions: ["banya", "relax"],
    tagsDisplay: "Баня · Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie", "kitusya"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/aleksandr-1.jpg",
        alt: "[Placeholder — фото Александра]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/aleksandr-2.jpg",
        alt: "[Placeholder — фото Александра]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/aleksandr-3.mp4",
        alt: "[Placeholder — видео Александра]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "vadim",
    name: "Вадим",
    role: "Мастер",
    directions: ["banya", "relax", "trainings"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
      trainings: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie", "oazis-otdyha"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/vadim-1.jpg",
        alt: "[Placeholder — фото Вадима]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/vadim-2.mp4",
        alt: "[Placeholder — видео Вадима]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/vadim-3.jpg",
        alt: "[Placeholder — фото Вадима]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "nikita",
    name: "Никита",
    role: "Мастер",
    directions: ["banya"],
    tagsDisplay: "Баня",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/nikita-1.jpg",
        alt: "[Placeholder — фото Никиты]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/nikita-2.mp4",
        alt: "[Placeholder — видео Никиты]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/nikita-3.jpg",
        alt: "[Placeholder — фото Никиты]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "anna",
    name: "Анна",
    role: "Мастер",
    directions: ["relax"],
    tagsDisplay: "Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/anna-1.jpg",
        alt: "[Placeholder — фото Анны]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/anna-2.jpg",
        alt: "[Placeholder — фото Анны]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "mariya",
    name: "Мария",
    role: "Мастер",
    directions: ["relax"],
    tagsDisplay: "Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["kitusya"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/mariya-1.jpg",
        alt: "[Placeholder — фото Марии]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/mariya-2.mp4",
        alt: "[Placeholder — видео Марии]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
];

export function getMasterBySlug(slug: string): Master | undefined {
  return MASTERS.find((m) => m.slug === slug);
}
```

**Decisions:**
- Дмитрий получает `role: "Ведущий мастер"` (был просто «Мастер») — это согласуется с описанием в плане.
- Анна — без `partnerLocations` (она relax-only и нигде не упомянута в `LOCATIONS.masters[]`).
- Все 6 мастеров имеют `travel: true` и `travelNote` — баланс «выезд по умолчанию».

---

### Task 2: Динамический маршрут `app/masters/[slug]/page.tsx`

**Files:** Create `app/masters/[slug]/page.tsx`

- [ ] **Step 2.1** — Создать файл (sync-style как `/locations/[slug]/page.tsx`):

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MASTERS, getMasterBySlug } from "@/app/_lib/data/masters";
import { MasterDetailHero } from "@/app/_components/masters/MasterDetailHero";
import { MasterDetailBio } from "@/app/_components/masters/MasterDetailBio";
import { MasterDetailDirections } from "@/app/_components/masters/MasterDetailDirections";
import { MasterDetailFormats } from "@/app/_components/masters/MasterDetailFormats";
import { MasterDetailGallery } from "@/app/_components/masters/MasterDetailGallery";
import { MasterDetailContact } from "@/app/_components/masters/MasterDetailContact";
import { MasterDetailCrossLinks } from "@/app/_components/masters/MasterDetailCrossLinks";
import { Footer } from "@/app/_components/Footer";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return MASTERS.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const master = getMasterBySlug(params.slug);
  if (!master) return { title: "Мастер не найден" };
  return {
    title: `${master.name} — ${master.role} — Бодрость и Сила`,
    description: master.tagline,
  };
}

export default function MasterPage({ params }: Props) {
  const master = getMasterBySlug(params.slug);
  if (!master) notFound();

  return (
    <main>
      <MasterDetailHero master={master} />
      <div className="bridge-warm-in" aria-hidden="true" />
      <MasterDetailBio master={master} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <MasterDetailDirections master={master} />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <MasterDetailFormats master={master} />
      {master.gallery && master.gallery.length > 0 && (
        <>
          <div className="bridge-warm-to-cool" aria-hidden="true" />
          <MasterDetailGallery master={master} />
        </>
      )}
      <MasterDetailContact master={master} />
      <MasterDetailCrossLinks />
      <Footer />
    </main>
  );
}
```

---

### Task 3: MasterDetailHero (server)

**Files:** Create `app/_components/masters/MasterDetailHero.tsx`

- [ ] **Step 3.1**:

```tsx
import type { Master } from "@/app/_lib/data/masters";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Кунгфу",
};

export function MasterDetailHero({ master }: { master: Master }) {
  return (
    <section className="hero">
      <div className="hero-sub">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Главная</a> / <a href="/masters">Мастера</a> /{" "}
            {master.name}
          </div>

          <div className="master-detail-hero">
            <div className="master-detail-hero__visual" aria-hidden="true">
              <div className="master-detail-hero__portrait">
                [фото — {master.name}]
              </div>
            </div>

            <div className="master-detail-hero__body">
              <h1>{master.name}</h1>
              <div className="master-detail-hero__role">{master.role}</div>
              <div className="master-detail-hero__tags">
                {master.directions
                  .map((d) => DIRECTION_LABELS[d] ?? d)
                  .join(" · ")}
              </div>
              <p className="master-detail-hero__tagline">{master.tagline}</p>
              <a href="#contact" className="master-detail-hero__cta cta">
                Записаться к&nbsp;{master.name}&nbsp;→
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 4: MasterDetailBio (server)

**Files:** Create `app/_components/masters/MasterDetailBio.tsx`

- [ ] **Step 4.1**:

```tsx
import type { Master } from "@/app/_lib/data/masters";

export function MasterDetailBio({ master }: { master: Master }) {
  return (
    <section className="zone warm" aria-label={`О мастере ${master.name}`}>
      <div className="wrap">
        <div className="meta">О себе</div>
        <h2>Кто я</h2>
        <p className="master-detail-bio__text">{master.bioFull}</p>
      </div>
    </section>
  );
}
```

---

### Task 5: MasterDetailDirections (server)

**Files:** Create `app/_components/masters/MasterDetailDirections.tsx`

- [ ] **Step 5.1**:

```tsx
import type { Direction, Master } from "@/app/_lib/data/masters";

const DIRECTION_INFO: Record<
  Direction,
  { label: string; href: string; cta: string }
> = {
  banya: { label: "Баня", href: "/banya", cta: "О направлении «Баня» →" },
  relax: {
    label: "Релаксология",
    href: "/relax",
    cta: "О направлении «Релаксология» →",
  },
  trainings: {
    label: "Кунгфу",
    href: "/trainings",
    cta: "О направлении «Тренировки» →",
  },
};

export function MasterDetailDirections({ master }: { master: Master }) {
  const cards = master.directions
    .map((d) => {
      const detail = master.directionDetails[d];
      if (!detail) return null;
      return { dir: d, info: DIRECTION_INFO[d], detail };
    })
    .filter(<T,>(x: T | null): x is T => x !== null);

  if (cards.length === 0) return null;

  const colsClass =
    cards.length >= 3
      ? "master-directions-grid is-cols-3"
      : "master-directions-grid is-cols-2";

  return (
    <section className="zone cool" aria-label="Направления мастера">
      <div className="wrap">
        <div className="meta">Чем занимаюсь</div>
        <h2>Направления</h2>

        <div className={colsClass}>
          {cards.map(({ dir, info, detail }) => (
            <article key={dir} className="master-direction-card">
              <h3 className="master-direction-card__title">
                <a href={info.href}>{info.label}</a>
              </h3>
              <p className="master-direction-card__desc">
                {detail.description}
              </p>
              <ul className="master-direction-specs">
                {detail.specializations.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a href={info.href} className="master-direction-card__more">
                {info.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Why generic-narrowing filter:** аккуратно убираем `null` без `!` ассертов.

---

### Task 6: MasterDetailFormats (server)

**Files:** Create `app/_components/masters/MasterDetailFormats.tsx`

- [ ] **Step 6.1**:

```tsx
import type { Master } from "@/app/_lib/data/masters";
import { LOCATIONS } from "@/app/_lib/data/locations";

export function MasterDetailFormats({ master }: { master: Master }) {
  const { travel, travelNote, ownLocation, partnerLocations } =
    master.formatsDetails;

  const own = ownLocation
    ? LOCATIONS.find((l) => l.slug === ownLocation)
    : undefined;
  const partners =
    (partnerLocations ?? [])
      .map((slug) => LOCATIONS.find((l) => l.slug === slug))
      .filter((l): l is NonNullable<typeof l> => Boolean(l));

  const hasAnything = travel || own || partners.length > 0;
  if (!hasAnything) return null;

  return (
    <section className="zone warm" aria-label="Форматы работы">
      <div className="wrap">
        <div className="meta">Где работаю</div>
        <h2>Форматы</h2>

        <div className="master-formats">
          {travel && (
            <article className="master-format-card">
              <div className="master-format-card__eyebrow">Выезд</div>
              <h3 className="master-format-card__title">К вам</h3>
              {travelNote && (
                <p className="master-format-card__text">{travelNote}</p>
              )}
            </article>
          )}

          {own && (
            <article className="master-format-card">
              <div className="master-format-card__eyebrow">Своя локация</div>
              <h3 className="master-format-card__title">
                <a href={`/locations/${own.slug}`}>{own.name}</a>
              </h3>
              <p className="master-format-card__text">{own.address}</p>
              <a
                href={`/locations/${own.slug}`}
                className="master-format-card__more"
              >
                Открыть локацию&nbsp;→
              </a>
            </article>
          )}

          {partners.map((p) => (
            <article key={p.slug} className="master-format-card">
              <div className="master-format-card__eyebrow">
                Партнёрская локация
              </div>
              <h3 className="master-format-card__title">
                <a href={`/locations/${p.slug}`}>{p.name}</a>
              </h3>
              <p className="master-format-card__text">{p.address}</p>
              <a
                href={`/locations/${p.slug}`}
                className="master-format-card__more"
              >
                Открыть локацию&nbsp;→
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### Task 7: MasterDetailGallery (client, со lightbox)

**Files:** Create `app/_components/masters/MasterDetailGallery.tsx`

- [ ] **Step 7.1**:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Master, MasterGalleryItem } from "@/app/_lib/data/masters";

function GalleryItemBody({ item }: { item: MasterGalleryItem }) {
  if (item.type === "video") {
    return (
      <div className="master-gallery__placeholder">
        <span className="master-gallery__kind">видео</span>
        <span className="master-gallery__alt">{item.alt}</span>
      </div>
    );
  }
  return (
    <div className="master-gallery__placeholder">
      <span className="master-gallery__kind">фото</span>
      <span className="master-gallery__alt">{item.alt}</span>
    </div>
  );
}

export function MasterDetailGallery({ master }: { master: Master }) {
  const items = master.gallery ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i + 1) % items.length,
      ),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (items.length === 0) return null;

  const active = openIndex !== null ? items[openIndex] : null;
  const multi = items.length > 1;

  return (
    <section className="zone cool" aria-label="Галерея мастера">
      <div className="wrap">
        <div className="meta">Галерея</div>
        <h2>Как это выглядит</h2>

        <div className="master-gallery">
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              className="master-gallery__item"
              onClick={() => setOpenIndex(i)}
              aria-label={`Открыть ${item.type === "video" ? "видео" : "фото"}: ${item.alt}`}
            >
              <GalleryItemBody item={item} />
              {item.caption && (
                <div className="master-gallery__caption">{item.caption}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="master-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр медиа"
          onClick={close}
        >
          <button
            type="button"
            className="master-gallery-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Закрыть"
          >
            ×
          </button>

          {multi && (
            <button
              type="button"
              className="master-gallery-lightbox__nav is-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Предыдущее"
            >
              ‹
            </button>
          )}

          <div
            className="master-gallery-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="master-gallery-lightbox__media">
              <GalleryItemBody item={active} />
            </div>
            {active.caption && (
              <div className="master-gallery-lightbox__caption">
                {active.caption}
              </div>
            )}
          </div>

          {multi && (
            <button
              type="button"
              className="master-gallery-lightbox__nav is-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Следующее"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}
```

**Why placeholder body:** реальных файлов нет — рендерим плейсхолдер-плитку с маркером типа (фото/видео) и alt-текстом. Когда появятся реальные `/placeholder/*.jpg|mp4` — поменяем `GalleryItemBody` на `<img>`/`<video>`.

---

### Task 8: MasterDetailContact (client, форма)

**Files:** Create `app/_components/masters/MasterDetailContact.tsx`

- [ ] **Step 8.1**:

```tsx
"use client";

import { type FormEvent, useState } from "react";
import type { Master } from "@/app/_lib/data/masters";
import { sendLead } from "@/app/_lib/sendLead";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Кунгфу",
};

export function MasterDetailContact({ master }: { master: Master }) {
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

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: `master/${master.slug}`,
      master: master.name,
      direction:
        directionRaw && directionRaw !== "Не определился"
          ? directionRaw
          : undefined,
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
      aria-label={`Записаться к ${master.name}`}
    >
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>Записаться к&nbsp;{master.name}</h2>
            <p className="helper">
              Перезвоним, согласуем время и&nbsp;формат.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <input type="hidden" name="masterSlug" value={master.slug} />

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
              <select name="direction" defaultValue="Не определился">
                <option>Не определился</option>
                {master.directions.map((d) => (
                  <option key={d} value={d}>
                    {DIRECTION_LABELS[d] ?? d}
                  </option>
                ))}
              </select>
            </label>

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Когда удобно, формат, особые пожелания."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Оставить заявку →"}
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

---

### Task 9: MasterDetailCrossLinks (server)

**Files:** Create `app/_components/masters/MasterDetailCrossLinks.tsx`

- [ ] **Step 9.1**:

```tsx
export function MasterDetailCrossLinks() {
  return (
    <section className="zone warm" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/masters">
            <span className="cl-eyebrow">Назад в&nbsp;команду</span>
            <h3 className="cl-title">Все мастера</h3>
            <span className="cl-arrow">Кто ещё работает&nbsp;→</span>
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

### Task 10: Masters.tsx — обернуть имя в ссылку

**Files:** `app/_components/Masters.tsx` (MasterCard)

- [ ] **Step 10.1** — Найти строку `<h3 className="name">{master.name}</h3>` и заменить на:

```tsx
      <h3 className="name">
        <a href={`/masters/${master.slug}`} className="master__name-link">
          {master.name}
        </a>
      </h3>
```

---

### Task 11: app/page.tsx — filterByNames для скрытия Никиты

**Files:** `app/page.tsx` (строка 21)

- [ ] **Step 11.1** — Заменить `<Masters />` на:

```tsx
      <Masters
        filterByNames={["Дмитрий", "Александр", "Вадим", "Анна", "Мария"]}
      />
```

**Why:** требование «Никита на главной не показывается». Минимальная правка, без нового поля в Master типе.

---

### Task 12: CSS — стили master-detail-*

**Files:** `app/globals.css` — добавить блок в конец.

- [ ] **Step 12.1** — Добавить:

```css
/* ============ MASTER DETAIL — HERO ============ */
.master-detail-hero {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 56px;
  align-items: start;
  margin-top: 28px;
}
.master-detail-hero__visual {
  width: 100%;
}
.master-detail-hero__portrait {
  aspect-ratio: 4 / 5;
  background:
    repeating-linear-gradient(135deg,
      rgba(255, 255, 255, .06) 0 7px,
      rgba(255, 255, 255, 0) 7px 16px),
    linear-gradient(180deg, rgba(255, 255, 255, .08), rgba(255, 255, 255, .14));
  border: 1px solid currentColor;
  display: flex;
  align-items: flex-end;
  padding: 18px;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .8;
}
.master-detail-hero__body { display: flex; flex-direction: column; gap: 14px; }
.master-detail-hero__body h1 { margin: 0; }
.master-detail-hero__role {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  letter-spacing: .04em;
  opacity: .8;
}
.master-detail-hero__tags {
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .7;
}
.master-detail-hero__tagline {
  font-family: var(--font-serif), serif;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.35;
  margin: 8px 0 0;
  max-width: 64ch;
}
.master-detail-hero__cta { margin-top: 12px; align-self: flex-start; }

@media (max-width: 880px) {
  .master-detail-hero { grid-template-columns: 1fr; gap: 28px; }
}

/* ============ MASTER DETAIL — BIO ============ */
.master-detail-bio__text {
  font-family: var(--font-serif), serif;
  font-size: clamp(17px, 1.6vw, 21px);
  line-height: 1.55;
  max-width: 68ch;
  margin-top: 18px;
  white-space: pre-line;
}

/* ============ MASTER DETAIL — DIRECTIONS ============ */
.master-directions-grid {
  display: grid;
  gap: 24px;
  margin-top: 28px;
}
.master-directions-grid.is-cols-2 { grid-template-columns: 1fr 1fr; }
.master-directions-grid.is-cols-3 { grid-template-columns: repeat(3, 1fr); }

.master-direction-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 22px 24px;
  border: 1px solid currentColor;
  background: rgba(255, 255, 255, .04);
}
.master-direction-card__title {
  font-family: var(--font-serif), serif;
  font-size: 26px;
  font-weight: 500;
  line-height: 1.15;
  margin: 0;
}
.master-direction-card__title a { color: inherit; }
.master-direction-card__desc {
  font-family: var(--font-sans), sans-serif;
  font-size: 14px;
  line-height: 1.55;
  opacity: .9;
  margin: 0;
}
.master-direction-specs {
  list-style: disc;
  padding-left: 18px;
  margin: 4px 0 0;
  font-family: var(--font-sans), sans-serif;
  font-size: 13px;
  line-height: 1.55;
  opacity: .85;
}
.master-direction-card__more {
  margin-top: auto;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
}

@media (max-width: 880px) {
  .master-directions-grid.is-cols-2,
  .master-directions-grid.is-cols-3 { grid-template-columns: 1fr; }
}

/* ============ MASTER DETAIL — FORMATS ============ */
.master-formats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 28px;
}
.master-format-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, .03);
}
.master-format-card__eyebrow {
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  opacity: .65;
}
.master-format-card__title {
  font-family: var(--font-serif), serif;
  font-size: 22px;
  font-weight: 500;
  margin: 0;
}
.master-format-card__title a { color: inherit; }
.master-format-card__text {
  font-family: var(--font-sans), sans-serif;
  font-size: 13px;
  line-height: 1.5;
  opacity: .85;
  margin: 0;
}
.master-format-card__more {
  margin-top: auto;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .master-formats { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .master-formats { grid-template-columns: 1fr; }
}

/* ============ MASTER DETAIL — GALLERY ============ */
.master-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 28px;
}
.master-gallery__item {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;
  text-align: left;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.master-gallery__placeholder {
  aspect-ratio: 4 / 5;
  border: 1px solid currentColor;
  background:
    repeating-linear-gradient(135deg,
      rgba(255, 255, 255, .06) 0 7px,
      rgba(255, 255, 255, 0) 7px 16px);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  opacity: .9;
}
.master-gallery__kind { font-size: 11px; opacity: .65; }
.master-gallery__alt {
  font-family: var(--font-serif), serif;
  font-size: 14px;
  letter-spacing: 0;
  text-transform: none;
  opacity: .85;
}
.master-gallery__caption {
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  opacity: .65;
}

@media (max-width: 880px) {
  .master-gallery { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .master-gallery { grid-template-columns: 1fr; }
}

/* ============ MASTER DETAIL — LIGHTBOX ============ */
.master-gallery-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.master-gallery-lightbox__content {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #fff;
}
.master-gallery-lightbox__media {
  aspect-ratio: 4 / 5;
  max-height: 80vh;
  border: 1px solid rgba(255, 255, 255, .25);
  background: rgba(255, 255, 255, .05);
  display: flex;
}
.master-gallery-lightbox__media .master-gallery__placeholder {
  flex: 1;
  border: 0;
  background: transparent;
}
.master-gallery-lightbox__caption {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  opacity: .75;
  text-align: center;
}
.master-gallery-lightbox__close,
.master-gallery-lightbox__nav {
  position: absolute;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, .35);
  color: #fff;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  font-family: var(--font-sans), sans-serif;
}
.master-gallery-lightbox__close { top: 20px; right: 20px; }
.master-gallery-lightbox__nav.is-prev { left: 20px; top: 50%; transform: translateY(-50%); }
.master-gallery-lightbox__nav.is-next { right: 20px; top: 50%; transform: translateY(-50%); }
.master-gallery-lightbox__close:hover,
.master-gallery-lightbox__nav:hover { background: rgba(255, 255, 255, .12); }

@media (max-width: 520px) {
  .master-gallery-lightbox { padding: 16px; }
  .master-gallery-lightbox__close { top: 12px; right: 12px; }
  .master-gallery-lightbox__nav.is-prev { left: 8px; }
  .master-gallery-lightbox__nav.is-next { right: 8px; }
}

/* ============ MASTER CARD NAME LINK ============ */
.master__name-link { color: inherit; }
.master__name-link:hover { text-decoration: underline; }
```

---

### Task 13: Проверки

- [ ] **Step 13.1** — `npx tsc --noEmit` — чисто.
- [ ] **Step 13.2** — `npm run dev` в фоне, дождаться готовности.
- [ ] **Step 13.3** — Все 6 страниц мастеров отдают 200:

```bash
for s in dmitry aleksandr vadim nikita anna mariya; do
  echo -n "/masters/$s "; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000/masters/$s"
done
```

- [ ] **Step 13.4** — Несуществующий slug → 404:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/masters/no-such-master
```

- [ ] **Step 13.5** — На странице Дмитрия в DOM есть все секции:

```bash
curl -s http://localhost:3000/masters/dmitry | grep -oE 'breadcrumb|master-detail-hero|master-detail-bio|master-directions-grid|master-formats|master-gallery|lead-form|crosslink|site-footer' | sort | uniq -c
```

Ожидаются: breadcrumb, master-detail-hero, bio (через `master-detail-bio__text` → подсчёт `master-detail-bio`), directions, formats, gallery, lead-form, crosslink, site-footer.

- [ ] **Step 13.6** — На главной нет Никиты, но есть ссылка `/masters/dmitry`:

```bash
curl -s http://localhost:3000/ | grep -oE 'Никита|/masters/dmitry|/masters/aleksandr' | sort | uniq -c
```

Ожидается: `Никита` НЕ найден (или ровно 0), ссылки на `/masters/dmitry` и `/masters/aleksandr` присутствуют.

- [ ] **Step 13.7** — Убить dev.

---

### Task 14: Commit + push

- [ ] **Step 14.1**:

```bash
git add app/masters app/_components/masters \
  app/_components/Masters.tsx app/_lib/data/masters.ts \
  app/page.tsx app/globals.css \
  docs/superpowers/plans/2026-05-16-master-detail-pages.md
git commit -m "создай страницы мастеров /masters/[slug]: расширенные данные, hero с портретом, био, направления, форматы, галерея с lightbox, форма"
git push
```

---

## Self-Review

- ✅ Spec coverage: все 8 user-задач отражены (тип Master, 6 placeholder-данных, маршрут, 7 компонентов, ссылки на главной, CSS, проверки, коммит).
- ✅ Placeholder scan: все placeholder-тексты — статические константы (`PLACEHOLDER_*`), переиспользованы для 5 мастеров; код везде завершённый.
- ✅ Type consistency: `Master`, `DirectionDetail`, `MasterGalleryItem` экспортированы из data, импортируются в компонентах; `getMasterBySlug` добавлен в data.
- ✅ Server/client boundary: Gallery + Contact — client, остальные — server. Page — server, использует sync `params` (Next 14).
- ⚠️ Decision: Никита скрыт через `filterByNames` в `app/page.tsx`, не через новое поле `featuredOnHome`. Если в будущем понадобится больше мастеров скрывать — стоит ввести поле.
- ⚠️ Decision: gallery рендерит **плейсхолдер-плитку**, не реальный `<img>/<video>` — реальных файлов в `/placeholder/*` нет. `GalleryItemBody` локализован в Gallery, легко поменять на `<img>/<video>` когда появятся ассеты.
- ⚠️ Decision: `Direction = "trainings"` отображается как label «Кунгфу» в hero/direction-cards/select формы. Это совпадает с тоном страниц (тренировки = пока кунгфу), и согласуется с `tagsDisplay` мастеров.

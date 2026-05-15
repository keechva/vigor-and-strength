# Locations Pages Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 5 refinement edits to `/locations` and `/locations/[slug]` — rename `training`→`trainings`, rewrite hero copy, collapse detail meta into one line + add direction tags, remove masters section, add map/social blocks to Info.

**Architecture:** Type rename rippled across 8 call-sites; extend `Location` type with `mapEmbedUrl` + `social`; new sub-blocks inside `LocationDetailInfo` for map iframe and social links list. Reuse existing `.banya-hero-tags` for hero direction tags instead of creating a parallel class.

**Tech Stack:** Same as before — Next.js 14.2.18, TypeScript, plain CSS in `globals.css`.

---

## Decisions (deviations from spec)

1. **`.location-detail-hero__tags` not created.** Spec says "стилизуй аналогично `.banya-hero-tags`". That class already exists and is reused on `/relax` (see `app/_components/relax/RelaxHero.tsx:11`). I'll attach `className="banya-hero-tags"` directly — DRY, no duplicate CSS.
2. **`app/_components/Training.tsx:5` `id="training"` is NOT touched.** That's an HTML anchor for `#training` on the homepage, not the `Direction` literal. Same for `Header.tsx` link `/#training`. Only the `Direction` type and its values change.
3. **`docs/superpowers/plans/*.md` are NOT updated.** They are historical artifacts of past planning sessions; the type rename only touches live code.
4. **The unused `LocationDetailMasters.tsx` file is kept on disk** (per spec — may be needed later). It will become dead code (no imports) — that's fine.
5. **2GIS / VK / Telegram / website URLs are placeholders** as marked in the spec; not validated, not crawled.

---

## File Structure

**Modify:**
- `app/_lib/data/masters.ts` — `Direction` type + 3 master `directions` values
- `app/_lib/data/locations.ts` — `Location` type (add `mapEmbedUrl`, `social`) + Самолётная's `directions` + map/social data for 3 working locations
- `app/_components/locations/LocationsGrid.tsx` — `DIRECTION_LABELS` key
- `app/_components/locations/LocationDetailDirections.tsx` — `DIRECTION_CARDS` key
- `app/_components/locations/LocationDetailContact.tsx` — `DIRECTION_LABELS` key
- `app/_components/locations/LocationsHero.tsx` — copy rewrite
- `app/_components/locations/LocationDetailHero.tsx` — meta one-liner + direction tags
- `app/_components/locations/LocationDetailInfo.tsx` — add map + social sub-blocks
- `app/locations/[slug]/page.tsx` — remove `LocationDetailMasters` import + render
- `app/globals.css` — add `.location-info__map*` and `.location-info__social*` blocks

---

## Task 1: Rename `Direction` `training` → `trainings`

**Files (8 edits across 6 files):**
- `app/_lib/data/masters.ts` — type literal + Дмитрий + Вадим
- `app/_lib/data/locations.ts` — Самолётная-59 directions
- `app/_components/locations/LocationsGrid.tsx` — DIRECTION_LABELS key
- `app/_components/locations/LocationDetailDirections.tsx` — DIRECTION_CARDS key
- `app/_components/locations/LocationDetailContact.tsx` — DIRECTION_LABELS key

- [ ] **Step 1.1: `masters.ts` — rename type + 3 values**

```ts
export type Direction = "banya" | "relax" | "trainings";
```
And every `"training"` literal inside `MASTERS[].directions` becomes `"trainings"` (Дмитрий, Вадим).

- [ ] **Step 1.2: `locations.ts` — update Самолётная**

```ts
directions: ["banya", "relax", "trainings"],
```

- [ ] **Step 1.3: `LocationsGrid.tsx` — DIRECTION_LABELS key**

```ts
const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};
```

- [ ] **Step 1.4: `LocationDetailDirections.tsx` — DIRECTION_CARDS key**

```ts
const DIRECTION_CARDS: Record<
  string,
  { title: string; arrow: string; href: string }
> = {
  banya: { title: "Баня", arrow: "Все программы и форматы →", href: "/banya" },
  relax: { title: "Релаксология", arrow: "Мастера и подход →", href: "/relax" },
  trainings: {
    title: "Тренировки",
    arrow: "В разработке, лист ожидания →",
    href: "/training",
  },
};
```

(Note: target `href` stays `/training` — that's the homepage anchor; only the Direction literal key renames.)

- [ ] **Step 1.5: `LocationDetailContact.tsx` — DIRECTION_LABELS key**

```ts
const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};
```

- [ ] **Step 1.6: Typecheck**

Run: `npm run typecheck`
Expected: clean (no leftover `"training"` literals referenced as `Direction`).

---

## Task 2: `LocationsHero` copy rewrite

**Files:**
- Modify: `app/_components/locations/LocationsHero.tsx`

- [ ] **Step 2.1: Replace both `<p className="banya-hero-lead">` paragraphs with a single one**

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
            Работаем по&nbsp;всему Оренбургу&nbsp;— в&nbsp;проверенных
            партнёрских банях, в&nbsp;загородном клубе и&nbsp;выезжаем.
            Своё пространство готовим&nbsp;— откроется на&nbsp;Самолётной,&nbsp;59.
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 3: `LocationDetailHero` — meta one-liner + direction tags

**Files:**
- Modify: `app/_components/locations/LocationDetailHero.tsx`

- [ ] **Step 3.1: Replace component contents**

```tsx
import type { Location } from "@/app/_lib/data/locations";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};

export function LocationDetailHero({ location }: { location: Location }) {
  const typeLabel = location.type === "own" ? "своя" : "партнёрская";
  const typeClass = location.type === "own" ? "is-own" : "is-partner";
  const isDev = location.status === "development";

  const metaParts = [
    location.capacity,
    location.priceHint,
    location.workingHours,
  ].filter(Boolean) as string[];

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

          {metaParts.length > 0 && (
            <div className="location-detail-hero__meta">
              {metaParts.join(" · ")}
            </div>
          )}

          <div className="banya-hero-tags">
            {location.directions.map((d) => DIRECTION_LABELS[d] || d).join(" · ")}
          </div>

          <p className="banya-hero-lead">{location.shortDescription}</p>
        </div>
      </div>
    </section>
  );
}
```

Note: the old `location-detail-hero__meta` rule already styles a column with `flex-direction: column; gap: 4px`. With a single-line string, flex-direction is irrelevant — visually it just renders one row. Fine to leave the CSS rule untouched.

---

## Task 4: Remove `LocationDetailMasters` from dynamic route

**Files:**
- Modify: `app/locations/[slug]/page.tsx`

- [ ] **Step 4.1: Remove import line**

Delete:
```ts
import { LocationDetailMasters } from "@/app/_components/locations/LocationDetailMasters";
```

- [ ] **Step 4.2: Remove render line**

Delete:
```tsx
<LocationDetailMasters location={location} />
```

(The component file itself stays on disk — unused but preserved.)

---

## Task 5: Extend `Location` type with map + social

**Files:**
- Modify: `app/_lib/data/locations.ts`

- [ ] **Step 5.1: Extend `Location` type**

Insert into the `Location` type (after `amenities`):

```ts
  mapEmbedUrl?: string;
  social?: {
    vk?: string;
    telegram?: string;
    instagram?: string;
    yandex?: string;
    twogis?: string;
    website?: string;
  };
```

- [ ] **Step 5.2: Add map + social data for 3 working locations**

In the `LOCATIONS` array, append the new fields **after `amenities`** on the three working locations. Final shape:

`lukomorie`:
```ts
    mapEmbedUrl:
      "https://yandex.ru/map-widget/v1/?text=Оренбург+ул.+Базовая+23к1&z=16",
    social: {
      yandex: "https://yandex.ru/maps/org/lukomorye/1051887833/",
      twogis: "https://2gis.ru/orenburg/firm/70000001034987541",
      vk: "https://vk.com/lukomorie_orenburg",
      telegram: "https://t.me/lukomorie_orenburg",
    },
```

`kitusya`:
```ts
    mapEmbedUrl:
      "https://yandex.ru/map-widget/v1/?text=Оренбург+ул.+Ваана-Теряна+38&z=16",
    social: {
      yandex: "https://yandex.ru/maps/?text=Оренбург+Китуся+сауна",
      twogis: "https://2gis.ru/orenburg/firm/kitusya",
    },
```

`oazis-otdyha`:
```ts
    mapEmbedUrl:
      "https://yandex.ru/map-widget/v1/?text=Оренбург+ул.+Полевая+23/1&z=16",
    social: {
      yandex: "https://yandex.ru/maps/org/oazis_otdykha/61012996444/",
      twogis: "https://2gis.ru/orenburg/firm/oazis_otdyha",
      website: "https://oazis-otdyha-orenburg.ru",
    },
```

(Самолётная-59 — поля не добавлены.)

---

## Task 6: Extend `LocationDetailInfo` with map + social blocks

**Files:**
- Modify: `app/_components/locations/LocationDetailInfo.tsx`

- [ ] **Step 6.1: Replace component**

```tsx
import type { Location } from "@/app/_lib/data/locations";

const SOCIAL_LABELS: { key: keyof NonNullable<Location["social"]>; label: string }[] = [
  { key: "yandex", label: "Яндекс Карты" },
  { key: "twogis", label: "2ГИС" },
  { key: "vk", label: "VK" },
  { key: "telegram", label: "Telegram" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Сайт" },
];

export function LocationDetailInfo({ location }: { location: Location }) {
  const social = location.social;
  const hasSocial =
    !!social && SOCIAL_LABELS.some((s) => !!social[s.key]);

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

        <div className="location-info__map">
          <h3>Как добраться</h3>
          {location.mapEmbedUrl ? (
            <div className="location-info__map-frame">
              <iframe
                src={location.mapEmbedUrl}
                width="100%"
                height="400"
                frameBorder={0}
                allow="fullscreen"
                loading="lazy"
                title={`Карта: ${location.name}`}
              />
            </div>
          ) : (
            <p className="location-info__map-placeholder">
              Точный адрес уточняется. Откроемся в&nbsp;[адрес&nbsp;— placeholder].
            </p>
          )}
        </div>

        {hasSocial && social && (
          <div className="location-info__social">
            <h3>Где ещё посмотреть</h3>
            <ul className="location-info__social-list">
              {SOCIAL_LABELS.map(({ key, label }) => {
                const href = social[key];
                if (!href) return null;
                return (
                  <li key={key}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Task 7: CSS for map + social

**Files:**
- Modify: `app/globals.css` (append to end of file)

- [ ] **Step 7.1: Append**

```css

.location-info__map { margin-top: 32px; }
.location-info__map h3,
.location-info__social h3 {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.7;
  margin: 0 0 12px;
  font-weight: 500;
}
.location-info__map-frame {
  position: relative;
  width: 100%;
  border: 1px solid var(--cool-deep);
}
.location-info__map-frame iframe {
  display: block;
  width: 100%;
  height: 400px;
  border: 0;
}
.location-info__map-placeholder {
  font-family: var(--font-serif), serif;
  font-style: italic;
  opacity: 0.7;
  margin: 0;
}
.location-info__social { margin-top: 32px; }
.location-info__social-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}
.location-info__social-list a {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--cool-deep);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.location-info__social-list a:hover {
  text-decoration-thickness: 2px;
}
```

---

## Task 8: Build + verify

**Files:** (no edits)

- [ ] **Step 8.1: Typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: clean; 4 prerendered slugs unchanged.

- [ ] **Step 8.2: Restart prod**

```bash
fuser -k 3000/tcp 2>/dev/null; pkill -f next-server 2>/dev/null; sleep 1
nohup npm run start > /tmp/next-prod.log 2>&1 &
sleep 4
```

- [ ] **Step 8.3: Curl-verify /locations hero copy**

```bash
curl -s http://localhost:3000/locations | grep -c "Работаем по всему Оренбургу"
# expect 1
curl -s http://localhost:3000/locations | grep -c "Своё пространство готовим"
# expect 1
```

- [ ] **Step 8.4: Curl-verify /locations/lukomorie**

```bash
curl -s http://localhost:3000/locations/lukomorie | grep -c "до 10 человек"
curl -s http://localhost:3000/locations/lukomorie | grep -c "banya-hero-tags"
curl -s http://localhost:3000/locations/lukomorie | grep -c "map-widget/v1"
curl -s http://localhost:3000/locations/lukomorie | grep -c "2ГИС"
curl -s http://localhost:3000/locations/lukomorie | grep -c "Кто здесь работает"
# first 4 ≥1, last must be 0
```

- [ ] **Step 8.5: Curl-verify /locations/samoletnaya-59**

```bash
curl -s http://localhost:3000/locations/samoletnaya-59 | grep -c "Точный адрес уточняется"
curl -s http://localhost:3000/locations/samoletnaya-59 | grep -c "Где ещё посмотреть"
curl -s http://localhost:3000/locations/samoletnaya-59 | grep -c "Кто здесь работает"
# first ≥1, last two must be 0
```

- [ ] **Step 8.6: Curl-verify /locations/kitusya social link count (2)**

```bash
curl -s http://localhost:3000/locations/kitusya | grep -c "Яндекс Карты"
curl -s http://localhost:3000/locations/kitusya | grep -c "2ГИС"
curl -s http://localhost:3000/locations/kitusya | grep -c '">VK<'
# first 2 ≥1, last 0 (no VK on kitusya)
```

---

## Task 9: Commit + push

- [ ] **Step 9.1: Stage & commit**

```bash
git add app/_lib/data/masters.ts \
  app/_lib/data/locations.ts \
  app/_components/locations/LocationsGrid.tsx \
  app/_components/locations/LocationDetailDirections.tsx \
  app/_components/locations/LocationDetailContact.tsx \
  app/_components/locations/LocationsHero.tsx \
  app/_components/locations/LocationDetailHero.tsx \
  app/_components/locations/LocationDetailInfo.tsx \
  app/locations/[slug]/page.tsx \
  app/globals.css \
  docs/superpowers/plans/2026-05-15-locations-refinements.md

git commit -m "доработай /locations: новый вординг, мета в строку, теги направлений, карта и соцсети, убери блок мастеров"
git push
```

---

## Self-review notes

- **Spec coverage**: Правка 1 → Task 1; Правка 2 → Task 2; Правка 3 → Task 3; Правка 4 → Task 4; Правка 5 → Task 5+6+7; Правка 6 (проверка) → Task 8; Правка 7 (коммит) → Task 9. Все 7 покрыты.
- **Placeholder scan**: no TBD/TODO. Все шаги содержат конечный код или конкретные команды.
- **Type consistency**: `Direction = "banya" | "relax" | "trainings"` единообразно во всех 5 переименованиях (Task 1.1–1.5). `Location.social` использован в `SOCIAL_LABELS` через `keyof NonNullable<Location["social"]>` — связан с определением в Task 5.1.
- **Deviation block**: задокументирован 5-пунктовый блок отклонений в начале (особенно: переиспользование `.banya-hero-tags`).

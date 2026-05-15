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
        {location.directions.map((d) => DIRECTION_LABELS[d] || d).join(" · ")}
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
          Где мы&nbsp;работаем
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

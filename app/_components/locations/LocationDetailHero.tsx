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

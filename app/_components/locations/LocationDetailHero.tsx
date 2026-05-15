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

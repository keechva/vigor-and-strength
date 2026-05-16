import type { Master } from "@/app/_lib/data/masters";
import { LOCATIONS } from "@/app/_lib/data/locations";

export function MasterDetailFormats({ master }: { master: Master }) {
  const { travel, travelNote, ownLocation, partnerLocations } =
    master.formatsDetails;

  const own = ownLocation
    ? LOCATIONS.find((l) => l.slug === ownLocation)
    : undefined;
  const partners = (partnerLocations ?? [])
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

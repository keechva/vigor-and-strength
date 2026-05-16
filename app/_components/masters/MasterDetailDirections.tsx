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
    label: "Тренировки",
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

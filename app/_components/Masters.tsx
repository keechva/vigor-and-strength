import { MASTERS, type Direction, type Master } from "../_lib/data/masters";

type MastersProps = {
  title?: string;
  filterDirection?: Direction | null;
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
  ctaHref = "/masters",
  ctaLabel = "Все мастера →",
}: MastersProps = {}) {
  const list = filterDirection
    ? MASTERS.filter((m) => m.directions.includes(filterDirection))
    : MASTERS;

  return (
    <section className="zone warm" id="masters" aria-label={title}>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="masters-cold-dot" aria-hidden="true" />

        <div className="masters-head">
          <div>
            <div className="meta">Команда</div>
            <h2>{title}</h2>
          </div>
          <a className="cta" href={ctaHref}>
            {ctaLabel}
          </a>
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

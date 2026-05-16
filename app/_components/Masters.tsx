import { DIRECTION_LABELS, MASTERS, type Direction, type Master } from "../_lib/data/masters";

type MastersProps = {
  title?: string;
  filterDirection?: Direction | null;
  filterByNames?: string[] | null;
  ctaHref?: string;
  ctaLabel?: string;
};

export function MasterCard({
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
      <h3 className="name">
        <a href={`/masters/${master.slug}`} className="master__name-link">
          {master.name}
        </a>
      </h3>
      <div className="role">{master.role}</div>
      <div className="tags">
        {master.directions.map((d) => DIRECTION_LABELS[d]).join(" · ")}
      </div>
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

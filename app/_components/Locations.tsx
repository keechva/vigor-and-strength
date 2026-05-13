type Location = {
  num: string;
  title: string;
  type: string;
  desc: string;
  slug: string;
};

const LOCATIONS: Location[] = [
  {
    num: "L · 01",
    title: "Самолётная, 59",
    type: "Своя · в разработке",
    desc: "[placeholder · собственная площадка проекта. Опишем что там будет — пар, релаксологические комнаты, чайная.]",
    slug: "samoletnaya-59",
  },
  {
    num: "L · 02",
    title: "Лукоморье",
    type: "Партнёрская",
    desc: "[placeholder · короткое описание партнёрской бани, формат сотрудничества.]",
    slug: "lukomorye",
  },
  {
    num: "L · 03",
    title: "Китуся",
    type: "Партнёрская",
    desc: "[placeholder · короткое описание партнёрской бани.]",
    slug: "kitusya",
  },
  {
    num: "L · 04",
    title: "Оазис отдыха",
    type: "Партнёрская",
    desc: "[placeholder · короткое описание партнёрской бани.]",
    slug: "oazis",
  },
  {
    num: "L · 05",
    title: "Выезд к клиенту",
    type: "Выезд",
    desc: "[placeholder · в каких форматах едем, какие условия, что приносим с собой.]",
    slug: "vyezd",
  },
];

export function Locations() {
  return (
    <section className="zone cool" id="locations" aria-label="Локации">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="locations-warm-dot" aria-hidden="true" />

        <div className="locations-head">
          <div>
            <div className="meta">Где это происходит</div>
            <h2>Локации</h2>
          </div>
          <a className="cta" href="/locations">
            Все локации&nbsp;→
          </a>
        </div>

        <div className="locations-list">
          {LOCATIONS.map((l) => (
            <article key={l.slug} className="location">
              <div className="num">{l.num}</div>
              <div>
                <div className="ltitle">{l.title}</div>
                <div className="ltype">{l.type}</div>
              </div>
              <div className="ldesc">{l.desc}</div>
              <div className="larrow">
                <a href={`/locations/${l.slug}`}>Подробнее&nbsp;→</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

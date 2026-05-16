type Item = {
  num: string;
  title: string;
  status: string;
  desc: string;
};

const ITEMS: Item[] = [
  {
    num: "R · 01",
    title: "Медитации",
    status: "в подготовке",
    desc: "Работа с вниманием в покое. Без эзотерики, без поз лотоса. Заведём отдельный поток, когда соберём группу.",
  },
  {
    num: "R · 02",
    title: "Работа с дыханием",
    status: "в подготовке",
    desc: "Простые техники под физическую и эмоциональную нагрузку. Часто включается в кунгфу, но имеет смысл и сама по себе.",
  },
  {
    num: "R · 03",
    title: "Открытые мастерские",
    status: "в идеях",
    desc: "Разовые встречи на одну тему — для тех, кто хочет попробовать без регулярки.",
  },
];

export function TrainingsRoadmap() {
  return (
    <section className="zone warm" aria-label="Дорожная карта направления">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Дорожная карта
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
          Что добавим дальше
        </h2>

        <div className="cards col-3">
          {ITEMS.map((it) => (
            <article key={it.title} className="card">
              <div className="card-num">{it.num}</div>
              <h3>{it.title}</h3>
              <span className="trainings-roadmap-status">{it.status}</span>
              <p>{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

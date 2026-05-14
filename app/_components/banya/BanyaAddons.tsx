type Addon = {
  num: string;
  title: string;
  desc: string;
};

const ADDONS: Addon[] = [
  {
    num: "A · 01",
    title: "Веник",
    desc: "Берёза, дуб, эвкалипт, хвоя и др. — обсуждаем заранее или выбираем на месте.",
  },
  {
    num: "A · 02",
    title: "Скрабирование",
    desc: "Между заходами — мягкая работа с кожей.",
  },
  {
    num: "A · 03",
    title: "Ароматерапия",
    desc: "Эфирные масла на пар. По настроению или под цель.",
  },
  {
    num: "A · 04",
    title: "Звукотерапия",
    desc: "Поющие чаши в моменты тишины между заходами.",
  },
  {
    num: "A · 05",
    title: "Чай",
    desc: "Травяные сборы, согревающие или восстанавливающие.",
  },
  {
    num: "A · 06",
    title: "Работа с телом после пара",
    desc: "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
  },
];

export function BanyaAddons() {
  return (
    <section className="zone warm" aria-label="Допники">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Допники
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
          Что можно добавить
        </h2>
        <div className="cards col-3">
          {ADDONS.map((a) => (
            <article key={a.num} className="card">
              <div className="card-num">{a.num}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

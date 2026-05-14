type Program = {
  num: string;
  title: string;
  desc: string;
};

const PROGRAMS: Program[] = [
  {
    num: "P · 01",
    title: "Классика",
    desc: "Парение + веник на выбор + чай.",
  },
  {
    num: "P · 02",
    title: "Восстановление",
    desc: "Парение + скрабирование + работа с телом после пара + чай.",
  },
  {
    num: "P · 03",
    title: "Сенсорная",
    desc: "Парение + ароматерапия + звукотерапия.",
  },
  {
    num: "P · 04",
    title: "В четыре руки",
    desc: "Парение + работа с телом двумя мастерами.",
  },
  {
    num: "P · 05",
    title: "Полный релакс",
    desc: "Все допники включены.",
  },
  {
    num: "P · 06",
    title: "Компания",
    desc: "До пятнадцати человек, базовое + опции под группу.",
  },
];

export function BanyaPrograms() {
  return (
    <section className="zone warm" aria-label="Программы">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Программы
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
          Готовые наборы
        </h2>
        <div className="format-list">
          {PROGRAMS.map((p) => (
            <article key={p.num} className="format-row">
              <div className="fr-num">{p.num}</div>
              <div className="fr-title">{p.title}</div>
              <div className="fr-desc">{p.desc}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

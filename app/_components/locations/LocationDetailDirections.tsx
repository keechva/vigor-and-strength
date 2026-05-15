import type { Location } from "@/app/_lib/data/locations";

const DIRECTION_CARDS: Record<
  string,
  { title: string; arrow: string; href: string }
> = {
  banya: {
    title: "Баня",
    arrow: "Все программы и форматы →",
    href: "/banya",
  },
  relax: {
    title: "Релаксология",
    arrow: "Мастера и подход →",
    href: "/relax",
  },
  trainings: {
    title: "Тренировки",
    arrow: "В разработке, лист ожидания →",
    href: "/training",
  },
};

export function LocationDetailDirections({
  location,
}: {
  location: Location;
}) {
  return (
    <section className="zone warm" aria-label="Направления">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Направления
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1,
            fontWeight: 500,
            margin: "0 0 32px",
            letterSpacing: "-.01em",
          }}
        >
          Какие направления здесь работают
        </h2>
        <div className="crosslinks">
          {location.directions.map((d) => {
            const card = DIRECTION_CARDS[d];
            if (!card) return null;
            return (
              <a key={d} className="crosslink" href={card.href}>
                <span className="cl-eyebrow">Направление</span>
                <h3 className="cl-title">{card.title}</h3>
                <span className="cl-arrow">{card.arrow}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

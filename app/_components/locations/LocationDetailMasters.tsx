import type { Location } from "@/app/_lib/data/locations";
import { Masters } from "@/app/_components/Masters";

export function LocationDetailMasters({ location }: { location: Location }) {
  if (location.masters.length === 0) {
    return (
      <section className="zone warm" aria-label="Команда">
        <div className="wrap">
          <div className="meta" style={{ marginBottom: 16 }}>
            Команда
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(32px, 5vw, 64px)",
              lineHeight: 1,
              fontWeight: 500,
              margin: "0 0 16px",
              letterSpacing: "-.01em",
            }}
          >
            Кто здесь работает
          </h2>
          <p style={{ opacity: 0.7, maxWidth: 560 }}>
            Список мастеров появится при&nbsp;открытии локации.
          </p>
        </div>
      </section>
    );
  }

  return (
    <Masters
      title="Кто здесь работает"
      filterByNames={location.masters}
      ctaLabel=""
      ctaHref=""
    />
  );
}

import type { Location } from "@/app/_lib/data/locations";

export function LocationDetailInfo({ location }: { location: Location }) {
  return (
    <section className="zone cool" aria-label="Описание">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Описание
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            lineHeight: 1,
            fontWeight: 500,
            margin: "0 0 24px",
            letterSpacing: "-.01em",
          }}
        >
          Что внутри
        </h2>
        <p style={{ maxWidth: 760, marginBottom: 32, lineHeight: 1.6 }}>
          {location.fullDescription}
        </p>

        {location.amenities.length > 0 && (
          <>
            <h3 style={{ margin: "32px 0 16px", fontSize: 22, fontWeight: 600 }}>
              Что есть на&nbsp;месте
            </h3>
            <ul className="location-amenities">
              {location.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

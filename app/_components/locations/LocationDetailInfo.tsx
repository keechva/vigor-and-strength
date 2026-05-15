import type { Location } from "@/app/_lib/data/locations";

const SOCIAL_LABELS: {
  key: keyof NonNullable<Location["social"]>;
  label: string;
}[] = [
  { key: "yandex", label: "Яндекс Карты" },
  { key: "twogis", label: "2ГИС" },
  { key: "vk", label: "VK" },
  { key: "telegram", label: "Telegram" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Сайт" },
];

export function LocationDetailInfo({ location }: { location: Location }) {
  const social = location.social;
  const hasSocial = !!social && SOCIAL_LABELS.some((s) => !!social[s.key]);

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

        <div className="location-info__map">
          <h3>Как добраться</h3>
          {location.mapEmbedUrl ? (
            <div className="location-info__map-frame">
              <iframe
                src={location.mapEmbedUrl}
                width="100%"
                height="400"
                frameBorder={0}
                allow="fullscreen"
                loading="lazy"
                title={`Карта: ${location.name}`}
              />
            </div>
          ) : (
            <p className="location-info__map-placeholder">
              Точный адрес уточняется. Откроемся в&nbsp;[адрес&nbsp;— placeholder].
            </p>
          )}
        </div>

        {hasSocial && social && (
          <div className="location-info__social">
            <h3>Где ещё посмотреть</h3>
            <ul className="location-info__social-list">
              {SOCIAL_LABELS.map(({ key, label }) => {
                const href = social[key];
                if (!href) return null;
                return (
                  <li key={key}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

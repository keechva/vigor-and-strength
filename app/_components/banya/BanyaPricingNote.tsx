export function BanyaPricingNote() {
  return (
    <section className="zone warm" aria-label="Ориентир по цене">
      <div className="wrap">
        <p
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(20px, 1.6vw, 26px)",
            lineHeight: 1.5,
            maxWidth: "44ch",
            margin: 0,
            opacity: 0.85,
          }}
        >
          Цена согласуется индивидуально — соберите состав в конфигураторе ниже,
          и мы назовём ориентир.
        </p>
      </div>
    </section>
  );
}

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
          Прайса как такового нет — слишком много переменных. Соберите свой
          вечер в конфигураторе, и мы назовём вилку.
        </p>
      </div>
    </section>
  );
}

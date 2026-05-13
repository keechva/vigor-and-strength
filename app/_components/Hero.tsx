export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="wrap">
        <div className="hero-inner">
          <div className="cold-dot" aria-hidden="true" />

          <h1>
            Бодрость&nbsp;<span className="amp">и</span>
            <br />
            Сила
          </h1>

          <div className="directions">
            Баня <span className="dot">·</span> Релаксология{" "}
            <span className="dot">·</span> Тренировки
          </div>
        </div>
      </div>
    </section>
  );
}

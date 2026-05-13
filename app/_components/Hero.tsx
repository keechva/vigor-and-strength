export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="wrap">
        <nav className="topnav">
          <div className="brand">бодрость&nbsp;и&nbsp;сила</div>
          <ul>
            <li><a href="#banya">Баня</a></li>
            <li><a href="#relax">Релаксология</a></li>
            <li><a href="#training">Тренировки</a></li>
            <li><a href="#masters">Мастера</a></li>
            <li><a href="#locations">Локации</a></li>
            <li><a href="#contact">Связаться</a></li>
          </ul>
        </nav>

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

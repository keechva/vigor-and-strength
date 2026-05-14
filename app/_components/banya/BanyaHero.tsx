export function BanyaHero() {
  return (
    <section className="hero" aria-label="Баня — заголовок">
      <div className="wrap">
        <div className="hero-sub">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Баня
          </div>
          <h1>Баня</h1>

          <div className="banya-hero-tags">
            Парная <span>·</span> Веник <span>·</span> Чай
          </div>

          <div className="banya-hero-lead">
            <p>Работаем по Оренбургу и области.</p>
            <p>До пятнадцати человек, при желании — в четыре руки.</p>
          </div>

          <a className="banya-hero-cta" href="#configurator">
            Собрать вечер&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
}

export function TrainingsHero() {
  return (
    <section className="hero" aria-label="Тренировки — заголовок">
      <div className="wrap">
        <div className="hero-sub">
          <div className="breadcrumb">
            <a href="/">Главная</a> / Тренировки
          </div>
          <h1>Тренировки</h1>

          <div className="banya-hero-tags">
            Кунгфу <span>·</span> Медитации <span>·</span> Дыхание
          </div>

          <div className="banya-hero-lead">
            <p>Сейчас работаем по кунгфу — индивидуально и в группе.</p>
            <p>Медитации и работа с дыханием — в подготовке.</p>
          </div>

          <a className="trainings-hero-cta" href="#contact">
            В лист ожидания&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
}

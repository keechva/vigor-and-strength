export function Training() {
  return (
    <section
      className="zone neutral-light"
      id="training"
      aria-label="Тренировки"
    >
      <div className="wrap">
        <div className="practice training">
          <div className="copy">
            <div className="meta">03</div>
            <h2>Тренировки</h2>
            <p>
              Готовим направление тренировок. Кунгфу, медитации, работа с
              дыханием — собираем группы и индивидуальные расписания.
              Запишитесь в лист ожидания, чтобы попасть в первый набор.
            </p>
            <a className="cta" href="#contact">
              Записаться в лист ожидания&nbsp;→
            </a>
          </div>

          <div style={{ position: "relative", transform: "translateY(28px)" }}>
            <div
              className="video-slot vertical"
              role="img"
              aria-label="Видео: тренировки — движение, форма, дыхание"
            >
              <div className="vs-corner">video · 4:5</div>
              <div className="vs-play" aria-hidden="true" />
              <div className="soon-mark">Скоро</div>
              <div className="vs-label">движение · форма · дыхание</div>
              <div className="vs-time">00:54</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

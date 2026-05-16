export function TrainingsKungfu() {
  return (
    <section className="zone warm" aria-label="Кунгфу">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Первое направление
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 48px",
            letterSpacing: "-.01em",
          }}
        >
          Кунгфу
        </h2>

        <div className="banya-intro">
          <div className="banya-intro-manifesto">
            <h3>Какой подход</h3>
            <p>
              Это не спортивный кружок. Кунгфу для нас — способ обращаться с
              телом и вниманием через движение. Работаем медленно,
              последовательно, без гонки за поясами. Базовая практика
              выстраивается от стоек и дыхания, дальше — формы, отработка с
              партнёром, отдельные техники.
            </p>
          </div>

          <div className="banya-intro-divider" aria-hidden="true" />

          <div className="banya-formats">
            <h3>Форматы</h3>
            <div className="trainings-formats-grid">
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ◇
                </div>
                <h4>Индивидуально</h4>
                <p>
                  Один на один с тренером. Программа выстраивается под уровень и
                  цели. Подходит для начала или если хочется сосредоточенной
                  работы.
                </p>
              </article>
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ○
                </div>
                <h4>Группа</h4>
                <p>
                  3–6 человек, регулярное расписание. Соберём первую группу из
                  тех, кто оставил заявку. Подходит для продолжения практики и
                  работы в паре.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrainingsCoach() {
  return (
    <section className="zone cool" aria-label="Тренер">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Кто ведёт
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 12px",
            letterSpacing: "-.01em",
          }}
        >
          Тренер
        </h2>

        <div className="trainings-coach">
          <div className="trainings-coach__visual" aria-hidden="true">
            [video / training-coach]
          </div>
          <div className="trainings-coach__body">
            <h3>Дмитрий</h3>
            <p className="trainings-coach__role">Ведущий мастер</p>
            <p>
              Дмитрий ведёт кунгфу, баню и работу с телом. Тренирует уже не
              первый десяток лет. Сейчас по тренировкам работает один — позже к
              команде присоединятся ученики, которые будут вести группы и
              отдельные практики.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

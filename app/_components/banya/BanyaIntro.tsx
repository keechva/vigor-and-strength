export function BanyaIntro() {
  return (
    <section className="zone warm" aria-label="Описание направления">
      <div className="wrap">
        <div className="banya-intro">
          <div className="banya-intro-manifesto">
            <h3>Как мы парим</h3>
            <p>
              Парение — основа любого вечера в бане. Заходы в парную, веник,
              перерывы на чай и воздух. Это ритм, на который нанизываются
              добавки: ароматерапия, поющие чаши, работа с телом после пара —
              по настроению или под цель.
            </p>
          </div>

          <div className="banya-intro-divider" aria-hidden="true" />

          <div className="banya-formats">
            <h3>Форматы работы</h3>
            <div className="banya-formats-grid">
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ◇
                </div>
                <h4>Выезд</h4>
                <p>
                  Приезжаем к вам со всем нужным — веничный набор, масла, чай.
                  Парим в вашей бане или сауне.
                </p>
              </article>
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  ○
                </div>
                <h4>Партнёрские бани</h4>
                <p>
                  Работаем в проверенных банных комплексах с прямой записью к
                  мастеру. Список локаций ниже.
                </p>
              </article>
              <article className="banya-format-card">
                <div className="banya-format-icon" aria-hidden="true">
                  □
                </div>
                <h4>Своя локация</h4>
                <p>
                  В разработке. Откроемся в [адрес — placeholder]. Следите за
                  анонсами.
                </p>
              </article>
            </div>
            <p className="banya-formats-note">
              При большой компании или особом запросе — работа в четыре руки,
              двумя мастерами одновременно.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

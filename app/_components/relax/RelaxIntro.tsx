export function RelaxIntro() {
  return (
    <section className="zone cool" aria-label="Описание направления">
      <div className="wrap">
        <div className="relax-intro">
          <div className="relax-intro-manifesto">
            <h3>Что это</h3>
            <p>
              Релаксология — это работа с телом руками без медицинского
              контекста и без процедурной логики. Сеанс длится час или больше, в
              нём нет «зон по таймеру» и обязательных техник. Мастер слушает
              руками то, что в теле сейчас просится, и работает с этим —
              медленно, в тишине, по ощущениям.
            </p>
          </div>

          <div className="relax-intro-divider" aria-hidden="true" />

          <div className="relax-formats">
            <h3>Форматы работы</h3>
            <div className="relax-formats-grid">
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  ◇
                </div>
                <h4>Выезд</h4>
                <p>
                  Приезжаем к вам со своим — складной стол, валики, масла.
                  Работаем у вас дома, в номере или на природе.
                </p>
              </article>
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  ○
                </div>
                <h4>Партнёрские студии</h4>
                <p>
                  Работаем в проверенных пространствах, где есть всё нужное.
                  Список локаций ниже.
                </p>
              </article>
              <article className="relax-format-card">
                <div className="relax-format-icon" aria-hidden="true">
                  □
                </div>
                <h4>Своя локация</h4>
                <p>
                  В разработке. Откроемся в [адрес — placeholder]. Следите за
                  анонсами.
                </p>
              </article>
            </div>
            <p className="relax-formats-note">
              После пара тело отзывается совершенно иначе — работа с телом часто
              становится частью банного вечера.
            </p>
          </div>

          <p className="relax-price-note">
            Прайса нет — длительность и состав сеанса подбирает мастер под
            запрос. Цена обсуждается заранее, в звонке.
          </p>
        </div>
      </div>
    </section>
  );
}

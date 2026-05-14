export function RelaxApproach() {
  return (
    <section className="zone warm" aria-label="Подход">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Подход
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 36px",
            letterSpacing: "-.01em",
          }}
        >
          Как мы работаем
        </h2>
        <div className="relax-approach">
          <p>
            Никакого протокола, никаких «зон» и никаких «обязательных техник». Мы
            работаем от того, что в теле сейчас.
          </p>
          <p>
            Перед сеансом можно коротко рассказать, что беспокоит, где зажато или
            просто что хочется отпустить. Этого достаточно — остальное мастер
            видит сам, через касание.
          </p>
          <p>
            Сеанс длится час, полтора, иногда два. Без таймера на стене. Когда
            тело отпустило — мы заканчиваем.
          </p>
        </div>
      </div>
    </section>
  );
}

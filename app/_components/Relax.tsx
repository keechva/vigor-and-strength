export function Relax() {
  return (
    <section className="zone cool" id="relax" aria-label="Релаксология">
      <div className="wrap">
        <div className="practice relax">
          <div className="vid-wrap" style={{ position: "relative" }}>
            <div
              className="video-slot"
              role="img"
              aria-label="Видео: релаксология — руки, ткани, тишина"
            >
              <div className="vs-corner">video · 16:9</div>
              <div className="vs-play" aria-hidden="true" />
              <div className="vs-label">руки · ткани · тишина</div>
              <div className="vs-time">02:12</div>
            </div>
            <div className="warm-chip" aria-hidden="true" />
          </div>

          <div className="copy">
            <div className="meta">02</div>
            <h2>Релакс&shy;ология</h2>
            <p>
              Слово непривычное — но точное. Тактильная работа с телом: руки
              находят, что в нём застряло, и помогают этому уйти. Это не массаж
              и не процедура — это другое ремесло. У каждого релаксолога свой
              подход и свой ритм.
            </p>
            <a className="cta" href="/relax">
              Подробнее&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Banya() {
  return (
    <section className="zone warm" id="banya" aria-label="Баня">
      <div className="wrap">
        <div className="practice">
          <div className="copy">
            <div className="meta">01 · Направление</div>
            <h2>Баня</h2>
            <p>
              Баня — это вечер, который вы себе устраиваете. Не процедура. Парим
              спокойно, с веником и чаем, иногда добавляем работу с телом после
              пара. Собираете под себя — один или компанией до пятнадцати
              человек.
            </p>
            <a className="cta" href="/banya">
              Подробнее&nbsp;→
            </a>
          </div>

          <div style={{ position: "relative" }}>
            <div
              className="video-slot"
              role="img"
              aria-label="Видео: баня — пар, веник, чай"
            >
              <div className="vs-corner">video · 16:9</div>
              <div className="vs-play" aria-hidden="true" />
              <div className="vs-label">пар · веник · чай</div>
              <div className="vs-time">01:38</div>
            </div>
            <div className="cold-chip" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function RelaxCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/banya">
            <span className="cl-eyebrow">Хорошо сочетается</span>
            <h3 className="cl-title">Баня</h3>
            <span className="cl-arrow">
              Работа с телом после пара глубже и спокойнее&nbsp;→
            </span>
          </a>
          <a className="crosslink" href="/locations">
            <span className="cl-eyebrow">Где это происходит</span>
            <h3 className="cl-title">Локации</h3>
            <span className="cl-arrow">Все локации&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

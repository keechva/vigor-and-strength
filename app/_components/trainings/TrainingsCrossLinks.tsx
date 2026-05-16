export function TrainingsCrossLinks() {
  return (
    <section className="zone cool" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/banya">
            <span className="cl-eyebrow">Хорошо сочетается</span>
            <h3 className="cl-title">Баня</h3>
            <span className="cl-arrow">
              После тренировки парение глубже&nbsp;→
            </span>
          </a>
          <a className="crosslink" href="/relax">
            <span className="cl-eyebrow">Хорошо сочетается</span>
            <h3 className="cl-title">Релаксология</h3>
            <span className="cl-arrow">
              Восстановление после нагрузки&nbsp;→
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

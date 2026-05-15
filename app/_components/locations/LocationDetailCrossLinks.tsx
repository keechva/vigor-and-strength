export function LocationDetailCrossLinks() {
  return (
    <section className="zone warm" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/locations">
            <span className="cl-eyebrow">Назад</span>
            <h3 className="cl-title">Все локации</h3>
            <span className="cl-arrow">Карта мест&nbsp;→</span>
          </a>
          <a className="crosslink" href="/">
            <span className="cl-eyebrow">На&nbsp;главную</span>
            <h3 className="cl-title">Бодрость и&nbsp;Сила</h3>
            <span className="cl-arrow">Обо всём проекте&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

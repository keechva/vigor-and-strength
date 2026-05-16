export function MasterDetailCrossLinks() {
  return (
    <section className="zone warm" aria-label="Связанные разделы">
      <div className="wrap">
        <div className="crosslinks">
          <a className="crosslink" href="/masters">
            <span className="cl-eyebrow">Назад в&nbsp;команду</span>
            <h3 className="cl-title">Все мастера</h3>
            <span className="cl-arrow">Кто ещё работает&nbsp;→</span>
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

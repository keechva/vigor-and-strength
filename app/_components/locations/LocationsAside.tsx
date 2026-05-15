export function LocationsAside() {
  return (
    <section className="zone warm" aria-label="Особый формат">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Особый формат
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 24px",
            letterSpacing: "-.01em",
          }}
        >
          Выезд к&nbsp;клиенту
        </h2>
        <p style={{ maxWidth: 720, marginBottom: 16 }}>
          Не&nbsp;все встречи требуют адреса. Выезд&nbsp;— отдельный формат,
          работает везде по&nbsp;Оренбургу и&nbsp;области.
        </p>
        <p style={{ maxWidth: 720, marginBottom: 32 }}>
          Привозим всё нужное&nbsp;— пар-мастер с&nbsp;веничным набором,
          релаксолог со&nbsp;столом и&nbsp;маслами. Подбираем формат под место
          и&nbsp;компанию.
        </p>
        <a className="cta" href="/banya#contact">
          Записаться на&nbsp;выезд&nbsp;→
        </a>
      </div>
    </section>
  );
}

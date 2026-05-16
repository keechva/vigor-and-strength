export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="grid">
          <div>
            <div className="brand">Бодрость и Сила</div>
            <p
              style={{
                opacity: 0.65,
                fontSize: 13,
                maxWidth: "32ch",
                marginTop: 12,
              }}
            >
              Баня, релаксология и тренировки. Три направления, одно пространство
              — без обещаний, без «гармонии», просто ремесло.
            </p>
            <div className="social" aria-label="Соцсети">
              <span>VK</span>
              <span>TG</span>
            </div>
          </div>

          <div>
            <h4>Направления</h4>
            <ul>
              <li>
                <a href="/banya">Баня</a>
              </li>
              <li>
                <a href="/relax">Релаксология</a>
              </li>
              <li>
                <a href="/trainings">Тренировки</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Проект</h4>
            <ul>
              <li>
                <a href="/masters">Мастера</a>
              </li>
              <li>
                <a href="/locations">Локации</a>
              </li>
              <li>
                <a href="#contact">Связаться</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Контакты</h4>
            <ul>
              <li>
                <span className="placeholder">+7 ___ ___-__-__</span>
              </li>
              <li>
                <span className="placeholder">hello@bodrost-sila.ru</span>
              </li>
              <li>
                <span className="placeholder">Самолётная, 59</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="legal">
          <div>
            <span className="placeholder">ИНН 0000000000</span>
            &nbsp;·&nbsp;
            <span className="placeholder">ОГРНИП 000000000000000</span>
            &nbsp;·&nbsp;
            <span className="placeholder">
              Юр. адрес: [заменить перед запуском]
            </span>
          </div>
          <div>
            © 2026 Бодрость и Сила &nbsp;·&nbsp;{" "}
            <a href="/privacy">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

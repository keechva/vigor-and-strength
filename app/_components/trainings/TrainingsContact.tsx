"use client";

import { type FormEvent } from "react";

export function TrainingsContact() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Заявка /trainings:", data);
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Лист ожидания">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>В&nbsp;лист ожидания</h2>
            <p className="helper">
              Расскажите что интересно — кунгфу индивидуально, группа, или
              ждёте медитаций и дыхания. Соберём первый набор, когда наберём
              состав.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <input type="hidden" name="page" value="trainings" />

            <label className="full">
              Имя
              <input
                type="text"
                name="name"
                placeholder="Как к вам обращаться"
                required
              />
            </label>
            <label className="full">
              Телефон
              <input
                type="tel"
                name="phone"
                placeholder="+7 ___ ___-__-__"
                required
              />
            </label>

            <label className="full">
              Что интересно
              <select name="interest" defaultValue="">
                <option value="">Не определился</option>
                <option value="kungfu-individual">Кунгфу индивидуально</option>
                <option value="kungfu-group">Кунгфу в группе</option>
                <option value="meditation">Медитации (когда появятся)</option>
                <option value="breathing">Дыхание (когда появится)</option>
                <option value="workshops">
                  Открытые мастерские (когда появятся)
                </option>
              </select>
            </label>

            <label className="full">
              Чего ожидаете от тренировок
              <textarea
                name="message"
                placeholder="Есть ли опыт, цели, ограничения здоровья, удобные дни и время."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit">
                Оставить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы соглашаетесь с обработкой
                персональных данных.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

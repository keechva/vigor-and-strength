"use client";

import { type FormEvent } from "react";

export function Contact() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Связаться">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Связаться</div>
            <h2>Оставьте&nbsp;заявку</h2>
            <p className="helper">
              Перезвоним и согласуем удобное время. Если ещё не определились,
              какое направление вам ближе — это нормально, разберёмся вместе.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <label>
              Имя
              <input
                type="text"
                name="name"
                placeholder="Как к вам обращаться"
                required
              />
            </label>
            <label>
              Телефон
              <input
                type="tel"
                name="phone"
                placeholder="+7 ___ ___-__-__"
                required
              />
            </label>

            <label className="full">
              Направление
              <select name="direction" defaultValue="Баня">
                <option>Баня</option>
                <option>Релаксология</option>
                <option>Тренировки (лист ожидания)</option>
                <option>Не определился</option>
              </select>
            </label>

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Когда удобно, сколько человек, особые пожелания"
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit">
                Отправить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Отправить», вы соглашаетесь с обработкой персональных
                данных.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

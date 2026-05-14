"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  BANYA_APPLY_EVENT,
  type BanyaApplyDetail,
} from "./BanyaConfigurator";

export function BanyaContact() {
  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState("Баня");

  useEffect(() => {
    function onApply(e: Event) {
      const detail = (e as CustomEvent<BanyaApplyDetail>).detail;
      if (!detail) return;
      setMessage(detail.message);
      setDirection(detail.direction);
    }
    window.addEventListener(BANYA_APPLY_EVENT, onApply);
    return () => window.removeEventListener(BANYA_APPLY_EVENT, onApply);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Связаться">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Записаться</div>
            <h2>Оставьте&nbsp;заявку</h2>
            <p className="helper">
              Перезвоним, согласуем удобное время и назовём ориентир по цене.
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
              <select
                name="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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

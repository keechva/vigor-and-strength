"use client";

import { type FormEvent } from "react";
import { MASTERS } from "@/app/_lib/data/masters";

const RELAX_MASTERS = MASTERS.filter((m) => m.directions.includes("relax"));

export function RelaxContact() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Заявка /relax:", data);
    alert("Заявка отправлена (демо)");
  }

  return (
    <section className="zone neutral-light" id="contact" aria-label="Связаться">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>Запишитесь к&nbsp;мастеру</h2>
            <p className="helper">
              Опишите, что беспокоит или что хочется. Перезвоним, согласуем
              время, мастера и формат.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
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
              Мастер
              <select name="master">
                <option>Не определился</option>
                {RELAX_MASTERS.map((m) => (
                  <option key={m.name}>{m.name}</option>
                ))}
              </select>
            </label>

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Что беспокоит, какой формат удобнее, есть ли пожелания по мастеру."
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

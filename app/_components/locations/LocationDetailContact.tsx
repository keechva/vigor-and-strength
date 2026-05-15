"use client";

import { type FormEvent } from "react";
import type { Location } from "@/app/_lib/data/locations";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  training: "Тренировки",
};

export function LocationDetailContact({ location }: { location: Location }) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Заявка /locations:", data);
    alert("Заявка отправлена (демо)");
  }

  return (
    <section
      className="zone neutral-light"
      id="contact"
      aria-label="Связаться"
    >
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <div className="meta">Запись</div>
            <h2>Записаться в&nbsp;{location.name}</h2>
            <p className="helper">
              Перезвоним, согласуем время и&nbsp;формат.
            </p>
          </div>

          <form className="lead-form" onSubmit={onSubmit}>
            <input
              type="hidden"
              name="locationSlug"
              value={location.slug}
            />

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
              Направление
              <select name="direction">
                <option>Не определился</option>
                {location.directions.map((d) => (
                  <option key={d} value={d}>
                    {DIRECTION_LABELS[d] || d}
                  </option>
                ))}
              </select>
            </label>

            {location.masters.length > 0 && (
              <label className="full">
                Мастер
                <select name="master">
                  <option>Не определился</option>
                  {location.masters.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="full">
              Пожелания
              <textarea
                name="message"
                placeholder="Когда удобно, состав, особые пожелания."
              />
            </label>

            <div className="submit-row">
              <button className="cta" type="submit">
                Оставить заявку&nbsp;→
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы&nbsp;соглашаетесь с&nbsp;обработкой
                персональных данных.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

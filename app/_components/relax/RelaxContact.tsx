"use client";

import { type FormEvent, useState } from "react";
import { MASTERS } from "@/app/_lib/data/masters";
import { sendLead } from "@/app/_lib/sendLead";

const RELAX_MASTERS = MASTERS.filter((m) => m.directions.includes("relax"));

export function RelaxContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("idle");
    setErrorMessage(undefined);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const masterRaw = String(fd.get("master") ?? "");

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: "relax",
      direction: "relax",
      master: masterRaw && masterRaw !== "Не определился" ? masterRaw : undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
    });

    if (res.ok) {
      setResult("success");
      form.reset();
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
    setIsSubmitting(false);
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
              <button className="cta" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : "Оставить заявку →"}
              </button>
              <div className="terms">
                Нажимая «Оставить заявку», вы соглашаетесь с обработкой
                персональных данных.
              </div>
            </div>

            {result === "success" && (
              <p className="form-result form-result--ok">
                Заявка принята. Перезвоним в&nbsp;ближайшее время.
              </p>
            )}
            {result === "error" && (
              <p className="form-result form-result--error">
                {errorMessage ||
                  "Что-то пошло не так. Попробуйте ещё раз или напишите в Telegram."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

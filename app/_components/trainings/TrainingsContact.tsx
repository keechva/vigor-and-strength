"use client";

import { type FormEvent, useState } from "react";
import { sendLead } from "@/app/_lib/sendLead";

export function TrainingsContact() {
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
    const interestRaw = String(fd.get("interest") ?? "");

    const res = await sendLead({
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      source: "trainings",
      direction: "trainings",
      interest: interestRaw || undefined,
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

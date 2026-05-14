"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Addon = {
  id: string;
  num: string;
  title: string;
  desc: string;
  visualKind: "видео" | "фото";
  fullText: ReactNode;
};

const ADDONS: Addon[] = [
  {
    id: "venik",
    num: "A · 01",
    title: "Веник",
    desc: "Берёза, дуб, эвкалипт, хвоя и др. — обсуждаем заранее или выбираем на месте.",
    visualKind: "видео",
    fullText:
      "Веник — основа русской бани. У нас есть берёза для мягкого пара, дуб для тяжёлого и интенсивного, эвкалипт для дыхательной системы, хвоя для самой жёсткой работы. Можно собрать микс под цель — например, берёза + эвкалипт для общего восстановления. Веники мы готовим сами или берём у проверенных банщиков. Обсуждаем заранее или подбираем на месте — по тому, как тело отзывается на пар.",
  },
  {
    id: "scrub",
    num: "A · 02",
    title: "Скрабирование",
    desc: "Между заходами — мягкая работа с кожей.",
    visualKind: "фото",
    fullText:
      "Между заходами в парную делаем скрабирование. Соль или кофейная масса — на прогретой коже работают совершенно иначе, чем в домашней ванной. Кожа становится мягкой, открытой, лучше воспринимает следующий заход. Это не косметическая процедура, а часть банного ритма — подготовка тела к следующему этапу.",
  },
  {
    id: "aroma",
    num: "A · 03",
    title: "Ароматерапия",
    desc: "Эфирные масла на пар. По настроению или под цель.",
    visualKind: "фото",
    fullText:
      "На раскалённые камни — несколько капель эфирных масел. Пар приобретает характер: хвоя для бодрости и дыхания, мята для холода в голове и ясности, лаванда для расслабления к концу вечера. Используем чистые масла без отдушек. Выбор аромата подстраивается под программу и настроение.",
  },
  {
    id: "sound",
    num: "A · 04",
    title: "Звукотерапия",
    desc: "Поющие чаши в моменты тишины между заходами.",
    visualKind: "видео",
    fullText:
      "Поющие чаши и гонг — в паузах между заходами. Тело уже расслаблено паром, и вибрация звука попадает в него глубже, чем в обычном состоянии. Это не музыка фоном — это отдельный этап вечера, который мы держим в тишине, без разговоров. Обычно 10–15 минут.",
  },
  {
    id: "tea",
    num: "A · 05",
    title: "Чай",
    desc: "Травяные сборы, согревающие или восстанавливающие.",
    visualKind: "фото",
    fullText:
      "Травяные сборы своего приготовления. Согревающий перед заходом — имбирь, корица, шиповник. Восстанавливающий после — мята, мелисса, ромашка. Травяной в любой момент — иван-чай, шалфей, чабрец. Чай — это пауза, в которую мы возвращаем телу баланс между заходами.",
  },
  {
    id: "tactile",
    num: "A · 06",
    title: "Работа с телом после пара",
    desc: "Тактильное восстановление руками мастера. Не массаж — отдельное ремесло.",
    visualKind: "видео",
    fullText: (
      <>
        Тактильное восстановление руками мастера. После пара тело отзывается на
        касание иначе: мышцы прогретые, дыхание глубокое, нервная система
        спокойна. Работа идёт по ощущениям тела — не по точкам и не по таймеру.
        Часто это и есть кульминация вечера, после которой остальное уже не
        нужно. Подробнее о подходе — в разделе{" "}
        <a href="/relax">Релаксология</a>.
      </>
    ),
  },
  {
    id: "four_hands",
    num: "A · 07",
    title: "В четыре руки",
    desc: "Два мастера одновременно — это другой уровень глубины и работы с телом.",
    visualKind: "видео",
    fullText:
      "Два мастера работают с вами одновременно. Один ведёт пар, второй параллельно делает работу с телом — или оба работают руками. Это не «быстрее», а глубже — тело получает в полтора-два раза больше внимания за то же время, и эффект другого уровня. Обычно берётся в составе программы «Интенсив», но можно добавить к любой программе.",
  },
];

export function BanyaAddons() {
  const [selected, setSelected] = useState<string | null>(null);

  const active = ADDONS.find((a) => a.id === selected) ?? null;

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <section className="zone warm" aria-label="Допники">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Допники
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(40px, 6vw, 86px)",
            lineHeight: 0.98,
            fontWeight: 500,
            margin: "0 0 36px",
            letterSpacing: "-.01em",
          }}
        >
          Что можно добавить
        </h2>
        <div className="cards col-3">
          {ADDONS.map((a) => (
            <article
              key={a.id}
              className="card banya-addon-card"
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={() => setSelected(a.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(a.id);
                }
              }}
            >
              <div className="card-num">{a.num}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="banya-addon-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="banya-addon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="banya-addon-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="banya-addon-modal__close"
              aria-label="Закрыть"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <h3
              id="banya-addon-modal-title"
              className="banya-addon-modal__title"
            >
              {active.title}
            </h3>
            <div className="banya-addon-modal__visual" aria-hidden="true">
              [{active.visualKind} — {active.id}]
            </div>
            <div className="banya-addon-modal__text">{active.fullText}</div>
          </div>
        </div>
      )}
    </section>
  );
}

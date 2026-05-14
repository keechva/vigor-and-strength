"use client";

import { useState } from "react";

const ADDON_LABELS: Record<string, string> = {
  venik: "веник",
  scrub: "скрабирование",
  aroma: "ароматерапия",
  sound: "звукотерапия",
  tea: "чай",
  tactile: "работа с телом после пара",
};

const PROGRAM_PRESETS: Record<string, string[]> = {
  klassika: ["venik", "tea"],
  vosstanovlenie: ["scrub", "tactile", "tea"],
  sensornaya: ["aroma", "sound"],
  v_4_ruki: ["tactile"],
  polny_relaks: ["venik", "scrub", "aroma", "sound", "tea", "tactile"],
  kompaniya: [],
};

const PROGRAM_LABELS: Record<string, string> = {
  klassika: "Классика",
  vosstanovlenie: "Восстановление",
  sensornaya: "Сенсорная",
  v_4_ruki: "В четыре руки",
  polny_relaks: "Полный релакс",
  kompaniya: "Компания",
};

export const BANYA_APPLY_EVENT = "banya:apply";

export type BanyaApplyDetail = {
  direction: "Баня";
  message: string;
};

export function BanyaConfigurator() {
  const [people, setPeople] = useState(1);
  const [addons, setAddons] = useState<string[]>([]);
  const [program, setProgram] = useState<string>("");

  function toggleAddon(key: string) {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function pickProgram(key: string) {
    setProgram(key);
    if (key && PROGRAM_PRESETS[key]) {
      setAddons(PROGRAM_PRESETS[key]);
    }
  }

  function changePeople(delta: number) {
    setPeople((p) => Math.max(1, Math.min(15, p + delta)));
  }

  function buildSummary(): string {
    const parts: string[] = ["Парение"];
    parts.push(`${people} ${peopleWord(people)}`);
    if (program && PROGRAM_LABELS[program]) {
      parts.push(`программа: ${PROGRAM_LABELS[program]}`);
    }
    for (const k of addons) {
      if (ADDON_LABELS[k]) parts.push(ADDON_LABELS[k]);
    }
    return parts.join(" · ");
  }

  function handleApply() {
    const detail: BanyaApplyDetail = {
      direction: "Баня",
      message: buildSummary(),
    };
    window.dispatchEvent(new CustomEvent(BANYA_APPLY_EVENT, { detail }));
    const target = document.getElementById("contact");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const summary = buildSummary();

  return (
    <section className="zone warm" id="configurator" aria-label="Конфигуратор">
      <div className="wrap">
        <div className="meta" style={{ marginBottom: 16 }}>
          Конфигуратор
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
          Соберите вечер
        </h2>

        <div className="banya-config">
          <div className="banya-config__row">
            <span className="banya-config__label">Количество человек</span>
            <div className="banya-config__counter">
              <button
                type="button"
                aria-label="Меньше"
                onClick={() => changePeople(-1)}
              >
                −
              </button>
              <span className="banya-config__count">{people}</span>
              <button
                type="button"
                aria-label="Больше"
                onClick={() => changePeople(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="banya-config__row banya-config__row--col">
            <span className="banya-config__label">Программа (опционально)</span>
            <div className="banya-config__chips">
              <button
                type="button"
                className={`banya-config__chip${program === "" ? " is-active" : ""}`}
                onClick={() => {
                  setProgram("");
                }}
              >
                Без программы
              </button>
              {Object.entries(PROGRAM_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`banya-config__chip${program === key ? " is-active" : ""}`}
                  onClick={() => pickProgram(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="banya-config__row banya-config__row--col">
            <span className="banya-config__label">Допники</span>
            <div className="banya-config__chips">
              {Object.entries(ADDON_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`banya-config__chip${addons.includes(key) ? " is-active" : ""}`}
                  onClick={() => toggleAddon(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="banya-config__summary">
            <div className="banya-config__summary-label">Состав</div>
            <div className="banya-config__summary-text">{summary}</div>
          </div>

          <button
            type="button"
            className="cta banya-config__submit"
            onClick={handleApply}
          >
            Оставить заявку&nbsp;→
          </button>
        </div>
      </div>
    </section>
  );
}

function peopleWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "человек";
  if (mod10 === 1) return "человек";
  if (mod10 >= 2 && mod10 <= 4) return "человека";
  return "человек";
}

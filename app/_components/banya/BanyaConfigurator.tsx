"use client";

import { useState } from "react";

const ADDON_LABELS: Record<string, string> = {
  venik: "веник",
  scrub: "скрабирование",
  aroma: "ароматерапия",
  sound: "звукотерапия",
  tea: "чай",
  tactile: "работа с телом после пара",
  four_hands: "в четыре руки",
};

const ADDON_TOOLTIPS: Record<string, string> = {
  venik: "Берёза, дуб, эвкалипт, хвоя. Выбираем заранее или на месте.",
  scrub: "Соль или кофе. На прогретой коже эффект иной.",
  aroma: "Эфирные масла на камни — пар приобретает характер.",
  sound: "Поющие чаши в паузах между заходами.",
  tea: "Сборы своего приготовления — согревающие или восстанавливающие.",
  tactile:
    "Тактильное восстановление. После пара мышцы и кожа отзываются иначе.",
  four_hands:
    "Два мастера работают одновременно — другой уровень глубины.",
};

type Program = {
  key: string;
  name: string;
  desc: string;
  composition: string[];
};

const PROGRAMS: Program[] = [
  {
    key: "klassika",
    name: "Знакомство",
    desc: "Для тех, кто впервые. Спокойное парение и чай — без лишних слоёв, чтобы понять, как вам подходит.",
    composition: ["venik", "tea"],
  },
  {
    key: "vosstanovlenie",
    name: "Восстановление",
    desc: "Когда тело устало и нужно его отпустить. После плотной недели, дальней дороги или тяжёлой тренировки.",
    composition: ["scrub", "tactile", "tea"],
  },
  {
    key: "sensornaya",
    name: "Сенсорная",
    desc: "Когда хочется не телесной нагрузки, а ощущения момента. С ароматами и звуком — без интенсивной работы с телом.",
    composition: ["aroma", "sound"],
  },
  {
    key: "intensiv",
    name: "Интенсив",
    desc: "Когда обычной бани мало. Два мастера работают одновременно — это короче по времени и глубже по эффекту.",
    composition: ["tactile", "four_hands"],
  },
  {
    key: "polny_relaks",
    name: "Не торопиться",
    desc: "Когда хочется выключиться полностью. Всё включено, без счёта времени — от двух часов и больше.",
    composition: ["venik", "scrub", "aroma", "sound", "tea", "tactile"],
  },
  {
    key: "kompaniya",
    name: "Компанией",
    desc: "Для дней рождения, мальчишников, корпоративов, сборов после походов. До пятнадцати человек, программу подстраиваем под группу.",
    composition: [],
  },
];

export const BANYA_APPLY_EVENT = "banya:apply";

export type BanyaApplyDetail = {
  direction: "Баня";
  message: string;
  program?: string;
  people?: number;
  addons?: string[];
};

export function BanyaConfigurator() {
  const [program, setProgram] = useState<string>("");
  const [people, setPeople] = useState(1);
  const [addons, setAddons] = useState<string[]>([]);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  function selectProgram(key: string) {
    if (program === key) {
      setProgram("");
      return;
    }
    const p = PROGRAMS.find((x) => x.key === key);
    if (!p) return;
    setProgram(key);
    setAddons(p.composition);
  }

  function selectCustom() {
    setProgram("");
    setAddons([]);
  }

  function toggleAddon(key: string) {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function changePeople(delta: number) {
    setPeople((p) => Math.max(1, Math.min(15, p + delta)));
  }

  function toggleTooltip(key: string) {
    setOpenTooltip((cur) => (cur === key ? null : key));
  }

  function buildSummary(): string {
    const parts: string[] = ["Парение"];
    parts.push(`${people} ${peopleWord(people)}`);
    const prog = PROGRAMS.find((p) => p.key === program);
    if (prog) parts.push(`программа: ${prog.name}`);
    for (const k of addons) {
      if (ADDON_LABELS[k]) parts.push(ADDON_LABELS[k]);
    }
    return parts.join(" · ");
  }

  function handleApply() {
    const detail: BanyaApplyDetail = {
      direction: "Баня",
      message: buildSummary(),
      program: program || undefined,
      people,
      addons: addons.length > 0 ? addons : undefined,
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

        <p className="banya-config-note">
          Прайса как такового нет — слишком много переменных. Соберите состав
          ниже, и мы назовём вилку.
        </p>

        <div className="banya-config">
          <div className="banya-config__step">
            <div className="banya-config__step-label">
              Шаг 1. С чего начнём?
            </div>
            <div className="banya-config__programs">
              {PROGRAMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`banya-config__program-card${program === p.key ? " is-active" : ""}`}
                  aria-pressed={program === p.key}
                  onClick={() => selectProgram(p.key)}
                >
                  <span className="banya-config__program-title">{p.name}</span>
                  <span className="banya-config__program-desc">{p.desc}</span>
                  <span className="banya-config__program-composition">
                    {p.composition.length
                      ? p.composition.map((k) => ADDON_LABELS[k]).join(" · ")
                      : "Базовое парение"}
                  </span>
                </button>
              ))}
              <button
                type="button"
                className={`banya-config__program-card is-custom${program === "" ? " is-active" : ""}`}
                aria-pressed={program === ""}
                onClick={selectCustom}
              >
                <span className="banya-config__program-title">
                  Собрать самому
                </span>
                <span className="banya-config__program-desc">
                  Если ни одна из программ не подходит — настройте состав с
                  нуля.
                </span>
              </button>
            </div>
          </div>

          <div className="banya-config__step">
            <div className="banya-config__step-label">
              Шаг 2. Количество человек
            </div>
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

          <div className="banya-config__step">
            <div className="banya-config__step-label">Шаг 3. Допники</div>
            <p className="banya-config__hint">
              Если выбрана программа — допники подсвечены по её составу. Можно
              добавить или убрать.
            </p>
            <div className="banya-config__chips">
              {Object.entries(ADDON_LABELS).map(([key, label]) => (
                <div key={key} className="banya-config__addon">
                  <button
                    type="button"
                    className={`banya-config__chip${addons.includes(key) ? " is-active" : ""}`}
                    onClick={() => toggleAddon(key)}
                  >
                    {label}
                  </button>
                  <button
                    type="button"
                    className="banya-config__addon-info"
                    aria-label={`Подробнее: ${label}`}
                    onClick={() => toggleTooltip(key)}
                  >
                    ⓘ
                  </button>
                  <span
                    className={`banya-config__addon-tooltip${openTooltip === key ? " is-open" : ""}`}
                    role="tooltip"
                  >
                    {ADDON_TOOLTIPS[key]}
                  </span>
                </div>
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

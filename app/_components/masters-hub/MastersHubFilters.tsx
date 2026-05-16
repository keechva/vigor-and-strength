"use client";

export type MastersHubFilterValue = "all" | "banya" | "relax" | "trainings";

type Props = {
  selected: MastersHubFilterValue;
  onChange: (value: MastersHubFilterValue) => void;
};

const OPTIONS: { value: MastersHubFilterValue; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "banya", label: "Баня" },
  { value: "relax", label: "Релаксология" },
  { value: "trainings", label: "Тренировки" },
];

export function MastersHubFilters({ selected, onChange }: Props) {
  return (
    <section className="zone warm" aria-label="Фильтр по направлению">
      <div className="wrap">
        <div className="meta">Команда</div>
        <h2 className="masters-hub-title">Кто работает</h2>

        <div className="masters-hub-filters" role="tablist">
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`masters-hub-filter${isActive ? " is-active" : ""}`}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

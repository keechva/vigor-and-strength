import { MASTERS, type Direction } from "../../_lib/data/masters";
import { MasterCard } from "../Masters";
import type { MastersHubFilterValue } from "./MastersHubFilters";

type Props = {
  filterDirection: MastersHubFilterValue;
};

export function MastersHubGrid({ filterDirection }: Props) {
  const list =
    filterDirection === "all"
      ? MASTERS
      : MASTERS.filter((m) =>
          m.directions.includes(filterDirection as Direction),
        );

  return (
    <section
      className="zone warm"
      aria-label="Список мастеров"
      style={{ paddingTop: 0 }}
    >
      <div className="wrap">
        {list.length === 0 ? (
          <p className="banya-hero-lead">
            Нет мастеров в&nbsp;этом направлении.
          </p>
        ) : (
          <div className="masters-hub-grid">
            {list.map((m) => (
              <MasterCard key={m.name} master={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

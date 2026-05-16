import type { Master } from "@/app/_lib/data/masters";

export function MasterDetailBio({ master }: { master: Master }) {
  return (
    <section className="zone warm" aria-label={`О мастере ${master.name}`}>
      <div className="wrap">
        <div className="meta">О себе</div>
        <h2>Кто я</h2>
        <p className="master-detail-bio__text">{master.bioFull}</p>
      </div>
    </section>
  );
}

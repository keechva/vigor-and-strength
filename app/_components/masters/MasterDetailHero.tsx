import type { Master } from "@/app/_lib/data/masters";

const DIRECTION_LABELS: Record<string, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Кунгфу",
};

export function MasterDetailHero({ master }: { master: Master }) {
  return (
    <section className="hero">
      <div className="hero-sub">
        <div className="wrap">
          <div className="breadcrumb">
            <a href="/">Главная</a> / <a href="/masters">Мастера</a> /{" "}
            {master.name}
          </div>

          <div className="master-detail-hero">
            <div className="master-detail-hero__visual" aria-hidden="true">
              <div className="master-detail-hero__portrait">
                [фото — {master.name}]
              </div>
            </div>

            <div className="master-detail-hero__body">
              <h1>{master.name}</h1>
              <div className="master-detail-hero__role">{master.role}</div>
              <div className="master-detail-hero__tags">
                {master.directions
                  .map((d) => DIRECTION_LABELS[d] ?? d)
                  .join(" · ")}
              </div>
              <p className="master-detail-hero__tagline">{master.tagline}</p>
              <a href="#contact" className="master-detail-hero__cta cta">
                Записаться к&nbsp;{master.name}&nbsp;→
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

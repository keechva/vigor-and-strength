type Master = {
  name: string;
  role: string;
  tags: string;
  bio: string;
};

const MASTERS: Master[] = [
  {
    name: "Дмитрий",
    role: "Мастер",
    tags: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · 2–3 фразы о Дмитрии: что ведёт, как работает, какая интонация.]",
  },
  {
    name: "Александр",
    role: "Мастер",
    tags: "Баня · Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Вадим",
    role: "Мастер",
    tags: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Анна",
    role: "Мастер",
    tags: "Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
];

function MasterCard({
  master,
  ariaHidden = false,
}: {
  master: Master;
  ariaHidden?: boolean;
}) {
  return (
    <article
      className={ariaHidden ? "master master--clone" : "master"}
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    >
      <div className="portrait" />
      <h3 className="name">{master.name}</h3>
      <div className="role">{master.role}</div>
      <div className="tags">{master.tags}</div>
      <p className="bio">{master.bio}</p>
    </article>
  );
}

export function Masters() {
  return (
    <section className="zone warm" id="masters" aria-label="Мастера">
      <div className="wrap" style={{ position: "relative" }}>
        <div className="masters-cold-dot" aria-hidden="true" />

        <div className="masters-head">
          <div>
            <div className="meta">Команда</div>
            <h2>Мастера</h2>
          </div>
          <a className="cta" href="/masters">
            Все мастера&nbsp;→
          </a>
        </div>
      </div>

      <div className="masters-strip" role="region" aria-label="Лента мастеров">
        <div className="masters-track">
          {MASTERS.map((m) => (
            <MasterCard key={`a-${m.name}`} master={m} />
          ))}
          {MASTERS.map((m) => (
            <MasterCard key={`b-${m.name}`} master={m} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}

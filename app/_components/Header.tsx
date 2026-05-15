"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#banya", label: "Баня" },
  { href: "/#relax", label: "Релаксология" },
  { href: "/#training", label: "Тренировки" },
  { href: "/#masters", label: "Мастера" },
  { href: "/locations", label: "Локации" },
  { href: "/#contact", label: "Связаться" },
];

export function Header() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsRevealed(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`site-header${isRevealed ? " is-revealed" : ""}`}
        data-state={isRevealed ? "revealed" : "hidden"}
      >
        <div className="wrap">
          <a className="brand" href="/">
            бодрость&nbsp;и&nbsp;сила
          </a>

          <nav className="site-header__desktop-nav" aria-label="Основная навигация">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="site-header-menu"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div
        id="site-header-menu"
        className={`site-header__menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Меню">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

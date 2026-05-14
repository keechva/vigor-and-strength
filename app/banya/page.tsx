import type { Metadata } from "next";
import { BanyaHero } from "../_components/banya/BanyaHero";
import { BanyaIntro } from "../_components/banya/BanyaIntro";
import { BanyaAddons } from "../_components/banya/BanyaAddons";
import { BanyaConfigurator } from "../_components/banya/BanyaConfigurator";
import { BanyaCrossLinks } from "../_components/banya/BanyaCrossLinks";
import { BanyaContact } from "../_components/banya/BanyaContact";
import { Masters } from "../_components/Masters";
import { Footer } from "../_components/Footer";

export const metadata: Metadata = {
  title: "Баня — Бодрость и Сила",
  description:
    "Парим спокойно, с веником и чаем. Один или компанией до 15 человек. Выезд, партнёрские бани, своя локация в разработке.",
};

export default function BanyaPage() {
  return (
    <main>
      <BanyaHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <BanyaIntro />
      <BanyaAddons />
      <BanyaConfigurator />
      <Masters
        title="Мастера"
        filterDirection="banya"
        ctaHref="/masters"
        ctaLabel="Все мастера&nbsp;→"
      />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <BanyaCrossLinks />
      <div className="bridge-cool-to-neutral" aria-hidden="true" />
      <BanyaContact />
      <div className="bridge-cool-to-darkneutral" aria-hidden="true" />
      <Footer />
    </main>
  );
}

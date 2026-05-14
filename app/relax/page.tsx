import type { Metadata } from "next";
import { RelaxHero } from "@/app/_components/relax/RelaxHero";
import { RelaxIntro } from "@/app/_components/relax/RelaxIntro";
import { RelaxApproach } from "@/app/_components/relax/RelaxApproach";
import { Masters } from "@/app/_components/Masters";
import { RelaxCrossLinks } from "@/app/_components/relax/RelaxCrossLinks";
import { RelaxContact } from "@/app/_components/relax/RelaxContact";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Релаксология — Бодрость и Сила",
  description:
    "Тактильное восстановление и работа с телом руками — мягко, медленно, по ощущениям. Выезд по Оренбургу, партнёрские студии, своя локация в разработке.",
};

export default function RelaxPage() {
  return (
    <main>
      <RelaxHero />
      <div className="bridge-cool-in" aria-hidden="true" />
      <RelaxIntro />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <RelaxApproach />
      <Masters filterDirection="relax" />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <RelaxCrossLinks />
      <RelaxContact />
      <Footer />
    </main>
  );
}

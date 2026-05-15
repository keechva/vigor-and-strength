import type { Metadata } from "next";
import { LocationsHero } from "@/app/_components/locations/LocationsHero";
import { LocationsGrid } from "@/app/_components/locations/LocationsGrid";
import { LocationsAside } from "@/app/_components/locations/LocationsAside";
import { LocationsCrossLinks } from "@/app/_components/locations/LocationsCrossLinks";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Локации — Бодрость и Сила",
  description:
    "Где мы работаем: своя локация на Самолётной 59 (в разработке), партнёрские бани и загородный клуб в Оренбурге. Также — выезд к клиенту.",
};

export default function LocationsPage() {
  return (
    <main>
      <LocationsHero />
      <div className="bridge-cool-in" aria-hidden="true" />
      <LocationsGrid />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <LocationsAside />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <LocationsCrossLinks />
      <Footer />
    </main>
  );
}

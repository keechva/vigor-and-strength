import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS, getLocationBySlug } from "@/app/_lib/data/locations";
import { LocationDetailHero } from "@/app/_components/locations/LocationDetailHero";
import { LocationDetailInfo } from "@/app/_components/locations/LocationDetailInfo";
import { LocationDetailDirections } from "@/app/_components/locations/LocationDetailDirections";
import { LocationDetailMasters } from "@/app/_components/locations/LocationDetailMasters";
import { LocationDetailContact } from "@/app/_components/locations/LocationDetailContact";
import { LocationDetailCrossLinks } from "@/app/_components/locations/LocationDetailCrossLinks";
import { Footer } from "@/app/_components/Footer";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const location = getLocationBySlug(params.slug);
  if (!location) return { title: "Локация не найдена" };
  return {
    title: `${location.name} — Локация — Бодрость и Сила`,
    description: location.shortDescription,
  };
}

export default function LocationPage({ params }: Props) {
  const location = getLocationBySlug(params.slug);
  if (!location) notFound();

  return (
    <main>
      <LocationDetailHero location={location} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <LocationDetailInfo location={location} />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <LocationDetailDirections location={location} />
      <LocationDetailMasters location={location} />
      <LocationDetailContact location={location} />
      <LocationDetailCrossLinks />
      <Footer />
    </main>
  );
}

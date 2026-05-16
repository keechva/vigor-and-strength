import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MASTERS, getMasterBySlug } from "@/app/_lib/data/masters";
import { MasterDetailHero } from "@/app/_components/masters/MasterDetailHero";
import { MasterDetailBio } from "@/app/_components/masters/MasterDetailBio";
import { MasterDetailDirections } from "@/app/_components/masters/MasterDetailDirections";
import { MasterDetailFormats } from "@/app/_components/masters/MasterDetailFormats";
import { MasterDetailGallery } from "@/app/_components/masters/MasterDetailGallery";
import { MasterDetailContact } from "@/app/_components/masters/MasterDetailContact";
import { MasterDetailCrossLinks } from "@/app/_components/masters/MasterDetailCrossLinks";
import { Footer } from "@/app/_components/Footer";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return MASTERS.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const master = getMasterBySlug(params.slug);
  if (!master) return { title: "Мастер не найден" };
  return {
    title: `${master.name} — ${master.role} — Бодрость и Сила`,
    description: master.tagline,
  };
}

export default function MasterPage({ params }: Props) {
  const master = getMasterBySlug(params.slug);
  if (!master) notFound();

  return (
    <main>
      <MasterDetailHero master={master} />
      <div className="bridge-warm-in" aria-hidden="true" />
      <MasterDetailBio master={master} />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <MasterDetailDirections master={master} />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <MasterDetailFormats master={master} />
      {master.gallery && master.gallery.length > 0 && (
        <>
          <div className="bridge-warm-to-cool" aria-hidden="true" />
          <MasterDetailGallery master={master} />
        </>
      )}
      <MasterDetailContact master={master} />
      <MasterDetailCrossLinks />
      <Footer />
    </main>
  );
}

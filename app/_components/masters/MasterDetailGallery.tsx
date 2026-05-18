"use client";

import type { Master } from "@/app/_lib/data/masters";
import { Gallery } from "@/app/_components/Gallery";

export function MasterDetailGallery({ master }: { master: Master }) {
  const items = master.gallery ?? [];
  if (items.length === 0) return null;
  return <Gallery items={items} ariaLabel="Галерея мастера" />;
}

"use client";

import { Gallery, type GalleryItem } from "@/app/_components/Gallery";

const GALLERY_ITEMS: GalleryItem[] = [
  {
    type: "image",
    src: "/placeholder/relax-1.jpg",
    alt: "Руки в работе",
    caption: "Тактильная работа",
  },
  {
    type: "video",
    src: "/placeholder/relax-2.mp4",
    alt: "Масло на коже",
    caption: "Подготовка",
  },
  {
    type: "image",
    src: "/placeholder/relax-3.jpg",
    alt: "Тёплое одеяло",
    caption: "Завершение сеанса",
  },
  {
    type: "image",
    src: "/placeholder/relax-4.jpg",
    alt: "Поющие чаши",
    caption: "Звуковая пауза",
  },
  {
    type: "video",
    src: "/placeholder/relax-5.mp4",
    alt: "Работа дыханием",
    caption: "Дыхание",
  },
  {
    type: "image",
    src: "/placeholder/relax-6.jpg",
    alt: "Свеча",
    caption: "Атмосфера",
  },
];

export function RelaxGallery() {
  return (
    <Gallery
      items={GALLERY_ITEMS}
      meta="Атмосфера"
      title="Как это выглядит"
      zone="cool"
      ariaLabel="Галерея — релаксология"
    />
  );
}

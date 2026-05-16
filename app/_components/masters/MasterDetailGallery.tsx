"use client";

import { useCallback, useEffect, useState } from "react";
import type { Master, MasterGalleryItem } from "@/app/_lib/data/masters";

function GalleryItemBody({ item }: { item: MasterGalleryItem }) {
  return (
    <div className="master-gallery__placeholder">
      <span className="master-gallery__kind">
        {item.type === "video" ? "видео" : "фото"}
      </span>
      <span className="master-gallery__alt">{item.alt}</span>
    </div>
  );
}

export function MasterDetailGallery({ master }: { master: Master }) {
  const items = master.gallery ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  if (items.length === 0) return null;

  const active = openIndex !== null ? items[openIndex] : null;
  const multi = items.length > 1;

  return (
    <section className="zone cool" aria-label="Галерея мастера">
      <div className="wrap">
        <div className="meta">Галерея</div>
        <h2>Как это выглядит</h2>

        <div className="master-gallery">
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              className="master-gallery__item"
              onClick={() => setOpenIndex(i)}
              aria-label={`Открыть ${item.type === "video" ? "видео" : "фото"}: ${item.alt}`}
            >
              <GalleryItemBody item={item} />
              {item.caption && (
                <div className="master-gallery__caption">{item.caption}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="master-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр медиа"
          onClick={close}
        >
          <button
            type="button"
            className="master-gallery-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Закрыть"
          >
            ×
          </button>

          {multi && (
            <button
              type="button"
              className="master-gallery-lightbox__nav is-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Предыдущее"
            >
              ‹
            </button>
          )}

          <div
            className="master-gallery-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="master-gallery-lightbox__media">
              <GalleryItemBody item={active} />
            </div>
            {active.caption && (
              <div className="master-gallery-lightbox__caption">
                {active.caption}
              </div>
            )}
          </div>

          {multi && (
            <button
              type="button"
              className="master-gallery-lightbox__nav is-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Следующее"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}

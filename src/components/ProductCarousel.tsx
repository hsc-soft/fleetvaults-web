"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { productHref, type Product } from "@/lib/products";

/**
 * Shows up to 3 products per view (2 on tablet, 1 on mobile) and pages through
 * the rest with prev/next controls. A native scroll-snap track keeps it smooth
 * and touch-swipeable; the buttons page by one viewport width.
 */
export default function ProductCarousel({
  products,
  categorySlug,
}: {
  products: Product[];
  categorySlug: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  function page(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <CarouselButton
          label="Previous products"
          onClick={() => page(-1)}
          disabled={atStart}
          direction="left"
        />
        <CarouselButton
          label="Next products"
          onClick={() => page(1)}
          disabled={atEnd}
          direction="right"
        />
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.name}
            className="flex-none basis-full snap-start sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
          >
            <ProductCard product={product} href={productHref(categorySlug, product.slug)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  direction,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  direction: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-signal-500 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? <path d="M12 4l-6 6 6 6" /> : <path d="M8 4l6 6-6 6" />}
      </svg>
    </button>
  );
}

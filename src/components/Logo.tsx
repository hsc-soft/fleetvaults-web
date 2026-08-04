import Image from "next/image";
import logo from "../../public/brand/fleet-logo-trimmed.png";

type Size = "sm" | "md" | "lg";

/** Heights only — width follows the lockup's own ~4.5:1 ratio.
    Header (sm) goes larger on wider screens so the tagline stays legible. */
const heights: Record<Size, string> = {
  sm: "h-12 sm:h-16",
  md: "h-16",
  lg: "h-20",
};

export default function Logo({
  size = "sm",
  priority = false,
  className = "",
}: {
  size?: Size;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={logo}
      alt="Fleet Vaults — Track, Monitor, Protect"
      priority={priority}
      sizes="(max-width: 640px) 200px, 340px"
      className={`w-auto ${heights[size]} ${className}`}
    />
  );
}

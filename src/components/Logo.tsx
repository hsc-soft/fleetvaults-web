import Image from "next/image";
import logo from "../../public/brand/logo-horizontal.png";

type Size = "sm" | "md" | "lg";

/** Heights only — width follows the lockup's own 5.31:1 ratio. */
const heights: Record<Size, string> = {
  sm: "h-11",
  md: "h-14",
  lg: "h-16",
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

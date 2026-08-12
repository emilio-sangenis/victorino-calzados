import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  href?: string;
  subtitle: string;
  tone?: "dark" | "light";
  compactOnMobile?: boolean;
};

export default function Brand({ href = "/", subtitle, tone = "light", compactOnMobile = false }: BrandProps) {
  return (
    <Link
      href={href}
      className={`flex items-center transition-colors ${compactOnMobile ? "gap-2 sm:gap-3" : "gap-3"} ${
        tone === "dark" ? "text-neutral-900" : "text-white"
      }`}
    >
      <Image
        src="/brand/victorino-mark.png"
        alt="Escudo de Victorino Calzados"
        width={40}
        height={40}
        priority
        className={`${compactOnMobile ? "size-8 sm:size-10" : "size-10"} shrink-0 object-contain transition ${
          tone === "dark" ? "brightness-0" : ""
        }`}
      />
      <span>
        <span className={`block font-serif font-bold ${compactOnMobile ? "text-base tracking-[0.12em] sm:text-xl sm:tracking-[0.15em]" : "text-xl tracking-[0.15em]"}`}>
          VICTORINO
        </span>
        <span className={`block uppercase text-fuchsia-400 ${compactOnMobile ? "text-[10px] tracking-[0.25em] sm:text-xs sm:tracking-[0.35em]" : "text-xs tracking-[0.35em]"}`}>
          {subtitle}
        </span>
      </span>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  href?: string;
  subtitle: string;
  tone?: "dark" | "light";
};

export default function Brand({ href = "/", subtitle, tone = "light" }: BrandProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 transition-colors ${
        tone === "dark" ? "text-neutral-900" : "text-white"
      }`}
    >
      <Image
        src="/brand/victorino-mark.png"
        alt="Escudo de Victorino Calzados"
        width={40}
        height={40}
        priority
        className={`size-10 shrink-0 object-contain transition ${
          tone === "dark" ? "brightness-0" : ""
        }`}
      />
      <span>
        <span className="block font-serif text-xl font-bold tracking-[0.15em]">
          VICTORINO
        </span>
        <span className="block text-xs uppercase tracking-[0.35em] text-fuchsia-400">
          {subtitle}
        </span>
      </span>
    </Link>
  );
}

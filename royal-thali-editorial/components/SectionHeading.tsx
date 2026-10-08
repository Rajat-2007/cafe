import Link from "next/link";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  body?: string;
};

export default function SectionHeading({ index, eyebrow, title, body }: Props) {
  return (
    <div className="relative z-10">
      <div className="mb-5 flex items-center gap-3 text-[#756b66]">
        <span className="editorial-kicker">{index}</span>
        <span className="h-px w-10 bg-[rgba(43,35,32,0.2)]" />
        <span className="editorial-kicker">{eyebrow}</span>
      </div>
      <h2 className="editorial-serif max-w-4xl text-[clamp(3rem,7vw,7.2rem)] leading-[0.92] tracking-[-0.055em]">
        {title}
      </h2>
      {body ? <p className="editorial-copy mt-8">{body}</p> : null}
    </div>
  );
}

export function TextLink({ href = "#reserve", children }: { href?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-underline text-sm" data-cursor="grow">
      {children}
    </Link>
  );
}

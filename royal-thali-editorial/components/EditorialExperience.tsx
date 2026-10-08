"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import LenisProvider from "./LenisProvider";
import CustomCursor from "./CustomCursor";
import LoadingScreen from "./LoadingScreen";
import VideoScrub from "./VideoScrub";
import SectionHeading, { TextLink } from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const FloatingParticles = dynamic(() => import("./FloatingParticles"), {
  ssr: false
});

const sections = [
  ["hero", "Hero", "01"],
  ["story", "Story", "02"],
  ["samosa", "Exploded samosa", "03"],
  ["ingredients", "Ingredients", "04"],
  ["craft", "Craft process", "05"],
  ["sauces", "Signature sauces", "06"],
  ["dining", "Dining experience", "07"],
  ["reserve", "Reserve", "08"]
] as const;

const ingredients = [
  ["Turmeric", "Warmth"],
  ["Red chilli", "Heat"],
  ["Black pepper", "Depth"],
  ["Cardamom", "Aromatic"],
  ["Star anise", "Sweet spice"],
  ["Cinnamon", "Structure"],
  ["Coriander", "Citrus lift"],
  ["Cumin", "Roasted earth"]
];

function Magnetic({ children, strength = 0.22 }: { children: React.ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (r.left + r.width / 2)) * strength);
    y.set((event.clientY - (r.top + r.height / 2)) * strength);
  };

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function GrainCanvas() {
  return <FloatingParticles />;
}

export default function EditorialExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("hero");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(".reveal-copy");
      targets.forEach((el) => {
        if (!el.textContent?.trim()) return;
        const split = new SplitType(el, { types: "lines,words" });
        gsap.set(split.lines, { overflow: "hidden" });
        gsap.from(split.words, {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.035,
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 28);
        gsap.to(el, {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, root);

    const observers = sections.map(([id]) => {
      const node = document.getElementById(id);
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id);
        },
        { threshold: 0.35 }
      );
      observer.observe(node);
      return observer;
    });

    return () => {
      ctx.revert();
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={root} className="paper-texture min-h-screen overflow-x-clip">
      <LenisProvider />
      <CustomCursor />
      <LoadingScreen />
      <GrainCanvas />

      <header className="fixed inset-x-0 top-0 z-[70]">
        <div className="container-editorial flex items-center justify-between py-5">
          <button
            className="editorial-serif text-xl tracking-[-0.04em]"
            onClick={() => jump("hero")}
            aria-label="Go to top"
          >
            Rasa
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {["story", "samosa", "ingredients", "craft", "sauces", "dining"].map((id) => (
              <button
                key={id}
                onClick={() => jump(id)}
                className={`text-[10px] uppercase tracking-[0.18em] transition-opacity ${
                  active === id ? "opacity-100" : "opacity-40"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <button
            onClick={() => jump("reserve")}
            data-cursor="grow"
            className="border-b border-[#2b2320] pb-1 text-[10px] uppercase tracking-[0.18em]"
          >
            Reserve
          </button>
        </div>
      </header>

      <aside className="fixed bottom-6 left-6 z-[50] hidden md:block">
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#756b66]">
          <span className="h-10 w-px bg-[rgba(43,35,32,0.18)]" />
          <span>Scroll / {String(sections.findIndex(([id]) => id === active) + 1).padStart(2, "0")}</span>
        </div>
      </aside>

      <main>
        <section id="hero" className="relative h-[220svh]">
          <VideoScrub
            src="/assets/video-1.mp4"
            poster="/assets/image-1.webp"
            label="Exploded royal thali"
            end="+=1800"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex min-h-screen items-end">
            <div className="container-editorial pb-[11svh]">
              <div className="max-w-4xl">
                <div className="mb-5 editorial-kicker text-[#756b66]">
                  Indian royal thali / edition 01
                </div>
                <h1 className="editorial-serif text-[clamp(4rem,11vw,12rem)] leading-[0.82] tracking-[-0.065em]">
                  The table,
                  <br />
                  in motion.
                </h1>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#5f554f] md:text-base">
                  A living editorial on heat, spice, craft and hospitality — directed by your scroll.
                </p>
                <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
                  <Magnetic>
                    <button
                      onClick={() => jump("reserve")}
                      className="btn-editorial bg-[#2b2320] text-[#fafaf8]"
                      data-cursor="grow"
                    >
                      <span>Reserve Table</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </Magnetic>
                  <Magnetic>
                    <button
                      onClick={() => jump("ingredients")}
                      className="btn-editorial"
                      data-cursor="grow"
                    >
                      <span>Explore Menu</span>
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="section-pad">
          <div className="container-editorial">
            <SectionHeading
              index="02"
              eyebrow="Editorial story"
              title="Built slowly. Served precisely."
              body="The experience keeps the page quiet so the food can do the talking. Every reveal is measured, every transition is tied to the rhythm of the scroll."
            />
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
              <figure className="relative overflow-hidden bg-[#efece5]">
                <Image
                  src="/assets/image-1.webp"
                  alt="Editorial placeholder for the royal thali asset"
                  width={1200}
                  height={800}
                  sizes="(max-width: 900px) 100vw, 70vw"
                  className="h-[62svh] w-full object-cover"
                  priority
                />
                <div data-parallax="14" className="absolute inset-x-8 bottom-8">
                  <div className="max-w-md bg-[#fafaf8]/90 p-5 backdrop-blur-[2px]">
                    <div className="editorial-kicker text-[#756b66]">A note from the kitchen</div>
                    <p className="mt-3 text-sm leading-7 text-[#5f554f]">
                      Each plate is treated like composition: proportion, contrast, aroma and a final
                      quiet detail.
                    </p>
                  </div>
                </div>
              </figure>
              <div className="grid gap-7 border-t border-[#2b2320]/10 pt-6 lg:pb-10">
                {[
                  ["01", "Seasonality", "Ingredients move with the market, not the calendar on the wall."],
                  ["02", "Balance", "Heat, acid, fat and texture are edited until nothing competes."],
                  ["03", "Hospitality", "The room remains generous, restrained and deeply human."]
                ].map(([n, t, d]) => (
                  <div key={n} className="border-b border-[#2b2320]/10 pb-6">
                    <div className="editorial-kicker text-[#756b66]">{n}</div>
                    <h3 className="mt-3 editorial-serif text-3xl tracking-[-0.035em]">{t}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#756b66]">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="samosa" className="relative h-[220svh]">
          <VideoScrub
            src="/assets/video-2.mp4"
            poster="/assets/image-2.webp"
            label="Exploded samosa"
            end="+=1800"
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-editorial flex h-full items-center">
              <div className="grid w-full gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="self-end pb-24 lg:pb-28">
                  <SectionHeading index="03" eyebrow="Exploded samosa" title="Crisp, all the way through." />
                </div>
                <div className="flex flex-col items-end justify-center gap-6">
                  {[
                    ["Potato", "slow-cooked filling"],
                    ["Peas", "sweet green snap"],
                    ["Cumin", "toasted warmth"],
                    ["Coriander", "fresh lift"],
                    ["Chilli", "clean heat"]
                  ].map(([label, detail], i) => (
                    <div
                      key={label}
                      className="pointer-events-auto flex items-center gap-4"
                      style={{ transform: `translateX(${(i % 2) * 12}px)` }}
                    >
                      <div className="hidden w-20 items-center gap-2 sm:flex">
                        <span className="label-line" />
                        <span className="h-1.5 w-1.5 rounded-full border border-[#2b2320]/40" />
                      </div>
                      <div className="w-[180px] border border-[#2b2320]/10 bg-[#fafaf8]/92 p-4 shadow-[0_16px_50px_rgba(43,35,32,0.06)] backdrop-blur-sm">
                        <div className="editorial-kicker text-[#756b66]">{label}</div>
                        <div className="mt-2 text-sm">{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ingredients" className="relative h-[220svh]">
          <VideoScrub
            src="/assets/video-3.mp4"
            poster="/assets/image-3.webp"
            label="Spice explosion"
            end="+=1850"
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-editorial flex h-full flex-col justify-between py-[11svh]">
              <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                <SectionHeading
                  index="04"
                  eyebrow="Ingredients"
                  title="A constellation of spice."
                  body="Hover the ingredients and the composition breathes. Scroll the film and the spices rise into a precise, suspended cloud."
                />
                <div className="pointer-events-auto grid grid-cols-2 gap-2 self-start border border-[#2b2320]/10 bg-[#fafaf8]/62 p-2 backdrop-blur-sm md:grid-cols-4">
                  {ingredients.map(([name, quality], index) => (
                    <motion.button
                      key={name}
                      type="button"
                      whileHover={{ y: -5, rotate: index % 2 ? 1.2 : -1.2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="min-h-[126px] bg-[#fafaf8]/88 p-4 text-left shadow-[0_16px_45px_rgba(43,35,32,0.04)]"
                      data-cursor="grow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="editorial-kicker text-[#756b66]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.14em] text-[#756b66]">{quality}</span>
                      </div>
                      <div className="mt-8 editorial-serif text-xl tracking-[-0.03em]">{name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="pointer-events-auto max-w-lg border-l border-[#2b2320]/15 pl-5">
                <div className="editorial-kicker text-[#756b66]">Video 03 / spice explosion</div>
                <div className="mt-3 editorial-serif text-3xl tracking-[-0.035em]">No chaos. Only precision.</div>
                <p className="mt-3 text-sm leading-6 text-[#756b66]">
                  Turmeric, cardamom, cinnamon, black pepper and the rest of the kitchen palette are kept
                  suspended, sharp and readable as you move.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="craft" className="relative h-[230svh]">
          <VideoScrub
            src="/assets/video-4.mp4"
            poster="/assets/image-4.webp"
            label="Ingredient assembly"
            end="+=1900"
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-editorial flex h-full flex-col justify-between py-[12svh]">
              <SectionHeading
                index="05"
                eyebrow="Craft process"
                title="The kitchen as choreography."
                body="Ingredients enter like cast members. The composition tightens until the dish reads as one thought."
              />
              <div className="pointer-events-auto grid gap-4 border-t border-[#2b2320]/10 pt-6 md:grid-cols-4">
                {[
                  ["01", "Bloom", "Whole spices wake up in fat."],
                  ["02", "Build", "Aromatics layer the base."],
                  ["03", "Fold", "Paneer and cream settle into the sauce."],
                  ["04", "Finish", "Acid and herbs sharpen the last frame."]
                ].map(([n, t, d]) => (
                  <div key={n} className="border-l border-[#2b2320]/10 pl-4">
                    <div className="editorial-kicker text-[#756b66]">{n}</div>
                    <div className="mt-3 editorial-serif text-2xl">{t}</div>
                    <div className="mt-2 text-xs leading-5 text-[#756b66]">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sauces" className="relative h-[210svh]">
          <VideoScrub
            src="/assets/video-5.mp4"
            poster="/assets/image-4.webp"
            label="Pouring chutney"
            end="+=1750"
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-editorial flex h-full items-center justify-between gap-8">
              <div className="max-w-xl">
                <SectionHeading
                  index="06"
                  eyebrow="Signature sauces"
                  title="Green, dark, bright, slow."
                  body="Two ribbons. One table. Timing becomes flavour when the pour is choreographed to your scroll."
                />
              </div>
              <div className="hidden w-[260px] shrink-0 space-y-4 lg:block">
                {[
                  ["Mint chutney", "Herbaceous / cooling"],
                  ["Tamarind", "Tart / caramel"],
                  ["House masala", "Toasty / layered"]
                ].map(([title, body], i) => (
                  <motion.div
                    key={title}
                    whileHover={{ rotate: i === 1 ? -1 : 1, y: -4 }}
                    className="pointer-events-auto border border-[#2b2320]/10 bg-[#fafaf8]/90 p-5 shadow-[0_16px_50px_rgba(43,35,32,0.05)] backdrop-blur-sm"
                  >
                    <div className="editorial-kicker text-[#756b66]">{String(i + 1).padStart(2, "0")}</div>
                    <div className="mt-2 editorial-serif text-2xl">{title}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.13em] text-[#756b66]">{body}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="dining" className="relative h-[220svh]">
          <VideoScrub
            src="/assets/video-6.mp4"
            poster="/assets/image-4.webp"
            label="Premium dining table"
            end="+=1800"
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="container-editorial flex h-full flex-col justify-between py-[13svh]">
              <div className="max-w-5xl">
                <div className="editorial-kicker text-[#756b66]">07 / dining experience</div>
                <h2 className="mt-5 editorial-serif text-[clamp(3.8rem,9vw,10rem)] leading-[0.82] tracking-[-0.06em]">
                  Make room
                  <br />
                  for wonder.
                </h2>
              </div>

              <div className="pointer-events-auto grid gap-4 md:grid-cols-3">
                {[
                  ["/assets/image-2.webp", "The first course", "Crisp, warm, immediate."],
                  ["/assets/image-3.webp", "The spice wall", "Aromatic, alive, precise."],
                  ["/assets/image-1.webp", "The final table", "Shared, generous, remembered."]
                ].map(([src, title, body]) => (
                  <figure key={title} className="overflow-hidden border border-[#2b2320]/10 bg-[#fafaf8]/90 p-3 backdrop-blur-sm">
                    <Image
                      src={src}
                      alt={title}
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="p-3">
                      <div className="editorial-serif text-2xl">{title}</div>
                      <div className="mt-1 text-xs text-[#756b66]">{body}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="reserve" className="section-pad min-h-[100svh]">
          <div className="container-editorial">
            <div className="grid min-h-[78svh] items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <div className="editorial-kicker text-[#756b66]">08 / reservation</div>
                <h2 className="mt-5 editorial-serif text-[clamp(4rem,9vw,9rem)] leading-[0.82] tracking-[-0.06em]">
                  Leave the
                  <br />
                  door open.
                </h2>
                <p className="editorial-copy mt-8 max-w-lg">
                  A quiet table, a measured menu, and an evening built around the people who arrive.
                </p>
                <div className="mt-8">
                  <TextLink>hello@rasa.example</TextLink>
                </div>
              </div>

              <form
                className="border-y border-[#2b2320]/10 py-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                {submitted ? (
                  <div className="py-16">
                    <div className="editorial-kicker text-[#756b66]">Request received</div>
                    <div className="mt-4 editorial-serif text-4xl tracking-[-0.035em]">
                      We&apos;ll set a place for you.
                    </div>
                    <button
                      type="button"
                      className="mt-8 link-underline text-sm"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {[
                      ["name", "Name", "text"],
                      ["email", "Email", "email"],
                      ["date", "Preferred date", "date"]
                    ].map(([name, label, type]) => (
                      <label key={name} className="block">
                        <span className="editorial-kicker text-[#756b66]">{label}</span>
                        <input
                          name={name}
                          type={type}
                          required
                          className="mt-3 w-full border-b border-[#2b2320]/20 bg-transparent py-3 text-base outline-none placeholder:text-[#a49b95] focus:border-[#2b2320]"
                          placeholder={label}
                        />
                      </label>
                    ))}

                    <label className="block">
                      <span className="editorial-kicker text-[#756b66]">Notes</span>
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-3 w-full resize-none border-b border-[#2b2320]/20 bg-transparent py-3 text-base outline-none placeholder:text-[#a49b95] focus:border-[#2b2320]"
                        placeholder="A birthday, a quiet corner, dietary notes..."
                      />
                    </label>

                    <Magnetic strength={0.08}>
                      <button type="submit" className="btn-editorial w-full bg-[#2b2320] text-[#fafaf8]" data-cursor="grow">
                        <span>Request a table</span>
                        <span aria-hidden="true">↗</span>
                      </button>
                    </Magnetic>
                  </div>
                )}
              </form>
            </div>

            <footer className="flex flex-col gap-3 border-t border-[#2b2320]/10 pt-6 text-[10px] uppercase tracking-[0.15em] text-[#756b66] md:flex-row md:items-center md:justify-between">
              <span>Rasa / Indian dining editorial</span>
              <span>Built for 60fps scroll direction</span>
              <span>© {new Date().getFullYear()}</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

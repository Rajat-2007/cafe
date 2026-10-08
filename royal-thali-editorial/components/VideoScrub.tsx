"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  poster?: string;
  label: string;
  start?: string;
  end?: string;
  className?: string;
};

export default function VideoScrub({
  src,
  poster,
  label,
  start = "top top",
  end = "+=2200",
  className = ""
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const section = host.current;
    const media = video.current;
    if (!section || !media) return;

    let ready = false;
    let raf = 0;
    let targetTime = 0;

    const onMetadata = () => {
      ready = Number.isFinite(media.duration) && media.duration > 0;
    };

    const onError = () => setBroken(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          media.preload = "auto";
          media.load();
        } else {
          media.pause();
          media.preload = "none";
        }
      },
      { rootMargin: "200px 0px 200px" }
    );

    const render = () => {
      if (ready && media.readyState >= 2 && Number.isFinite(targetTime)) {
        const delta = targetTime - media.currentTime;
        if (Math.abs(delta) > 0.01) {
          media.currentTime += delta * 0.6;
        }
      }
      raf = requestAnimationFrame(render);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        if (!ready) return;
        targetTime = Math.max(0, Math.min((media.duration || 10) - 0.03, (media.duration || 10) * self.progress));
      }
    });

    observer.observe(section);
    media.addEventListener("loadedmetadata", onMetadata);
    media.addEventListener("error", onError);
    raf = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      media.removeEventListener("loadedmetadata", onMetadata);
      media.removeEventListener("error", onError);
      trigger.kill();
      cancelAnimationFrame(raf);
    };
  }, [end, start]);

  return (
    <div ref={host} className={`sticky-scene ${className}`}>
      <div className="video-surface absolute inset-0">
        {!broken ? (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            poster={poster}
            muted
            playsInline
            preload="none"
            aria-label={`${label} scroll-controlled video`}
          />
        ) : null}
        {!src || broken ? (
          <div className="asset-placeholder">
            <div className="asset-placeholder-inner">
              <div>
                <div className="editorial-kicker text-[#756b66]">Google Flow asset</div>
                <strong>{label}</strong>
                <span>Drop {src.split("/").pop()} into /public/assets</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

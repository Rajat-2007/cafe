# Rasa — Scroll-Driven Indian Dining Editorial

This folder is a production-oriented Next.js starter implementing the supplied editorial brief.

## What is already built

- Next.js App Router + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis smooth scroll
- Framer Motion micro-interactions
- React Three Fiber + Drei floating dust field
- Scroll-scrubbed HTML5 video architecture for all 6 sections
- IntersectionObserver-based media activation
- Editorial typography, paper texture, grain, whitespace and subtle shadows
- Custom cursor on fine pointers
- Magnetic CTA buttons
- SplitType reveal animation
- Eight-section page flow from Hero through Reservation
- Responsive mobile adaptation
- `prefers-reduced-motion` support
- Semantic structure, alt text and basic form states
- SEO metadata
- Google Flow prompt pack copied from the supplied brief

## Asset drop-in

Put the generated Google Flow exports in:

`public/assets/`

with these exact names:

`video-1.mp4`
`video-2.mp4`
`video-3.mp4`
`video-4.mp4`
`video-5.mp4`
`video-6.mp4`

`image-1.webp`
`image-2.webp`
`image-3.webp`
`image-4.webp`

The included `.webp` files are only lightweight placeholders so the UI can be previewed before the real food assets arrive.

## Run in VS Code

1. Extract this folder.
2. Open the folder in VS Code.
3. In the terminal run:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000`.

For a production check:

```bash
npm run typecheck
npm run build
npm start
```

## Important

The supplied guide specifies Google Flow assets but the actual generated MP4/WebP files were not attached to this chat. The site is wired for them, and the prompt pack is included so the filenames map directly to the scroll scenes.

The supplied Instagram Reel URL was not fetchable in this environment, so this package does not claim to reproduce anything specific from that Reel.

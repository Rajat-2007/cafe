# Google Flow assets

Drop the six generated videos and four images into this folder with these exact names:

## Videos
- `video-1.mp4` — Hero / exploded royal thali
- `video-2.mp4` — Exploded samosa
- `video-3.mp4` — Spice explosion
- `video-4.mp4` — Ingredient assembly
- `video-5.mp4` — Pouring chutney
- `video-6.mp4` — Premium dining table reveal

## Images
- `image-1.webp` — Hero poster / story image
- `image-2.webp` — Exploded samosa
- `image-3.webp` — Floating spice composition
- `image-4.webp` — Editorial dining scene

The included `.webp` files are lightweight editorial placeholders so the UI opens before the real food assets arrive. Replace these four files with the Google Flow exports when ready.

For the six scroll videos, the implementation uses `preload="none"`, an IntersectionObserver for active media, and GSAP ScrollTrigger to map scroll progress to `HTMLVideoElement.currentTime`.

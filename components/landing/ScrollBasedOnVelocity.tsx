

import { ScrollVelocityContainer , ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'
import Image from 'next/image'
const IMAGES_ROW_A = [
  "/templates/hero-block-1-light.webp",
  "/templates/hero-block-2-light.webp",
  "/templates/hero-block-3-light.webp",
  "/templates/hero-block-4-light.webp",
  "/templates/hero-block-5-light.webp",

]
const IMAGES_ROW_B = [
  "/templates/hero-block-6-light.webp",
  "/templates/hero-block-7-light.webp",
  "/templates/hero-block-8-light.webp",
  "/templates/hero-block-9-light.webp",
  "/templates/hero-block-10-light.webp",
]
function ScrollBasedVelocityImagesDemo() {
  return (
    <div className="relative flex w-full flex-col gap-4 items-center justify-center overflow-hidden py-8">
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4 flex gap-4">
          {IMAGES_ROW_A.map((src, idx) => (
            <Image
              key={idx}
              src={`${src}`}
              alt="Unsplash sample"
              width={340}
              height={260}
              loading="lazy"
              decoding="async"
              className="mx-4 max-h-[200px] inline-block rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4 flex gap-4 ">
          {IMAGES_ROW_B.map((src, idx) => (
            <Image
              key={idx}
              src={`${src}`}
              alt="Unsplash sample"
               width={340}
              height={260}
              loading="lazy"
              decoding="async"
              className="mx-4 max-h-[200px] inline-block rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}

export default ScrollBasedVelocityImagesDemo;
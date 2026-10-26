import { GalleryMedia } from "@/components/shared/gallery-media";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";

export function ImageGallerySection({
  heading,
  description,
  images,
}: {
  heading?: string;
  description?: string;
  images: string[];
}) {
  return (
    <Section className="bg-surface">
      <Container>
        {heading && <SectionHeading title={heading} description={description} className="max-w-2xl" />}
        <RevealGroup className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${heading ? "mt-14" : ""}`}>
          {images.map((src, i) => (
            <RevealItem key={i} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <GalleryMedia
                  src={src}
                  alt={`${heading ?? "Gallery"} image ${i + 1}`}
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="transition-transform duration-700 hover:scale-105"
                />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

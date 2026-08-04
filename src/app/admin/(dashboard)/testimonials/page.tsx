import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TestimonialManager } from "@/components/admin/testimonials/testimonial-manager";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client testimonials shown across the site." />
      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}

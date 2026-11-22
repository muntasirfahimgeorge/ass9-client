import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getServiceById } from "@/lib/api/services";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/services"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Back to all services
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <Badge variant="secondary">{service.category}</Badge>

          <h1 className="text-2xl font-semibold">
            {service.title}
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Base Price</p>
              <p className="font-semibold">
  ${Number(service.basePrice).toLocaleString("en-US")}
</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Estimated Duration</p>
              <p className="font-medium">{service.estimatedDuration}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Service Mode</p>
              <p className="font-medium">{service.serviceMode}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Service Area</p>
              <p className="font-medium">{service.serviceArea}</p>
            </div>
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground">Technician</p>
            <p className="font-medium">{service.technicianName}</p>
          </div>

          <Link
            href={`/booking/${service._id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Request a Repair
          </Link>
        </div>
      </div>
    </main>
  );
}


import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getServiceById } from "@/lib/api/services";
import { auth } from "@/lib/auth";
import RepairRequestForm from "../_components/PayNow";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(`/booking/${id}`)}`
    );
  }

  const role = session.user.role;

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href={`/services/${service._id}`}
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Back to service details
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-3">
            <Badge variant="secondary">{service.category}</Badge>

            <h1 className="text-2xl font-semibold">
              Request a Repair
            </h1>

            <h2 className="text-lg font-medium">
              {service.title}
            </h2>

            <p className="text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Starting Price</p>
                <p className="font-semibold">
  ${Number(service.basePrice).toLocaleString("en-US")}
</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {service.estimatedDuration}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Service Mode</p>
                <p className="font-medium">
                  {service.serviceMode}
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Service Area</p>
                <p className="font-medium">
                  {service.serviceArea}
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Technician</p>
              <p className="font-medium">
                {service.technicianName}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-5 sm:p-6">
          {role !== "customer" ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                Customer access required
              </h2>

              <p className="text-sm text-muted-foreground">
                Only customer accounts can request repair services.
                Your current account role is {role ?? "not assigned"}.
              </p>

              <Link
                href="/"
                className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Return to homepage
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">
                Your Repair Request
              </h2>

              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                Enter your contact details and describe the problem.
              </p>

              <RepairRequestForm
                serviceId={service._id}
                customerName={session.user.name}
                customerEmail={session.user.email}
                minDate={today}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

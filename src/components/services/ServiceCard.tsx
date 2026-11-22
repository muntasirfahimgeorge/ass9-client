
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock3, UserRound, ArrowRight, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TService } from "@/types";

type ServiceCardProps = {
  service: TService;
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8F34A] hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Wrench size={42} />
          </div>
        )}

        <div className="absolute left-4 top-4">
          <Badge className="border-0 bg-[#B8F34A] px-3 py-1 font-bold text-[#14243A] hover:bg-[#B8F34A]">
            {service.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-slate-200 text-xs font-medium text-slate-600"
          >
            {service.serviceMode}
          </Badge>
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-xs font-medium text-green-700"
          >
            Available
          </Badge>
        </div>

        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-[#14243A] transition-colors group-hover:text-[#729D20]">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {service.description}
        </p>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} className="shrink-0 text-[#729D20]" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <UserRound size={16} className="shrink-0 text-[#729D20]" />
            <span className="line-clamp-1">
              {service.technicianName || "Technician"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 size={16} className="shrink-0 text-[#729D20]" />
            <span>{service.estimatedDuration}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-5">
          <div>
            <p className="text-xs text-slate-500">Starting price</p>
            <p className="mt-1 text-xl font-extrabold text-[#14243A]">
  ${Number(service.basePrice).toLocaleString("en-US")}
</p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#14243A] px-4 text-sm font-bold text-white transition-colors hover:bg-[#203957]"
          >
            Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

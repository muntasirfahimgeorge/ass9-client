
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TService } from "@/types";

type ServiceCardProps = {
  service: TService;
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={service.image}
          alt={service.title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle>{service.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{service.category}</Badge>
          <Badge variant="outline">{service.serviceMode}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-medium">
            ৳ {service.basePrice}
          </p>
          <p className="text-xs text-muted-foreground">
            Estimated duration: {service.estimatedDuration}
          </p>
        </div>

        <Link
          href={`/services/${service._id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

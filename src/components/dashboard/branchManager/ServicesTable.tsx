"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import {
  deleteService,
  updateServiceAvailability,
} from "@/lib/action/services";
import type { TService } from "@/types";
import AddServiceDialog from "./AddServiceDialog";

type ServicesTableProps = {
  services: TService[];
};

const statusVariant = (status: TService["approvalStatus"]) => {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
};

const ServicesTable = ({ services }: ServicesTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAvailability = (service: TService, checked: boolean) => {
    setBusyId(service._id);

    startTransition(async () => {
      const result = await updateServiceAvailability(service._id, checked);
      setBusyId(null);

      toast.add({
        title: result.success ? "Availability updated" : "Update failed",
        description: result.message,
        type: result.success ? "success" : "error",
      });

      if (result.success) {
        window.location.reload();
      }
    });
  };

  const handleDelete = (service: TService) => {
    const confirmed = window.confirm(
      `Delete "${service.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(service._id);

    startTransition(async () => {
      const result = await deleteService(service._id);
      setBusyId(null);

      toast.add({
        title: result.success ? "Service deleted" : "Delete failed",
        description: result.message,
        type: result.success ? "success" : "error",
      });

      if (result.success) {
        window.location.reload();
      }
    });
  };

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
          <Pencil className="size-5 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">No services yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first repair service to start receiving booking requests.
        </p>
        <div className="mt-4">
          <AddServiceDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Base price</th>
                <th className="px-4 py-3 font-medium">Duration / Mode</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((service) => (
                <tr key={service._id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex min-w-[210px] items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {service.image && (
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="max-w-[190px]">
                        <p className="line-clamp-2 font-medium">{service.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{service.serviceArea}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{service.category}</td>
                  <td className="px-4 py-3 font-medium">
                    ${Number(service.basePrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <p>{service.estimatedDuration}</p>
                    <p className="text-xs text-muted-foreground">{service.serviceMode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(service.approvalStatus)}>
                      {service.approvalStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.isAvailable}
                        disabled={isPending || busyId === service._id}
                        onCheckedChange={(checked) => handleAvailability(service, checked)}
                        aria-label={`Toggle availability for ${service.title}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {service.isAvailable ? "On" : "Off"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <AddServiceDialog service={service} />
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={isPending || busyId === service._id}
                        onClick={() => handleDelete(service)}
                        aria-label={`Delete ${service.title}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Editing a service sends it back to pending approval. Only approved and available services are visible to customers.
      </p>
    </div>
  );
};

export default ServicesTable;

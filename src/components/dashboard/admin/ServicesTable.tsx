
"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { updateServiceApproval } from "@/lib/action/admin-services";
import type { TService, TApprovalStatus } from "@/types";

type ServiceFilter = TApprovalStatus | "all";

type ServicesTableProps = {
  services: TService[];
  initialFilter: ServiceFilter;
};

const FILTERS: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES: Record<TApprovalStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ServicesTable({
  services,
  initialFilter,
}: ServicesTableProps) {
  const [filter, setFilter] = useState<ServiceFilter>(initialFilter);

  const handleFilterChange = (value: ServiceFilter) => {
    setFilter(value);
    window.location.href =
      value === "all"
        ? "/dashboard/admin/services"
        : `/dashboard/admin/services?approvalStatus=${value}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {services.length} service{services.length !== 1 ? "s" : ""} found
        </p>

        <NativeSelect
          value={filter}
          onChange={(event) =>
            handleFilterChange(event.target.value as ServiceFilter)
          }
        >
          {FILTERS.map((item) => (
            <NativeSelectOption key={item.value} value={item.value}>
              {item.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <ServiceRow key={service._id} service={service} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ServiceRow({ service }: { service: TService }) {
  const [isPending, startTransition] = useTransition();

  const handleApproval = (approvalStatus: "approved" | "rejected") => {
    startTransition(async () => {
      const result = await updateServiceApproval({
        serviceId: service._id,
        approvalStatus,
      });

      toast.add({
        title: result.success ? "Service updated" : "Update failed",
        description: result.message,
      });

      if (result.success) {
        window.location.reload();
      }
    });
  };

  return (
    <TableRow>
      <TableCell className="pl-4">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              sizes="48px"
              className="object-cover"
            />
          </div>

          <div className="min-w-40">
            <p className="font-medium">{service.title}</p>
            <p className="text-xs text-muted-foreground">
              {service.category}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div>
          <p className="font-medium">{service.technicianName}</p>
          <p className="text-xs text-muted-foreground">
            {service.technicianEmail}
          </p>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap">
        ${Number(service.basePrice).toLocaleString("en-US")}
      </TableCell>

      <TableCell>{service.serviceArea}</TableCell>

      <TableCell>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[service.approvalStatus]}`}
        >
          {service.approvalStatus}
        </span>
      </TableCell>

      <TableCell className="pr-4">
        {service.approvalStatus === "pending" ? (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => handleApproval("approved")}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isPending ? "Saving..." : "Approve"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => handleApproval("rejected")}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            Reviewed
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}

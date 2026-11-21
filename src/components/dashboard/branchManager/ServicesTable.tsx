
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TService } from "@/types";

type ServicesTableProps = {
  services: TService[];
};

const ServicesTable = ({ services }: ServicesTableProps) => {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        You have not submitted any services yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Service</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead className="pr-4">Availability</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.map((service) => (
            <TableRow key={service._id}>
              <TableCell className="pl-4 font-medium">
                {service.title}
              </TableCell>

              <TableCell>{service.category}</TableCell>

              <TableCell>৳ {service.basePrice}</TableCell>

              <TableCell>{service.estimatedDuration}</TableCell>

              <TableCell>{service.serviceMode}</TableCell>

              <TableCell>
                <span className="capitalize">
                  {service.approvalStatus}
                </span>
              </TableCell>

              <TableCell className="pr-4">
                {service.isAvailable ? "Available" : "Unavailable"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;

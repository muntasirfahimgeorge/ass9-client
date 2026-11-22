"use client";

import { useCallback, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TService } from "@/types";
import ServiceForm from "./ServiceForm";

type Props = {
  service?: TService;
};

const AddServiceDialog = ({ service }: Props) => {
  const [open, setOpen] = useState(false);
  const handleSuccess = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={service ? "outline" : "default"}
            className={service ? "" : "bg-[#15295e] text-white hover:bg-[#1e3a80]"}
          />
        }
      >
        {service ? (
          <><Pencil data-icon="inline-start" /> Edit</>
        ) : (
          <><Plus data-icon="inline-start" /> Add Service</>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{service ? "Edit service" : "Add a service"}</DialogTitle>
          <DialogDescription>
            {service
              ? "Update your service information. Editing will send it for admin approval again."
              : "Create a repair service. New services require admin approval before appearing publicly."}
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          key={service?._id ?? "new-service"}
          service={service}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;

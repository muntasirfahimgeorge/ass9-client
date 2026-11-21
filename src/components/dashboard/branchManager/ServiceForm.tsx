
"use client";

import { useState, useTransition, type SyntheticEvent } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createService } from "@/lib/action/services";
import type { TServiceFormState } from "@/types";

type ServiceFormProps = {
  onSuccess: () => void;
};

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

const ServiceForm = ({ onSuccess }: ServiceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TServiceFormState | null>(null);

  const errors = result?.errors ?? {};

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const response = await createService(formData);
        setResult(response);

        if (response.success) {
          toast.add({
            title: "Service submitted",
            description: response.message,
          });
          onSuccess();
        }
      } catch {
        setResult({
          success: false,
          message: "Could not save the service. Please try again.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {result && !result.success && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={!!errors.title || undefined}>
          <FieldLabel htmlFor="title">Service title</FieldLabel>
          <Input
            id="title"
            name="title"
            placeholder="Laptop motherboard repair"
            required
            disabled={isPending}
            aria-invalid={!!errors.title || undefined}
          />
          <FieldError>{errors.title}</FieldError>
        </Field>

        <Field data-invalid={!!errors.category || undefined}>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <select
            id="category"
            name="category"
            required
            disabled={isPending}
            aria-invalid={!!errors.category || undefined}
            defaultValue=""
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError>{errors.category}</FieldError>
        </Field>

        <Field data-invalid={!!errors.image || undefined}>
          <FieldLabel htmlFor="image">Service image URL</FieldLabel>
          <Input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/service.jpg"
            required
            disabled={isPending}
            aria-invalid={!!errors.image || undefined}
          />
          <FieldError>{errors.image}</FieldError>
        </Field>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the repair service..."
            required
            disabled={isPending}
            aria-invalid={!!errors.description || undefined}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.basePrice || undefined}>
            <FieldLabel htmlFor="basePrice">Base price (৳)</FieldLabel>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="500"
              required
              disabled={isPending}
              aria-invalid={!!errors.basePrice || undefined}
            />
            <FieldError>{errors.basePrice}</FieldError>
          </Field>

          <Field data-invalid={!!errors.estimatedDuration || undefined}>
            <FieldLabel htmlFor="estimatedDuration">
              Estimated duration
            </FieldLabel>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              placeholder="30-45 minutes"
              required
              disabled={isPending}
              aria-invalid={!!errors.estimatedDuration || undefined}
            />
            <FieldError>{errors.estimatedDuration}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.serviceMode || undefined}>
          <FieldLabel htmlFor="serviceMode">Service mode</FieldLabel>
          <select
            id="serviceMode"
            name="serviceMode"
            required
            disabled={isPending}
            defaultValue=""
            aria-invalid={!!errors.serviceMode || undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              Select service mode
            </option>
            <option value="Home Visit">Home Visit</option>
            <option value="Shop Drop-off">Shop Drop-off</option>
          </select>
          <FieldError>{errors.serviceMode}</FieldError>
        </Field>

        <Field data-invalid={!!errors.serviceArea || undefined}>
          <FieldLabel htmlFor="serviceArea">Service area</FieldLabel>
          <Input
            id="serviceArea"
            name="serviceArea"
            placeholder="Dhanmondi, Dhaka"
            required
            disabled={isPending}
            aria-invalid={!!errors.serviceArea || undefined}
          />
          <FieldError>{errors.serviceArea}</FieldError>
        </Field>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#15295e] text-white hover:bg-[#1e3a80]"
          >
            {isPending ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              "Submit service"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default ServiceForm;

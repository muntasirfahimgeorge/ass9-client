"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { AlertCircle, ImagePlus, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  createService,
  updateService,
  uploadServiceImage,
} from "@/lib/action/services";
import type { TService, TServiceFormState } from "@/types";

type ServiceFormProps = {
  onSuccess: () => void;
  service?: TService;
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

const ServiceForm = ({ onSuccess, service }: ServiceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const [imageUrl, setImageUrl] = useState(service?.image ?? "");
  const [result, setResult] = useState<TServiceFormState | null>(null);

  const errors = result?.errors ?? {};

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    startUpload(async () => {
      const response = await uploadServiceImage(formData);

      if (response.success && response.url) {
        setImageUrl(response.url);
        setResult(null);
        toast.add({
          title: "Image uploaded",
          description: "Your service image is ready.",
        });
      } else {
        toast.add({
          title: "Upload failed",
          description: response.message,
          type: "error",
        });
        event.target.value = "";
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set("image", imageUrl);

    startTransition(async () => {
      try {
        const response = service
          ? await updateService(service._id, formData)
          : await createService(formData);

        setResult(response);

        if (response.success) {
          toast.add({
            title: service ? "Service updated" : "Service submitted",
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
            defaultValue={service?.title ?? ""}
            placeholder="Laptop motherboard repair"
            maxLength={100}
            required
            disabled={isPending || isUploading}
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
            disabled={isPending || isUploading}
            aria-invalid={!!errors.category || undefined}
            defaultValue={service?.category ?? ""}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <FieldError>{errors.category}</FieldError>
        </Field>

        <Field data-invalid={!!errors.image || undefined}>
          <FieldLabel htmlFor="service-image">Service image</FieldLabel>
          <div className="rounded-lg border border-dashed p-4">
            {imageUrl ? (
              <div className="relative mb-3 h-44 w-full overflow-hidden rounded-md bg-muted">
                <Image
                  src={imageUrl}
                  alt="Service preview"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            ) : (
              <div className="mb-3 flex h-32 flex-col items-center justify-center gap-2 rounded-md bg-muted text-muted-foreground">
                <ImagePlus className="size-8" />
                <span className="text-sm">No image selected</span>
              </div>
            )}

            <Input
              id="service-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={isPending || isUploading}
            />

            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or WebP. Maximum file size: 5 MB.
            </p>

            {isUploading && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Uploading image...
              </div>
            )}

            {imageUrl && (
              <p className="mt-2 break-all text-xs text-green-700">
                Image uploaded successfully.
              </p>
            )}
          </div>
          <input type="hidden" name="image" value={imageUrl} />
          <FieldError>{errors.image}</FieldError>
        </Field>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={service?.description ?? ""}
            placeholder="Describe the repair service..."
            required
            disabled={isPending || isUploading}
            aria-invalid={!!errors.description || undefined}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.basePrice || undefined}>
            <FieldLabel htmlFor="basePrice">Base price (USD)</FieldLabel>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={service?.basePrice ?? ""}
              placeholder="25"
              required
              disabled={isPending || isUploading}
              aria-invalid={!!errors.basePrice || undefined}
            />
            <FieldError>{errors.basePrice}</FieldError>
          </Field>

          <Field data-invalid={!!errors.estimatedDuration || undefined}>
            <FieldLabel htmlFor="estimatedDuration">Estimated duration</FieldLabel>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              defaultValue={service?.estimatedDuration ?? ""}
              placeholder="30-45 minutes"
              required
              disabled={isPending || isUploading}
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
            disabled={isPending || isUploading}
            defaultValue={service?.serviceMode ?? ""}
            aria-invalid={!!errors.serviceMode || undefined}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>Select service mode</option>
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
            defaultValue={service?.serviceArea ?? ""}
            placeholder="Dhanmondi, Dhaka"
            required
            disabled={isPending || isUploading}
            aria-invalid={!!errors.serviceArea || undefined}
          />
          <FieldError>{errors.serviceArea}</FieldError>
        </Field>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending || isUploading || !imageUrl}
            className="bg-[#15295e] text-white hover:bg-[#1e3a80]"
          >
            {isPending ? (
              <><Spinner /> Saving...</>
            ) : isUploading ? (
              <><Upload /> Uploading...</>
            ) : service ? (
              "Save changes"
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

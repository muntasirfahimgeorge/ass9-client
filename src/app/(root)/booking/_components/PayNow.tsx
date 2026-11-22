
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/lib/action/booking";

type RepairRequestFormProps = {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  minDate: string;
};

const RepairRequestForm = ({
  serviceId,
  customerName,
  customerEmail,
  minDate,
}: RepairRequestFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createBooking({
        serviceId,
        customerPhone: String(
          formData.get("customerPhone") || ""
        ).trim(),
        address: String(
          formData.get("address") || ""
        ).trim(),
        preferredDate: String(
          formData.get("preferredDate") || ""
        ),
        problemDescription: String(
          formData.get("problemDescription") || ""
        ).trim(),
      });

      setMessage(result.message);

      if (result.success) {
        router.push("/dashboard/customer/bookings");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customerName"
          className="text-sm font-medium"
        >
          Customer Name
        </label>

        <input
          id="customerName"
          type="text"
          value={customerName}
          readOnly
          className={`${inputClass} bg-muted`}
        />
      </div>

      <div>
        <label
          htmlFor="customerEmail"
          className="text-sm font-medium"
        >
          Email Address
        </label>

        <input
          id="customerEmail"
          type="email"
          value={customerEmail}
          readOnly
          className={`${inputClass} bg-muted`}
        />
      </div>

      <div>
        <label
          htmlFor="customerPhone"
          className="text-sm font-medium"
        >
          Phone Number
        </label>

        <input
          id="customerPhone"
          name="customerPhone"
          type="tel"
          required
          minLength={7}
          maxLength={20}
          placeholder="Enter your phone number"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="text-sm font-medium"
        >
          Service Address
        </label>

        <textarea
          id="address"
          name="address"
          required
          minLength={5}
          rows={3}
          placeholder="Enter your complete address"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="preferredDate"
          className="text-sm font-medium"
        >
          Preferred Date
        </label>

        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          required
          min={minDate}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="problemDescription"
          className="text-sm font-medium"
        >
          Describe Your Problem
        </label>

        <textarea
          id="problemDescription"
          name="problemDescription"
          required
          minLength={20}
          rows={4}
          placeholder="Describe the device problem in at least 20 characters"
          className={inputClass}
        />
      </div>

      {message && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Submitting Request..." : "Submit Repair Request"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        No payment is required now. Pay after the technician
        completes your repair.
      </p>
    </form>
  );
};

export default RepairRequestForm;

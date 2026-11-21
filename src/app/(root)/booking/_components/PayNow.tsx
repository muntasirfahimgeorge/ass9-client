
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/lib/action/booking";

const RepairRequestForm = ({ serviceId }: { serviceId: string }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const result = await createBooking({
      serviceId,
      customerPhone: String(formData.get("customerPhone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      preferredDate: String(formData.get("preferredDate") || ""),
      problemDescription: String(
        formData.get("problemDescription") || ""
      ).trim(),
    });

    setLoading(false);
    setMessage(result.message);

    if (result.success) {
      setSuccess(true);
      event.currentTarget.reset();
      router.push("/dashboard/customer/bookings");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Repair Request Details</h2>

      <div className="space-y-1">
        <label htmlFor="customerPhone" className="text-sm font-medium">
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
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="address" className="text-sm font-medium">
          Repair Address
        </label>
        <textarea
          id="address"
          name="address"
          required
          minLength={5}
          rows={3}
          placeholder="Enter your full repair address"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="preferredDate" className="text-sm font-medium">
          Preferred Date
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="problemDescription" className="text-sm font-medium">
          Describe the Problem
        </label>
        <textarea
          id="problemDescription"
          name="problemDescription"
          required
          minLength={20}
          rows={4}
          placeholder="Describe the device problem (at least 20 characters)"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {message && (
        <p
          role="status"
          className={`text-sm ${
            success ? "text-green-600" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting Request..." : "Submit Repair Request"}
      </Button>

      <p className="text-xs text-muted-foreground">
        You will be able to pay after the technician completes your repair.
      </p>
    </form>
  );
};

export default RepairRequestForm;

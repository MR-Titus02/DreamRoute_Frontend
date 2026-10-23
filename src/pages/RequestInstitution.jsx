import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton"; 
import ThemeToggle from "@/components/ThemeToggle";

export default function RequestInstitution() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: user?.email || "", // prefill if available
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/institutions/requests", {
        ...formData,
        user_id: user?.id,
      });
      setStatus("submitted");
    } catch (err) {
      console.error("Request failed:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/" label="Back" />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-card p-8 rounded-2xl shadow-lg text-card-foreground space-y-6 border border-border">
        <h2 className="text-3xl font-bold text-foreground text-center">
          Apply to Become an Institution
        </h2>

        <label htmlFor="institution-name" className="block text-sm font-medium">
          Institution name
        </label>
        <Input
          id="institution-name"
          name="name"
          placeholder="Institution Name"
          className="bg-background text-foreground"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label htmlFor="institution-email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="institution-email"
          name="email"
          placeholder="Email"
          type="email"
          className="bg-background text-foreground"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <label htmlFor="institution-description" className="block text-sm font-medium">
          Description
        </label>
        <Input
          id="institution-description"
          name="description"
          placeholder="Description"
          className="bg-background text-foreground"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <label htmlFor="institution-address" className="block text-sm font-medium">
          Address
        </label>
        <Input
          id="institution-address"
          name="address"
          placeholder="Address"
          className="bg-background text-foreground"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl py-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit Request"}
        </Button>

        {status === "submitted" && (
          <p role="status" className="text-success text-sm text-center">
            ✅ Request submitted! Please wait for admin approval.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-error text-sm text-center">
            ❌ Something went wrong. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
}

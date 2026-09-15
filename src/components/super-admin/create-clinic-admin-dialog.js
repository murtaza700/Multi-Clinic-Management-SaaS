"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateClinicAdminDialog({ clinics = [] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clinicId: "",
    name: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/clinic-admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinicId: formData.clinicId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create clinic admin."
        );
      }

      setFormData({
        clinicId: "",
        name: "",
        email: "",
        password: "",
      });

      setOpen(false);

      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-112.5">
        <DialogHeader>
          <DialogTitle>Create Clinic Admin</DialogTitle>

          <DialogDescription>
            Select a clinic and create its admin account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Clinic */}
          <div className="space-y-2">
            <Label htmlFor="clinicId">Clinic</Label>

            <select
              id="clinicId"
              name="clinicId"
              value={formData.clinicId}
              onChange={handleChange}
              disabled={loading}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select clinic</option>

              {clinics.map((clinic) => (
                <option
                  key={clinic._id}
                  value={clinic._id}
                >
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Admin Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Admin Name</Label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter admin name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Admin Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
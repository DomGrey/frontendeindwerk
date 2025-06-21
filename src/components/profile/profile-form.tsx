"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateProfileData } from "@/lib/types/api";

interface ProfileFormProps {
  onSubmit: (data: UpdateProfileData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProfileForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: ProfileFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: UpdateProfileData = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) {
      dataToSubmit.password = formData.password;
      dataToSubmit.password_confirmation = formData.password_confirmation;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          Leave the fields below blank if you don't want to change your
          password.
        </p>
      </div>
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="password_confirmation">Confirm New Password</Label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

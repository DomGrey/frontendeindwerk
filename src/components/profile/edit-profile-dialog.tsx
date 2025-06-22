"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";
import type { UpdateProfileData } from "@/lib/types/api";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateProfileData) => void;
  isSubmitting?: boolean;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

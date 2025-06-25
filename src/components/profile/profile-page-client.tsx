"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/context/auth-context";
import { EditProfileDialog } from "./edit-profile-dialog";
import { updateProfile } from "@/lib/api/auth";
import { toast } from "react-toastify";
import type { UpdateProfileData } from "@/lib/types/api";

export function ProfilePageClient() {
  const { user, token, setUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleProfileUpdate = async (data: UpdateProfileData) => {
    if (!token) {
      toast.error("Authentication error.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedUser = await updateProfile(token, data);
      if (setUser) {
        setUser(updatedUser);
      }
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profile_photo_url} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Profile Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can see Your Closet
                </p>
              </div>
              <Button variant="outline">Private</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Account Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account preferences
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your notification settings
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </div>
        </div>
      </div>
      <EditProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleProfileUpdate}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

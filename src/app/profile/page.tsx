import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-xl">VC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">User Name</h2>
            <p className="text-muted-foreground">user@example.com</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Control who can see your virtual closet
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
            <Button variant="outline">Edit</Button>
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
  );
}

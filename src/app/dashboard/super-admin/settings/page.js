import { redirect } from "next/navigation";
import { auth } from "@/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SuperAdminSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "super-admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your Super Admin account and platform settings.
          </p>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>

            <CardDescription>
              Your Super Admin account information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>

                <Input value={session.user.name || ""} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>

                <Input value={session.user.email || ""} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>

                <Input value="Super Admin" readOnly />
              </div>

              <div className="space-y-2">
                <Label>Authentication Provider</Label>

                <Input
                  value={session.user.provider || "credentials"}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>

            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>

                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>

                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Platform Information */}
        <Card>
          <CardHeader>
            <CardTitle>Platform</CardTitle>

            <CardDescription>
              Basic information about your clinic management platform.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Platform Name</p>
                  <p className="text-sm text-muted-foreground">
                    Name displayed across the application.
                  </p>
                </div>

                <p className="font-medium">ClinicCare</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Account Role</p>
                  <p className="text-sm text-muted-foreground">
                    Your access level on the platform.
                  </p>
                </div>

                <p className="font-medium">Super Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

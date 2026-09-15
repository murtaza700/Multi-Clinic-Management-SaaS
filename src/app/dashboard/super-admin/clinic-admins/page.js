import { redirect } from "next/navigation";
import { auth } from "@/auth";

import connectDB from "@/lib/db";
import User from "@/models/User";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ClinicAdminsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "super-admin") {
    redirect("/dashboard");
  }

  await connectDB();

  const adminsData = await User.find({
    role: "clinic-admin",
  })
    .populate("clinicId", "name")
    .sort({ createdAt: -1 })
    .lean();

  const admins = adminsData.map((admin) => ({
    _id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    image: admin.image,
    clinic: admin.clinicId
      ? {
          _id: admin.clinicId._id.toString(),
          name: admin.clinicId.name,
        }
      : null,
    createdAt: admin.createdAt?.toISOString(),
  }));

  const totalAdmins = admins.length;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Clinic Admins
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage administrators responsible for each clinic.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clinic Admins
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{totalAdmins}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assigned Admins
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">
                {admins.filter((admin) => admin.clinic).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unassigned Admins
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">
                {admins.filter((admin) => !admin.clinic).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clinic Admins Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clinic Admins</CardTitle>
          </CardHeader>

          <CardContent>
            {admins.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No clinic admins found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin._id}>
                        {/* Admin */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                              {admin.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {admin.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Clinic Administrator
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>{admin.email}</TableCell>

                        {/* Clinic */}
                        <TableCell>
                          {admin.clinic ? (
                            <span className="font-medium">
                              {admin.clinic.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Not assigned
                            </span>
                          )}
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <Badge variant="secondary">Clinic Admin</Badge>
                        </TableCell>

                        {/* Created */}
                        <TableCell>
                          {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

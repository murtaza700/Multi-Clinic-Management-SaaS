import { redirect } from "next/navigation";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Clinic from "@/models/Clinic";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import CreateClinicDialog from "@/components/super-admin/create-clinic-dialog";
import CreateClinicAdminDialog from "@/components/super-admin/create-clinic-admin-dialog";

export default async function ClinicsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "super-admin") {
    redirect("/login");
  }

  await connectDB();

  const clinicsData = await Clinic.find()
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB/Mongoose values into plain serializable objects
  const clinics = clinicsData.map((clinic) => ({
    _id: clinic._id.toString(),
    name: clinic.name,
    email: clinic.email,
    phone: clinic.phone,
    address: clinic.address,
    description: clinic.description,
    slug: clinic.slug,
    logo: clinic.logo,
    isActive: clinic.isActive,
    openingHours: clinic.openingHours,
    createdAt: clinic.createdAt?.toISOString(),
    updatedAt: clinic.updatedAt?.toISOString(),
  }));

  const totalClinics = clinics.length;

  const activeClinics = clinics.filter(
    (clinic) => clinic.isActive
  ).length;

  const inactiveClinics = totalClinics - activeClinics;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Clinics
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage all clinics registered on your platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CreateClinicDialog />

            <CreateClinicAdminDialog clinics={clinics} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clinics
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">
                {totalClinics}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Clinics
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">
                {activeClinics}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inactive Clinics
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">
                {inactiveClinics}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clinics Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clinics</CardTitle>
          </CardHeader>

          <CardContent>
            {clinics.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No clinics found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {clinics.map((clinic) => (
                      <TableRow key={clinic._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {clinic.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              /{clinic.slug}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          {clinic.email}
                        </TableCell>

                        <TableCell>
                          {clinic.phone}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              clinic.isActive
                                ? "default"
                                : "secondary"
                            }
                          >
                            {clinic.isActive
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                          >
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
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

export default async function PatientsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "super-admin") {
    redirect("/dashboard");
  }

  await connectDB();

  const patientsData = await User.find({
    role: "patient",
  })
    .populate("clinicId", "name")
    .sort({ createdAt: -1 })
    .lean();

  const patients = patientsData.map((patient) => ({
    _id: patient._id.toString(),
    name: patient.name,
    email: patient.email,
    image: patient.image,
    clinic: patient.clinicId
      ? {
          _id: patient.clinicId._id.toString(),
          name: patient.clinicId.name,
        }
      : null,
    provider: patient.provider,
    createdAt: patient.createdAt?.toISOString(),
  }));

  const totalPatients = patients.length;

  const clinicPatients = patients.filter((patient) => patient.clinic).length;

  const unassignedPatients = totalPatients - clinicPatients;

  const googlePatients = patients.filter(
    (patient) => patient.provider === "google",
  ).length;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Patients</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage all patients registered on your platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{totalPatients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assigned to Clinic
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{clinicPatients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unassigned
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{unassignedPatients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
          </CardHeader>

          <CardContent>
            {patients.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No patients found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient._id}>
                        {/* Patient */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                              {patient.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {patient.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Patient
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>{patient.email}</TableCell>

                        {/* Clinic */}
                        <TableCell>
                          {patient.clinic ? (
                            <span className="font-medium">
                              {patient.clinic.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Not assigned
                            </span>
                          )}
                        </TableCell>

                        {/* Provider */}
                        <TableCell>
                          <Badge
                            variant={
                              patient.provider === "google"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {patient.provider === "google"
                              ? "Google"
                              : "Credentials"}
                          </Badge>
                        </TableCell>

                        {/* Registered */}
                        <TableCell>
                          {patient.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString()
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

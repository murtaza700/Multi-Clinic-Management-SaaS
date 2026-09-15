import {
  Building2,
  Users,
  Stethoscope,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Clinic from "@/models/Clinic";
import User from "@/models/User";
import Doctor from "@/models/Doctor";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SuperAdminDashboard() {
  const session = await auth();

  if (!session?.user) redirect("/dashboard");
  if (session.user.role !== "super-admin") redirect("/login");
  await connectDB();

  const [
    totalClinics,
    totalClinicAdmins,
    totalDoctors,
    totalPatients,
    recentClinics,
  ] = await Promise.all([
    Clinic.countDocuments(),
    User.countDocuments({ role: "clinic-admin" }),
    Doctor.countDocuments(),
    User.countDocuments({ role: "patient" }),
    Clinic.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email slug isActive createdAt")
      .lean(),
  ]);

  const stats = [
    {
      title: "Total Clinics",
      value: totalClinics,
      icon: Building2,
    },
    {
      title: "Clinic Admins",
      value: totalClinicAdmins,
      icon: Users,
    },
    {
      title: "Doctors",
      value: totalDoctors,
      icon: Stethoscope,
    },
    {
      title: "Patients",
      value: totalPatients,
      icon: UserRound,
    },
  ];

  return (
    <main className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">
            Overview of your clinic management system.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="text-muted-foreground size-5" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Clinics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Clinics</CardTitle>
        </CardHeader>

        <CardContent>
          {recentClinics.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center">
              <p className="text-muted-foreground">No clinics found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentClinics.map((clinic) => (
                    <TableRow key={clinic._id.toString()}>
                      <TableCell className="font-medium">
                        {clinic.name}
                      </TableCell>

                      <TableCell>{clinic.email}</TableCell>

                      <TableCell className="text-muted-foreground">
                        {clinic.slug}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={clinic.isActive ? "default" : "secondary"}
                        >
                          {clinic.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

import Link from "next/link";

import connectDB from "@/lib/db";
import Clinic from "@/models/Clinic";
import User from "@/models/User";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Building2,
  Users,
  UserRound,
  Activity,
  ArrowRight,
} from "lucide-react";

export default async function SuperAdminPage() {
  await connectDB();

  const [totalClinics, activeClinics, clinicAdmins, patients, recentClinics] =
    await Promise.all([
      Clinic.countDocuments(),

      Clinic.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        role: "clinic-admin",
      }),

      User.countDocuments({
        role: "patient",
      }),

      Clinic.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email slug isActive createdAt")
        .lean(),
    ]);

  const inactiveClinics = totalClinics - activeClinics;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your ClinicCare platform from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Clinics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clinics
              </CardTitle>

              <Building2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{totalClinics}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                All registered clinics
              </p>
            </CardContent>
          </Card>

          {/* Active Clinics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Clinics
              </CardTitle>

              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{activeClinics}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          {/* Clinic Admins */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clinic Admins
              </CardTitle>

              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{clinicAdmins}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Registered clinic admins
              </p>
            </CardContent>
          </Card>

          {/* Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Patients
              </CardTitle>

              <UserRound className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold">{patients}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Registered patients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clinic Status */}
        <Card>
          <CardHeader>
            <CardTitle>Clinic Status</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Active Clinics
                  </p>

                  <Badge>Active</Badge>
                </div>

                <p className="mt-2 text-2xl font-semibold">{activeClinics}</p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Inactive Clinics
                  </p>

                  <Badge variant="secondary">Inactive</Badge>
                </div>

                <p className="mt-2 text-2xl font-semibold">{inactiveClinics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Clinics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Clinics</CardTitle>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="inline-flex items-center whitespace-nowrap"
            >
              <Link
                href="/dashboard/super-admin/clinics"
                className="inline-flex items-center"
              >
                <span>View all</span>
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {recentClinics.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No clinics found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentClinics.map((clinic) => (
                  <div
                    key={clinic._id.toString()}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{clinic.name}</p>

                      <p className="truncate text-sm text-muted-foreground">
                        {clinic.email}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <Badge
                        variant={clinic.isActive ? "default" : "secondary"}
                      >
                        {clinic.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <span className="hidden text-sm text-muted-foreground sm:block">
                        /{clinic.slug}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/super-admin/clinics"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Clinics</span>
              </Link>

              <Link
                href="/dashboard/super-admin/clinic-admins"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Users className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Admins</span>
              </Link>

              <Link
                href="/dashboard/super-admin/patients"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Patients</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

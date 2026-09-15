import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  // Role-based dashboard redirect
  switch (role) {
    case "super-admin":
      redirect("/dashboard/super-admin");

    case "clinic-admin":
      redirect("/dashboard/clinic-admin");

    case "doctor":
      redirect("/dashboard/doctor");

    case "receptionist":
      redirect("/dashboard/receptionist");

    case "patient":
      redirect("/dashboard/patient");

    default:
      redirect("/login");
  }
}
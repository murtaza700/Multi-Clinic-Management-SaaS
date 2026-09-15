import { auth } from "@/auth";
import SuperAdminSidebar from "@/components/super-admin/super-admin-sidebar";
import { redirect } from "next/navigation";

export default async function SuperAdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role !== "super-admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <SuperAdminSidebar />

        {/* Main Content */}
        <main className="min-w-0 flex-1 lg:ml-0">
          <div className="min-h-screen pt-16 lg:pt-0">{children}</div>
        </main>
      </div>
    </div>
  );
}

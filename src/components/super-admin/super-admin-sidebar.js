"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    title: "Overview",
    href: "/dashboard/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Clinics",
    href: "/dashboard/super-admin/clinics",
    icon: Building2,
  },
  {
    title: "Clinic Admins",
    href: "/dashboard/super-admin/clinic-admins",
    icon: Users,
  },
  {
    title: "Patients",
    href: "/dashboard/super-admin/patients",
    icon: UserRound,
  },
];

const systemNavigation = [
  {
    title: "Settings",
    href: "/dashboard/super-admin/settings",
    icon: Settings,
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href) {
    if (href === "/dashboard/super-admin") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/dashboard/super-admin"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold">ClinicCare</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div>
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System
          </p>

          <nav className="space-y-1">
            {systemNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Super Admin</p>
            <p className="truncate text-xs text-muted-foreground">
              Administrator
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 border-r bg-background lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b bg-background px-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">ClinicCare</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileMenu}
        />

        {/* Sidebar */}
        <aside
          className={`relative h-full w-72 bg-background shadow-xl transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10"
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>

          {sidebarContent}
        </aside>
      </div>
    </>
  );
}

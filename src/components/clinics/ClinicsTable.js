"use client";

import Link from "next/link";

export default function ClinicsTable({ clinics }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                Clinic
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">
                Status
              </th>

              <th className="px-6 py-4 text-right text-sm font-medium text-white/60">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {clinics.map((clinic) => (
              <tr
                key={clinic._id}
                className="border-b border-white/10 last:border-0"
              >
                <td className="px-6 py-4 font-medium">{clinic.name}</td>

                <td className="px-6 py-4 text-white/60">{clinic.email}</td>

                <td className="px-6 py-4 text-white/60">{clinic.phone}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      clinic.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {clinic.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/dashboard/super-admin/clinics/${clinic._id}`}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

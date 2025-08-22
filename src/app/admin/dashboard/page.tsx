
"use client";

import { DashboardView } from "@/components/admin/dashboard-view";
import { useAdminContext } from "@/app/admin/admin-context";

export default function AdminDashboardPage() {
  const { slots } = useAdminContext();
  return (
      <DashboardView slots={slots} />
  );
}

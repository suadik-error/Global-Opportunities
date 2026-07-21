"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Ban, RotateCcw } from "lucide-react";
import { staffStore, type StaffMember, type StaffRole } from "@/lib/mock-staff";

const ROLES: StaffRole[] = ["Super Admin", "Moderator", "Support"];

export default function StaffDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember | undefined>(
    staffStore.members.find((s) => s.id === params.id)
  );

  useEffect(() => {
    const sync = () => setStaff(staffStore.members.find((s) => s.id === params.id));
    sync();
    const unsubscribe = staffStore.subscribe(sync);
    return unsubscribe;
  }, [params.id]);

  if (!staff) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Staff member not found.</p>
        <Link href="/staff" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Staff
        </Link>
      </div>
    );
  }

  const isActive = staff.status === "active";

  return (
    <div className="max-w-lg">
      <button
        onClick={() => router.push("/staff")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Staff
      </button>

      <h1 className="text-xl font-bold text-kb-text-body">{staff.name}</h1>
      <p className="text-sm text-kb-text-muted mt-1 mb-6">{staff.email} · Joined {staff.joinedDate}</p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">Role</p>
        <div className="flex gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => staffStore.updateRole(staff.id, role)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                staff.role === role
                  ? "bg-kb-primary text-white"
                  : "bg-kb-bg-alt border border-kb-border text-kb-text-muted"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => staffStore.toggleStatus(staff.id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          isActive
            ? "bg-red-50 hover:bg-red-100 text-red-600"
            : "bg-green-50 hover:bg-green-100 text-green-700"
        }`}
      >
        {isActive ? <Ban size={16} strokeWidth={2.5} /> : <RotateCcw size={16} strokeWidth={2.5} />}
        {isActive ? "Suspend access" : "Reinstate access"}
      </button>
    </div>
  );
}

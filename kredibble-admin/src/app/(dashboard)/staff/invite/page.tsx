"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserPlus } from "lucide-react";
import { staffStore, type StaffRole } from "@/lib/mock-staff";

const ROLES: StaffRole[] = ["Super Admin", "Moderator", "Support"];

export default function InviteStaffPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Support");

  const isValid = name.trim() && email.trim();

  const handleInvite = () => {
    if (!isValid) return;
    staffStore.invite(name.trim(), email.trim(), role);
    router.push("/staff");
  };

  return (
    <div className="max-w-md">
      <button
        onClick={() => router.push("/staff")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Staff
      </button>

      <h1 className="text-xl font-bold text-kb-text-body mb-1">Invite Staff</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        Add a new admin/support account and assign their permission tier.
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-kb-text-body mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ama Boateng"
            className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-kb-text-body mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ama.boateng@kredibble.com"
            className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-kb-text-body mb-1.5">Role</label>
          <div className="flex gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  role === r
                    ? "bg-kb-primary text-white"
                    : "bg-kb-bg-alt border border-kb-border text-kb-text-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleInvite}
          disabled={!isValid}
          className="flex items-center justify-center gap-2 h-11 rounded-lg bg-kb-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity mt-2"
        >
          <UserPlus size={15} />
          Send Invite
        </button>
      </div>
    </div>
  );
}

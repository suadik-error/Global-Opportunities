"use client";

import { useState } from "react";
import { Check, X, Lock } from "lucide-react";

type EditableRole = "Moderator" | "Support";

interface PermissionRow {
  key: string;
  label: string;
  superAdmin: boolean; // fixed — Super Admin always has full access
}

const PERMISSIONS: PermissionRow[] = [
  { key: "verifications", label: "Approve/reject verifications", superAdmin: true },
  { key: "moderate", label: "Moderate opportunities & community", superAdmin: true },
  { key: "suspend", label: "Suspend seeker/hirer accounts", superAdmin: true },
  { key: "content", label: "Manage reference data & content", superAdmin: true },
  { key: "broadcast", label: "Send platform-wide notifications", superAdmin: true },
  { key: "staff", label: "Manage staff & permissions", superAdmin: true },
];

// Defaults mirror what Moderator/Support could do before this page existed.
const initialGrants: Record<EditableRole, Record<string, boolean>> = {
  Moderator: {
    verifications: true,
    moderate: true,
    suspend: true,
    content: false,
    broadcast: false,
    staff: false,
  },
  Support: {
    verifications: false,
    moderate: false,
    suspend: true,
    content: false,
    broadcast: false,
    staff: false,
  },
};

export default function RolesPermissionsPage() {
  const [grants, setGrants] = useState(initialGrants);

  const toggle = (role: EditableRole, key: string) => {
    setGrants((prev) => ({
      ...prev,
      [role]: { ...prev[role], [key]: !prev[role][key] },
    }));
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Roles & Permissions</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        As Super Admin, enable or disable which permissions Moderator and Support staff are granted.
        Super Admin always retains full access.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* Super Admin — fixed */}
        <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-kb-text-body">Super Admin</p>
            <Lock size={12} className="text-kb-text-placeholder" />
          </div>
          <p className="text-xs text-kb-text-muted mt-1 mb-4">
            Full platform access — not editable.
          </p>
          <div className="flex flex-col gap-2.5">
            {PERMISSIONS.map((perm) => (
              <div key={perm.key} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check size={11} color="#16A34A" strokeWidth={3} />
                </div>
                <span className="text-xs text-kb-text-body">{perm.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Moderator & Support — editable */}
        {(["Moderator", "Support"] as EditableRole[]).map((role) => (
          <div key={role} className="bg-kb-bg-card border border-kb-border rounded-2xl p-5">
            <p className="text-sm font-bold text-kb-text-body">{role}</p>
            <p className="text-xs text-kb-text-muted mt-1 mb-4">
              Click a permission to grant or revoke it.
            </p>
            <div className="flex flex-col gap-2.5">
              {PERMISSIONS.map((perm) => {
                const granted = grants[role][perm.key];
                return (
                  <button
                    key={perm.key}
                    onClick={() => toggle(role, perm.key)}
                    className="flex items-center gap-2.5 text-left group"
                  >
                    {granted ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center shrink-0 transition-colors">
                        <Check size={11} color="#16A34A" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
                        <X size={11} className="text-gray-400 group-hover:text-red-500" strokeWidth={3} />
                      </div>
                    )}
                    <span className={`text-xs ${granted ? "text-kb-text-body" : "text-kb-text-placeholder"}`}>
                      {perm.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

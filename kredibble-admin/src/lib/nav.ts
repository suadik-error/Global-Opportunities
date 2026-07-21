import {
  LayoutDashboard, ShieldCheck, Briefcase, Users, Building2, Hash,
  Flag, FileText, GraduationCap, Factory, Landmark, CalendarDays,
  HandCoins, Send, History, UserCog, KeyRound, BarChart3,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  built: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// `built: false` items would show a "Coming soon" badge instead of linking
// out — all 28 planned pages are now built, so every item below is live.
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, built: true },
      { label: "Platform Analytics", href: "/analytics", icon: BarChart3, built: true },
    ],
  },
  {
    title: "Verification",
    items: [
      { label: "Verification Queue", href: "/verification", icon: ShieldCheck, built: true },
    ],
  },
  {
    title: "Opportunities",
    items: [
      { label: "Opportunities Queue", href: "/opportunities", icon: Briefcase, built: true },
    ],
  },
  {
    title: "Users & Companies",
    items: [
      { label: "Seekers", href: "/seekers", icon: Users, built: true },
      { label: "Hirers", href: "/hirers", icon: Building2, built: true },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Channels", href: "/community", icon: Hash, built: true },
    ],
  },
  {
    title: "Trust & Safety",
    items: [
      { label: "Reports Queue", href: "/reports", icon: Flag, built: true },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Career Resources", href: "/content/articles", icon: FileText, built: true },
    ],
  },
  {
    title: "Reference Data",
    items: [
      { label: "Seeker Taxonomy", href: "/taxonomy/seeker", icon: GraduationCap, built: true },
      { label: "Hirer Taxonomy", href: "/taxonomy/hirer", icon: Factory, built: true },
      { label: "Grants Taxonomy", href: "/taxonomy/grants", icon: Landmark, built: true },
    ],
  },
  {
    title: "Events & Grants",
    items: [
      { label: "Events", href: "/events", icon: CalendarDays, built: true },
      { label: "Grants", href: "/grants", icon: HandCoins, built: true },
    ],
  },
  {
    title: "Notifications",
    items: [
      { label: "Composer", href: "/notifications/compose", icon: Send, built: true },
      { label: "History", href: "/notifications/history", icon: History, built: true },
    ],
  },
  {
    title: "Admin Team",
    items: [
      { label: "Staff", href: "/staff", icon: UserCog, built: true },
      { label: "Roles & Permissions", href: "/roles", icon: KeyRound, built: true },
    ],
  },
];

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 min-h-screen bg-kb-bg-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}

import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 max-w-7xl mx-auto w-full gap-8 pt-8 lg:pt-12">
      <Sidebar />
      <div className="flex-1 pb-12 px-4 sm:px-6 lg:px-0">
        {children}
      </div>
    </div>
  );
}

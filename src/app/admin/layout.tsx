import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session.isAuth || session.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform <span className="text-accent-rose">Admin</span></h1>
          <p className="text-sm text-foreground-muted mt-1">Manage global platform content and settings.</p>
        </div>
        <Link href="/" className="text-sm text-foreground-muted hover:text-foreground flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Main Site
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <AdminSidebar />
        </aside>

        <main className="lg:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}

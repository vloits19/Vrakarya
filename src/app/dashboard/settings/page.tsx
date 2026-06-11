import { verifySession } from "@/lib/auth";
import { db } from "@/config/database";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { SettingsProfileForm } from "./SettingsProfileForm";

export const metadata = {
  title: "Settings — Dashboard",
};

export default async function SettingsPage() {
  const session = await verifySession();
  
  if (!session.isAuth || !session.userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-foreground-muted mt-2">
          Manage your account settings and profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <a href="#profile" className="block px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg">
              Profile
            </a>
            <a href="#account" className="block px-3 py-2 text-sm font-medium text-foreground-muted hover:bg-background-secondary rounded-lg transition-colors pointer-events-none opacity-50">
              Account (Coming Soon)
            </a>
            <a href="#notifications" className="block px-3 py-2 text-sm font-medium text-foreground-muted hover:bg-background-secondary rounded-lg transition-colors pointer-events-none opacity-50">
              Notifications (Coming Soon)
            </a>
          </nav>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden bg-background-secondary/10 backdrop-blur-md border border-glass-border shadow-2xl">
            <div className="bg-gradient-to-r from-background-secondary to-background-tertiary p-6 border-b border-glass-border">
              <h2 id="profile" className="text-xl font-bold text-foreground">Profile Information</h2>
              <p className="text-sm text-foreground-muted mt-1">This information will be displayed publicly so be careful what you share.</p>
            </div>
            <div className="p-6">
              <SettingsProfileForm 
                initialData={{
                  displayName: user.displayName,
                  username: user.username,
                  bio: user.bio || "",
                  avatarUrl: user.avatarUrl || "",
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, Button } from "@/components/ui";
import { Globe, Link as LinkIcon, Save } from "lucide-react";

export const metadata = {
  title: "Admin Settings — Vrakarya",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Platform Settings</h2>
        <p className="text-sm text-foreground-muted">Configure global platform metadata and external integrations.</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-base font-bold text-foreground">General Configuration</h3>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground-dim mb-1.5">Platform Name</label>
              <input 
                type="text" 
                defaultValue="Vrakarya" 
                className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-dim mb-1.5">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@vrakarya.dev" 
                className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Global External Links */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Official External Links</h3>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground-dim mb-1.5">Official Twitter/X URL</label>
              <input 
                type="url" 
                defaultValue="https://twitter.com/vrakarya" 
                className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-dim mb-1.5">Official Discord Invite</label>
              <input 
                type="url" 
                defaultValue="https://discord.gg/vrakarya" 
                className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-dim mb-1.5">GitHub Organization</label>
              <input 
                type="url" 
                defaultValue="https://github.com/vrakarya" 
                className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm">
                <Save className="w-4 h-4 mr-2" /> Save Links
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { updateProfile } from "@/app/actions/user";
import { Loader2, CheckCircle2, AlertCircle, Camera, User, Link as LinkIcon, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsProfileFormProps {
  initialData: {
    displayName: string;
    username: string;
    bio: string;
    avatarUrl: string;
  };
}

export function SettingsProfileForm({ initialData }: SettingsProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(initialData.avatarUrl);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      router.refresh(); 
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
      {/* Notifications */}
      {error && (
        <div className="p-4 bg-accent-rose/10 border border-accent-rose/20 rounded-xl flex items-start gap-3 text-sm text-accent-rose shadow-lg shadow-accent-rose/5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-sm text-emerald-500 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>Profile updated successfully! Looking good.</p>
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-6 border-b border-glass-border">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-background-secondary bg-background-tertiary shadow-xl flex items-center justify-center transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/20">
            {previewAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-foreground-muted" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm pointer-events-none rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          <label htmlFor="avatarUrl" className="block text-sm font-semibold text-foreground">
            Profile Picture URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-foreground-muted" />
            </div>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              placeholder="https://example.com/avatar.png"
              defaultValue={initialData.avatarUrl}
              onChange={(e) => setPreviewAvatar(e.target.value)}
              className="pl-9 w-full bg-background-secondary/50 focus:bg-background-secondary transition-colors"
            />
          </div>
          <p className="text-xs text-foreground-dim">
            Paste a direct URL to an image. Square images work best.
          </p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="displayName" className="block text-sm font-semibold text-foreground">
            Display Name
          </label>
          <Input
            id="displayName"
            name="displayName"
            placeholder="Your Display Name"
            defaultValue={initialData.displayName}
            className="bg-background-secondary/50 focus:bg-background-secondary transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold text-foreground">
            Username
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-foreground-muted font-medium select-none">@</span>
            <Input
              id="username"
              name="username"
              placeholder="username"
              defaultValue={initialData.username}
              className="pl-8 bg-background-secondary/50 focus:bg-background-secondary transition-colors font-mono text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-semibold text-foreground flex items-center justify-between">
          <span>Bio</span>
          <span className="text-xs font-normal text-foreground-dim">Make it catchy</span>
        </label>
        <div className="relative group">
          <div className="absolute top-3 left-3 pointer-events-none text-foreground-muted transition-colors group-focus-within:text-accent-cyan">
            <Edit3 className="w-4 h-4" />
          </div>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            placeholder="Tell the community about yourself, what you build, and what games you love..."
            defaultValue={initialData.bio}
            className="w-full pl-10 pr-4 py-3 bg-background-secondary/50 hover:bg-background-secondary/80 focus:bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all resize-y"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-glass-border">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="min-w-[140px] bg-gradient-to-r from-primary to-accent-cyan hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

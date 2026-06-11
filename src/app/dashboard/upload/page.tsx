"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { ContentUploader } from "@/components/ui/ContentUploader";
import { TagInput } from "@/components/ui/TagInput";
import { ShowcaseMedia, Tag } from "@/types";
import { AlertTriangle, ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPost } from "@/app/actions/feed";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("concept");
  const [media, setMedia] = useState<ShowcaseMedia[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (media.length === 0) {
      setError("Please upload at least one media file.");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description || "No description provided.");
    
    if (media.length > 0) {
      formData.set("file", media[0].file);
      formData.set("type", media[0].type);
    }

    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Upload Showcase Content</h1>
          <p className="text-sm text-foreground-muted">Share your latest work, concept art, or game prototypes.</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/20 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-accent-rose shrink-0 mt-0.5" />
          <p className="text-sm text-accent-rose">{error}</p>
        </div>
      )}

      {/* Guidelines Alert */}
      <div className="p-4 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex gap-4">
        <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-accent-amber mb-1">Showcase Content Only</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Please only upload visual or audio showcase content. Do not upload playable game builds, project archives (e.g., .zip, .rar), or engine packages (e.g., .unitypackage). 
            For games, please provide links to your repository or store pages in your project settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Media Upload</h2>
            <ContentUploader onFilesChange={setMedia} />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold">Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title <span className="text-accent-rose">*</span></label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Character Concept Art, Level 1 Playthrough" 
                required 
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you are showcasing..."
                className="w-full h-32 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Stage</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all appearance-none"
                >
                  <option value="concept">Concept Art / Prototyping</option>
                  <option value="in-development">In Development</option>
                  <option value="early-access">Early Access</option>
                  <option value="released">Released</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Tags</label>
                <TagInput 
                  tags={tags} 
                  onChange={setTags} 
                  suggestedTags={[]} 
                  placeholder="e.g., Pixel Art, 3D Model"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || !title || media.length === 0} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import type { Tag } from "@/types";
import { checkProfanity } from "@/lib/moderation/client-filter";

export default function AdminCategoriesPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    // --- Profanity Check ---
    const matched = checkProfanity(newTagName.trim());
    if (matched) {
      setError("Category name contains prohibited content. Please choose a different name.");
      return;
    }
    setError(null);

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      slug: newTagName.trim().toLowerCase().replace(/\s+/g, '-'),
    };

    setTags([...tags, newTag]);
    setNewTagName("");
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Categories & Tags</h2>
        <p className="text-sm text-foreground-muted">Manage global taxonomy used for filtering projects and posts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Category */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-base font-bold text-foreground mb-4">Create Category</h3>
            <form onSubmit={addTag} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-dim uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => { setNewTagName(e.target.value); setError(null); }}
                  placeholder="e.g. Action RPG"
                  className="w-full bg-background-secondary border border-glass-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              {error && (
                <p className="text-xs text-accent-rose font-medium">{error}</p>
              )}
              <Button type="submit" variant="primary" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </form>
          </Card>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-glass-border">
              {tags.map((tag) => (
                <div key={tag.id} className="p-4 flex items-center justify-between hover:bg-background-tertiary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background-secondary border border-glass-border flex items-center justify-center">
                      <TagIcon className="w-4 h-4 text-foreground-dim" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{tag.name}</h4>
                      <p className="text-xs text-foreground-muted font-mono mt-0.5">/{tag.slug}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteTag(tag.id)}
                    className="p-2 text-foreground-dim hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {tags.length === 0 && (
                <div className="p-8 text-center text-foreground-muted text-sm">
                  No categories found. Create one to get started.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

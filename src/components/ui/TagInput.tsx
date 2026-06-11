"use client";

import React, { useState, KeyboardEvent } from "react";
import { X, Tag as TagIcon } from "lucide-react";
import { Tag } from "@/types";
import { checkProfanity } from "@/lib/moderation/client-filter";

interface TagInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  suggestedTags?: Tag[];
}

export function TagInput({ tags, onChange, placeholder = "Add tags...", suggestedTags = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    // --- Profanity Check ---
    const matched = checkProfanity(trimmed);
    if (matched) {
      setInputValue("");
      return;
    }

    // Check if it already exists
    if (tags.some(t => t.name.toLowerCase() === trimmed)) {
      setInputValue("");
      return;
    }

    // Check if it's in suggested tags
    const suggested = suggestedTags.find(t => t.name.toLowerCase() === trimmed);
    
    const newTag: Tag = suggested || {
      // eslint-disable-next-line react-hooks/purity
      id: `tag-${Date.now()}`,
      name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      slug: trimmed.replace(/\s+/g, '-'),
    };

    onChange([...tags, newTag]);
    setInputValue("");
  };

  const removeTag = (id: string) => {
    onChange(tags.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 p-2 min-h-[42px] border border-border rounded-lg bg-background focus-within:border-accent-cyan focus-within:ring-1 focus-within:ring-accent-cyan transition-all">
        <TagIcon className="w-4 h-4 text-foreground-muted ml-2 shrink-0" />
        
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-background-secondary border border-border rounded-md text-foreground"
          >
            {tag.name}
            <button
              onClick={() => removeTag(tag.id)}
              className="text-foreground-muted hover:text-accent-rose transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted px-1"
        />
      </div>

      {/* Suggested Tags */}
      {suggestedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-foreground-muted py-1">Suggestions:</span>
          {suggestedTags.filter(st => !tags.some(t => t.id === st.id)).slice(0, 5).map(tag => (
            <button
              key={tag.id}
              onClick={() => onChange([...tags, tag])}
              className="px-2 py-1 text-xs text-foreground-dim bg-background-secondary rounded hover:text-foreground hover:bg-background-tertiary transition-colors"
            >
              + {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

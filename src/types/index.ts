// ============================================================
// Vrakarya — Core Type Definitions
// ============================================================

// --- User ---
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  skills?: string[];
  website?: string;
  location?: string;
  socialLinks?: SocialLinks;
  role: "user" | "developer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  discord?: string;
  itchio?: string;
  steam?: string;
}

// --- Project ---
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImageUrl?: string;
  galleryImages: string[];
  tags: Tag[];
  techStack: string[];
  status: ProjectStatus;
  isFeatured?: boolean;
  developer: User;
  links?: ProjectLinks;
  externalResources?: ExternalResource[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "concept"
  | "in-development"
  | "early-access"
  | "released"
  | "archived";

export type ResourceType = "github" | "itchio" | "gdrive" | "youtube" | "instagram" | "website" | "other";

export interface ExternalResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
}

export interface ProjectLinks {
  website?: string;
  repository?: string;
  itchio?: string;
  steam?: string;
  trailer?: string;
}

// --- Media ---
export interface ShowcaseMedia {
  id: string;
  file: File;
  previewUrl: string;
  thumbnailUrl?: string;
  type: "image" | "video" | "audio" | "model";
  name: string;
  size: number;
}

// --- Post (Feed) ---
export interface Post {
  id: string;
  author: User;
  project?: Project;
  title: string;
  content: string;
  imageUrl?: string;
  media?: ShowcaseMedia[];
  tags: Tag[];
  likeCount: number;
  commentCount: number;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Comment ---
export interface Comment {
  id: string;
  author: User;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Tag ---
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalViews: number;
  totalLikes: number;
  totalProjects: number;
  totalFollowers: number;
  viewsTrend: number; // percentage change
  likesTrend: number;
}

// --- Auth (placeholder) ---
export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  accessToken?: string;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

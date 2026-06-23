export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  technologies: string[];
  featured: boolean;
  createdAt?: any; // Firestore Timestamp or Date string
}

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: string;
  createdAt?: any;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: any;
  read: boolean;
}

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  image: string;
  createdAt?: any;
}

export interface GalleryItem {
  id?: string;
  url: string;
  name: string;
  uploadedAt: any;
}

export interface Skill {
  category: string; // "Frontend", "Backend", "Tools", etc.
  name: string;
  level: number; // percentage or level
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  fullDetails?: {
    overview: string;
    deliverables: string[];
    techStack: string[];
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  fullDescription?: string;
  capabilities: string[];
  imageUrl: string;
  featured?: boolean;
  client?: string;
  year?: string;
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
}

export interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml?: string;
  category: 'Technology' | 'Development' | 'Business' | 'Guides' | 'Design' | 'Culture';
  readTime: string;
  date: string;
  author: Author;
  featuredImage: string;
  caption?: string;
  tags: string[];
  isHero?: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  phaseLabel: string;
}

export interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ValuePoint {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SpecialistRole {
  role: string;
  category: string;
  icon: string;
  count: number;
  skills: string[];
}

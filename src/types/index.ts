export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface PracticeArea {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  keyServices: string[];
  icon: string;
  featured?: boolean;
}

export interface ValueProposition {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

export interface MethodologyStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  focusAreas: string[];
  initials: string;
  isFeatured?: boolean;
}

export interface InsightArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  date: string;
  isFeatured?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export interface FormStatus {
  submitted: boolean;
  success: boolean;
  message: string;
  isSubmitting: boolean;
}

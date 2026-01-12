// Portfolio and Website Types

export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    createdAt: Date;
}

export interface Website {
    id: string;
    userId: string;
    name: string;
    slug: string;
    templateId: string;
    themeConfig: ThemeConfig;
    metaData: WebsiteMeta;
    isPublished: boolean;
    publishedUrl?: string;
    customDomain?: string;
    createdAt: Date;
    updatedAt: Date;
    pages?: Page[];
}

export interface Page {
    id: string;
    websiteId: string;
    slug: string;
    title: string;
    order: number;
    seoMeta: SEOMeta;
    sections?: Section[];
}

export interface Section {
    id: string;
    pageId: string;
    type: SectionType;
    order: number;
    visible: boolean;
    content: SectionContent;
    style: SectionStyle;
}

export type SectionType =
    | 'hero'
    | 'about'
    | 'skills'
    | 'projects'
    | 'experience'
    | 'contact'
    | 'gallery'
    | 'testimonials'
    | 'cta'
    | 'custom';

// Section Content Types
export interface HeroContent {
    name: string;
    tagline: string;
    subtitle?: string;
    avatarUrl?: string;
    backgroundUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    socialLinks?: SocialLink[];
}

export interface AboutContent {
    title: string;
    bio: string;
    imageUrl?: string;
    highlights?: { icon: string; label: string; value: string }[];
}

export interface SkillsContent {
    title: string;
    subtitle?: string;
    skills: Skill[];
}

export interface Skill {
    id: string;
    name: string;
    icon?: string;
    proficiency?: number; // 0-100
    category?: string;
}

export interface ProjectsContent {
    title: string;
    subtitle?: string;
    projects: Project[];
}

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags?: string[];
    liveUrl?: string;
    repoUrl?: string;
    featured?: boolean;
}

export interface ExperienceContent {
    title: string;
    experiences: Experience[];
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    logoUrl?: string;
    location?: string;
}

export interface ContactContent {
    title: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    location?: string;
    showForm?: boolean;
    socialLinks?: SocialLink[];
}

export interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
}

export type SectionContent =
    | HeroContent
    | AboutContent
    | SkillsContent
    | ProjectsContent
    | ExperienceContent
    | ContactContent
    | Record<string, unknown>;

// Styling Types
export interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    textSecondaryColor: string;
    fontFamily: string;
    headingFontFamily?: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface SectionStyle {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOverlay?: string;
    textColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    alignment?: 'left' | 'center' | 'right';
}

export interface WebsiteMeta {
    title?: string;
    description?: string;
    favicon?: string;
    ogImage?: string;
    keywords?: string[];
}

export interface SEOMeta {
    title?: string;
    description?: string;
    ogImage?: string;
    noIndex?: boolean;
}

// Template Types
export interface Template {
    id: string;
    name: string;
    description: string;
    previewImage: string;
    category: 'portfolio' | 'business' | 'ecommerce' | 'blog';
    defaultTheme: ThemeConfig;
    defaultSections: Omit<Section, 'id' | 'pageId'>[];
}

// Asset Types
export interface Asset {
    id: string;
    userId: string;
    filename: string;
    storagePath: string;
    publicUrl: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: Date;
}

// Editor Types
export interface EditorState {
    website: Website | null;
    currentPage: Page | null;
    selectedSectionId: string | null;
    isEditing: boolean;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    devicePreview: 'desktop' | 'tablet' | 'mobile';
    showStylePanel: boolean;
    showSectionPanel: boolean;
}

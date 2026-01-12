import type { Template, ThemeConfig } from '@/lib/types';

// Default themes for each template
export const defaultThemes: Record<string, ThemeConfig> = {
    'modern-minimal': {
        primaryColor: '#0f172a',
        secondaryColor: '#64748b',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        textColor: '#1e293b',
        textSecondaryColor: '#64748b',
        fontFamily: 'Inter, system-ui, sans-serif',
        headingFontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: 'lg',
        spacing: 'comfortable',
    },
    'creative-bold': {
        primaryColor: '#7c3aed',
        secondaryColor: '#ec4899',
        accentColor: '#f59e0b',
        backgroundColor: '#0f0f23',
        surfaceColor: '#1a1a2e',
        textColor: '#ffffff',
        textSecondaryColor: '#a1a1aa',
        fontFamily: 'Outfit, system-ui, sans-serif',
        headingFontFamily: 'Outfit, system-ui, sans-serif',
        borderRadius: 'xl',
        spacing: 'spacious',
    },
    'developer-tech': {
        primaryColor: '#22c55e',
        secondaryColor: '#06b6d4',
        accentColor: '#eab308',
        backgroundColor: '#0a0a0a',
        surfaceColor: '#171717',
        textColor: '#fafafa',
        textSecondaryColor: '#a1a1aa',
        fontFamily: 'JetBrains Mono, monospace',
        headingFontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: 'md',
        spacing: 'comfortable',
    },
    'designer-elegant': {
        primaryColor: '#18181b',
        secondaryColor: '#71717a',
        accentColor: '#d4af37',
        backgroundColor: '#fafafa',
        surfaceColor: '#ffffff',
        textColor: '#18181b',
        textSecondaryColor: '#52525b',
        fontFamily: 'Cormorant Garamond, serif',
        headingFontFamily: 'Cormorant Garamond, serif',
        borderRadius: 'none',
        spacing: 'spacious',
    },
    'business-pro': {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#0891b2',
        backgroundColor: '#ffffff',
        surfaceColor: '#f1f5f9',
        textColor: '#0f172a',
        textSecondaryColor: '#475569',
        fontFamily: 'Source Sans Pro, system-ui, sans-serif',
        headingFontFamily: 'Source Sans Pro, system-ui, sans-serif',
        borderRadius: 'md',
        spacing: 'comfortable',
    },
};

// Template configurations
export const templates: Template[] = [
    {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Clean lines, generous whitespace, and elegant typography. Perfect for designers, writers, and consultants who want their work to speak for itself.',
        previewImage: '/templates/modern-minimal.png',
        category: 'portfolio',
        defaultTheme: defaultThemes['modern-minimal'],
        defaultSections: [
            {
                type: 'hero',
                order: 0,
                visible: true,
                content: {
                    name: 'Jane Designer',
                    tagline: 'UI/UX Designer & Creative Thinker',
                    subtitle: 'Crafting beautiful digital experiences that connect people with technology.',
                    ctaText: 'View My Work',
                    ctaLink: '#projects',
                },
                style: { alignment: 'center', paddingTop: '120', paddingBottom: '120' },
            },
            {
                type: 'about',
                order: 1,
                visible: true,
                content: {
                    title: 'About Me',
                    bio: "I'm a passionate designer with over 5 years of experience creating user-centered digital products. I believe great design is invisible – it just works.",
                    highlights: [
                        { icon: 'Briefcase', label: 'Experience', value: '5+ Years' },
                        { icon: 'Award', label: 'Projects', value: '50+' },
                        { icon: 'Users', label: 'Clients', value: '30+' },
                    ],
                },
                style: { maxWidth: 'lg', alignment: 'left' },
            },
            {
                type: 'projects',
                order: 2,
                visible: true,
                content: {
                    title: 'Featured Work',
                    subtitle: 'A selection of projects I\'m proud of',
                    projects: [
                        {
                            id: '1',
                            title: 'Brand Redesign',
                            description: 'Complete visual identity overhaul for a tech startup.',
                            tags: ['Branding', 'UI Design'],
                            featured: true,
                        },
                        {
                            id: '2',
                            title: 'E-commerce Platform',
                            description: 'End-to-end design for a fashion marketplace.',
                            tags: ['UX', 'E-commerce'],
                            featured: true,
                        },
                    ],
                },
                style: { backgroundColor: '#f8fafc' },
            },
            {
                type: 'contact',
                order: 3,
                visible: true,
                content: {
                    title: 'Let\'s Connect',
                    subtitle: 'Have a project in mind? I\'d love to hear about it.',
                    email: 'hello@janedesigner.com',
                    showForm: true,
                    socialLinks: [
                        { platform: 'LinkedIn', url: '#', icon: 'Linkedin' },
                        { platform: 'Twitter', url: '#', icon: 'Twitter' },
                        { platform: 'Dribbble', url: '#', icon: 'Dribbble' },
                    ],
                },
                style: { alignment: 'center' },
            },
        ],
    },
    {
        id: 'creative-bold',
        name: 'Creative Bold',
        description: 'Vibrant gradients, dynamic layouts, and playful animations. Ideal for artists, photographers, and creative professionals who want to make a statement.',
        previewImage: '/templates/creative-bold.png',
        category: 'portfolio',
        defaultTheme: defaultThemes['creative-bold'],
        defaultSections: [
            {
                type: 'hero',
                order: 0,
                visible: true,
                content: {
                    name: 'Alex Creative',
                    tagline: 'Visual Artist & Illustrator',
                    subtitle: 'Turning imagination into stunning visual stories.',
                    ctaText: 'Explore Gallery',
                    ctaLink: '#projects',
                },
                style: {
                    alignment: 'left',
                    backgroundImage: 'gradient',
                    paddingTop: '160',
                    paddingBottom: '160',
                },
            },
            {
                type: 'about',
                order: 1,
                visible: true,
                content: {
                    title: 'The Artist',
                    bio: 'I blend traditional artistry with digital innovation to create pieces that resonate emotionally and visually captivate.',
                },
                style: { maxWidth: 'lg' },
            },
            {
                type: 'projects',
                order: 2,
                visible: true,
                content: {
                    title: 'Portfolio',
                    projects: [
                        {
                            id: '1',
                            title: 'Neon Dreams',
                            description: 'A collection exploring light and color in urban landscapes.',
                            tags: ['Digital Art', 'Photography'],
                        },
                        {
                            id: '2',
                            title: 'Abstract Emotions',
                            description: 'Emotional storytelling through abstract compositions.',
                            tags: ['Illustration', 'Abstract'],
                        },
                    ],
                },
                style: {},
            },
            {
                type: 'contact',
                order: 3,
                visible: true,
                content: {
                    title: 'Collaborate',
                    subtitle: 'Ready to create something amazing together?',
                    email: 'alex@creativestudio.com',
                    showForm: true,
                },
                style: {},
            },
        ],
    },
    {
        id: 'developer-tech',
        name: 'Developer Tech',
        description: 'Dark mode, terminal aesthetics, and syntax-highlighting accents. Built for developers, engineers, and tech enthusiasts.',
        previewImage: '/templates/developer-tech.png',
        category: 'portfolio',
        defaultTheme: defaultThemes['developer-tech'],
        defaultSections: [
            {
                type: 'hero',
                order: 0,
                visible: true,
                content: {
                    name: 'Sam Developer',
                    tagline: 'Full-Stack Engineer',
                    subtitle: '$ Building scalable applications with modern technologies',
                    ctaText: '> View Projects',
                    ctaLink: '#projects',
                },
                style: { alignment: 'left' },
            },
            {
                type: 'skills',
                order: 1,
                visible: true,
                content: {
                    title: '// Tech Stack',
                    skills: [
                        { id: '1', name: 'TypeScript', proficiency: 95, category: 'Languages' },
                        { id: '2', name: 'React', proficiency: 92, category: 'Frontend' },
                        { id: '3', name: 'Node.js', proficiency: 88, category: 'Backend' },
                        { id: '4', name: 'PostgreSQL', proficiency: 85, category: 'Database' },
                    ],
                },
                style: {},
            },
            {
                type: 'projects',
                order: 2,
                visible: true,
                content: {
                    title: '/* Projects */',
                    projects: [
                        {
                            id: '1',
                            title: 'Open Source CLI Tool',
                            description: 'A developer productivity tool with 1k+ GitHub stars.',
                            tags: ['TypeScript', 'Node.js', 'CLI'],
                            repoUrl: '#',
                        },
                        {
                            id: '2',
                            title: 'Real-time Dashboard',
                            description: 'WebSocket-powered analytics dashboard for SaaS.',
                            tags: ['React', 'WebSocket', 'D3.js'],
                            liveUrl: '#',
                        },
                    ],
                },
                style: { backgroundColor: '#171717' },
            },
            {
                type: 'experience',
                order: 3,
                visible: true,
                content: {
                    title: '// Experience',
                    experiences: [
                        {
                            id: '1',
                            company: 'Tech Corp',
                            role: 'Senior Engineer',
                            startDate: '2022',
                            current: true,
                            description: 'Leading frontend architecture and mentoring junior developers.',
                        },
                        {
                            id: '2',
                            company: 'Startup Inc',
                            role: 'Full-Stack Developer',
                            startDate: '2019',
                            endDate: '2022',
                            description: 'Built core product features and scaled to 100k users.',
                        },
                    ],
                },
                style: {},
            },
            {
                type: 'contact',
                order: 4,
                visible: true,
                content: {
                    title: '// Contact',
                    email: 'sam@developer.io',
                    showForm: false,
                    socialLinks: [
                        { platform: 'GitHub', url: '#', icon: 'Github' },
                        { platform: 'LinkedIn', url: '#', icon: 'Linkedin' },
                        { platform: 'Twitter', url: '#', icon: 'Twitter' },
                    ],
                },
                style: {},
            },
        ],
    },
    {
        id: 'designer-elegant',
        name: 'Designer Elegant',
        description: 'Sophisticated, image-focused galleries with subtle animations. Perfect for UI/UX designers, architects, and visual professionals.',
        previewImage: '/templates/designer-elegant.png',
        category: 'portfolio',
        defaultTheme: defaultThemes['designer-elegant'],
        defaultSections: [
            {
                type: 'hero',
                order: 0,
                visible: true,
                content: {
                    name: 'Morgan Designs',
                    tagline: 'Design Studio',
                    subtitle: 'Where creativity meets precision',
                    ctaText: 'Discover',
                    ctaLink: '#projects',
                },
                style: { alignment: 'center', paddingTop: '200', paddingBottom: '200' },
            },
            {
                type: 'about',
                order: 1,
                visible: true,
                content: {
                    title: 'Philosophy',
                    bio: 'We believe in the power of thoughtful design. Every project is an opportunity to create something meaningful that stands the test of time.',
                },
                style: { maxWidth: 'md', alignment: 'center' },
            },
            {
                type: 'projects',
                order: 2,
                visible: true,
                content: {
                    title: 'Selected Works',
                    projects: [
                        {
                            id: '1',
                            title: 'Luxury Brand Identity',
                            description: 'Complete brand system for a premium fashion house.',
                            tags: ['Branding', 'Identity'],
                        },
                        {
                            id: '2',
                            title: 'Architectural Visualization',
                            description: '3D renders for modern residential projects.',
                            tags: ['3D', 'Architecture'],
                        },
                    ],
                },
                style: {},
            },
            {
                type: 'contact',
                order: 3,
                visible: true,
                content: {
                    title: 'Inquiries',
                    email: 'hello@morgandesigns.com',
                    location: 'New York, NY',
                    showForm: true,
                },
                style: { alignment: 'center' },
            },
        ],
    },
    {
        id: 'business-pro',
        name: 'Business Professional',
        description: 'Conservative, structured, and trust-building design. Ideal for executives, consultants, lawyers, and business professionals.',
        previewImage: '/templates/business-pro.png',
        category: 'portfolio',
        defaultTheme: defaultThemes['business-pro'],
        defaultSections: [
            {
                type: 'hero',
                order: 0,
                visible: true,
                content: {
                    name: 'Dr. Taylor Business',
                    tagline: 'Executive Consultant',
                    subtitle: 'Helping organizations achieve operational excellence and sustainable growth.',
                    ctaText: 'Schedule Consultation',
                    ctaLink: '#contact',
                },
                style: { alignment: 'left' },
            },
            {
                type: 'about',
                order: 1,
                visible: true,
                content: {
                    title: 'About',
                    bio: 'With over 15 years of experience in strategic consulting, I help Fortune 500 companies navigate complex challenges and unlock new opportunities for growth.',
                    highlights: [
                        { icon: 'Building', label: 'Companies Served', value: '100+' },
                        { icon: 'TrendingUp', label: 'Revenue Impact', value: '$50M+' },
                        { icon: 'Award', label: 'Industry Awards', value: '12' },
                    ],
                },
                style: {},
            },
            {
                type: 'experience',
                order: 2,
                visible: true,
                content: {
                    title: 'Professional Experience',
                    experiences: [
                        {
                            id: '1',
                            company: 'Global Consulting Group',
                            role: 'Partner',
                            startDate: '2018',
                            current: true,
                            description: 'Leading digital transformation initiatives for enterprise clients.',
                        },
                        {
                            id: '2',
                            company: 'Fortune 500 Corporation',
                            role: 'VP of Strategy',
                            startDate: '2012',
                            endDate: '2018',
                            description: 'Developed and executed corporate strategy across 20+ markets.',
                        },
                    ],
                },
                style: { backgroundColor: '#f1f5f9' },
            },
            {
                type: 'contact',
                order: 3,
                visible: true,
                content: {
                    title: 'Get in Touch',
                    subtitle: 'Ready to transform your business? Let\'s discuss how I can help.',
                    email: 'taylor@businessconsult.com',
                    phone: '+1 (555) 123-4567',
                    showForm: true,
                },
                style: {},
            },
        ],
    },
];

export const getTemplate = (id: string): Template | undefined => {
    return templates.find((t) => t.id === id);
};

export const getTemplateTheme = (id: string): ThemeConfig => {
    return defaultThemes[id] || defaultThemes['modern-minimal'];
};

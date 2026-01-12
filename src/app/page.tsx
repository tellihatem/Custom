import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  Sparkles,
  Palette,
  MousePointerClick,
  Zap,
  Layout,
  Download,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">THODZ</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 text-sm font-medium mb-8 animate-fade-in">
            <Star className="w-4 h-4" />
            Trusted by 10,000+ creators worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ fontFamily: 'var(--font-display)' }}>
            Build <span className="gradient-text">Stunning Portfolios</span>
            <br />in Minutes
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Choose from beautiful templates and customize every element.
            No coding required. Just click, edit, and publish your professional portfolio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/signup">
              <Button size="lg" className="group">
                Start Building Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="outline" size="lg">
                View Templates
              </Button>
            </Link>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-pulse-glow">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Layout className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Interactive Demo Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need to Shine
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful features that make building your portfolio a breeze
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Beautiful Templates to Start With
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose from professionally designed templates and make them your own
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templatePreviews.map((template, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`aspect-[4/3] ${template.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-white/70">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg">
                Explore All Templates
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: 'var(--font-display)' }}>
            Why Creators Love THODZ
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-white/80 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
            Join thousands of creators who've already built their dream portfolios.
            Start free, no credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-10">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">THODZ Builder</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link>
          </div>

          <p className="text-sm text-slate-500">
            © 2024 THODZ. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: MousePointerClick,
    title: 'Click to Edit Anything',
    description: 'Simply click on any text, image, or element to customize it. Direct inline editing makes changes feel instant.',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  {
    icon: Palette,
    title: 'Full Style Control',
    description: 'Customize colors, fonts, spacing, and more. Create a unique look that perfectly represents your brand.',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600',
  },
  {
    icon: Layout,
    title: 'Drag & Drop Sections',
    description: 'Reorder sections with simple drag and drop. Add, remove, or rearrange your content however you like.',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Optimized for speed and SEO. Your portfolio loads instantly and ranks well on search engines.',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download your portfolio as static HTML or publish with a single click to get a shareable link.',
    color: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    icon: Sparkles,
    title: 'Premium Templates',
    description: 'Start with professionally designed templates crafted for different industries and styles.',
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
  },
];

const templatePreviews = [
  { name: 'Modern Minimal', description: 'Clean & Professional', gradient: 'bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900' },
  { name: 'Creative Bold', description: 'Vibrant & Dynamic', gradient: 'bg-gradient-to-br from-violet-400 to-pink-500' },
  { name: 'Developer Tech', description: 'Dark & Technical', gradient: 'bg-gradient-to-br from-slate-900 to-emerald-900' },
  { name: 'Designer Elegant', description: 'Sophisticated & Refined', gradient: 'bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900 dark:to-rose-900' },
  { name: 'Business Pro', description: 'Trust & Authority', gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { name: 'Coming Soon', description: 'E-commerce & More', gradient: 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-600 dark:to-slate-800' },
];

const benefits = [
  { title: 'No Coding Required', description: 'Build professional websites without writing a single line of code.' },
  { title: 'Mobile Responsive', description: 'Your portfolio looks perfect on all devices, automatically.' },
  { title: 'SEO Optimized', description: 'Built-in best practices help you rank higher in search results.' },
  { title: 'Fast Loading', description: 'Optimized performance means your visitors never wait.' },
  { title: 'Secure Hosting', description: 'We handle hosting, SSL, and security so you can focus on content.' },
  { title: 'Custom Domains', description: 'Connect your own domain for a fully professional presence.' },
];

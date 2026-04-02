import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  GitBranch,
  Target,
  BarChart3,
  RefreshCcw,
  Search,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Globe,
  Brain,
  Play,
  Filter,
  Users,
  Send,
} from 'lucide-react';
import { useAnimateOnScroll } from '@/hooks/use-animate-on-scroll';

// ─── Data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Search,
    title: 'AI-Powered Account Discovery',
    description:
      'Automatically discover and enrich target accounts using a proprietary engine powered by Firecrawl for web intelligence and Coresignal for firmographic and hiring signals. Surface ideal prospects that match your ICP — no manual research required.',
    iconBg: 'bg-rose-500',
  },
  {
    icon: Brain,
    title: 'Propensity-to-Buy Engine',
    description:
      'Go beyond static lead scores. Our engine ingests real-time intent signals from PredictLeads (technographics), Reddit (community sentiment), and third-party providers like Bombora and G2 Buyer Intent — then uses Claude AI to analyze buying readiness.',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: GitBranch,
    title: 'Git for Sales Territories',
    description:
      'Plan, version, compare, and roll back territory changes like code. Create territory "branches," model different scenarios side-by-side, and merge the best plan — giving sales ops the same precision and auditability that engineering teams rely on.',
    iconBg: 'bg-violet-500',
  },
  {
    icon: Target,
    title: 'Smart Account Assignment',
    description:
      'Eliminate manual routing chaos with intelligent account assignment. Our system automatically matches accounts to the best-fit rep based on industry expertise, product specialization, current workload, and historical win rates.',
    iconBg: 'bg-sky-500',
  },
  {
    icon: BarChart3,
    title: 'Intelligent Territory Optimization',
    description:
      'Design and optimize territories that maximize revenue potential while ensuring fair distribution. Our AI analyzes account density, revenue opportunity, geography, and rep capacity to create balanced territories across your entire sales organization.',
    iconBg: 'bg-amber-500',
  },
  {
    icon: RefreshCcw,
    title: 'Bi-Directional CRM Sync',
    description:
      'Keep your sales operations running smoothly with bi-directional sync to Salesforce. Automatically push territory assignments, account routing decisions, and enriched intelligence directly into your team\'s daily workflow — no manual data entry required.',
    iconBg: 'bg-teal-500',
  },
];

const pipelineStages = [
  { number: '01', title: 'Discover', icon: Search, description: 'Our proprietary engine crawls the web, news, funding rounds, and directories to surface net-new accounts that match your ICP.' },
  { number: '02', title: 'Classify', icon: Filter, description: 'Accounts are automatically segmented by size, industry, geography, and fit — ready for scoring.' },
  { number: '03', title: 'Score', icon: Sparkles, description: 'The Propensity-to-Buy Engine applies real-time intent signals and AI analysis to rank accounts by buying readiness.' },
  { number: '04', title: 'Assign', icon: Users, description: 'Intelligent routing matches each account to the best-fit rep based on expertise, capacity, and territory rules.' },
  { number: '05', title: 'Sync', icon: Send, description: 'Assignments, scores, and enriched data flow bi-directionally into Salesforce — keeping your CRM the system of record.' },
];

const useCases = [
  { title: 'Territory Management', description: 'Design optimal territory structures with Git-style versioning — branch, compare scenarios, and merge the best plan.', icon: GitBranch, iconBg: 'bg-indigo-500' },
  { title: 'Account Routing', description: 'Intelligently assign accounts based on rep specialization, workload, territory rules, and historical success rates.', icon: Target, iconBg: 'bg-emerald-500' },
  { title: 'Pipeline Intelligence', description: 'Track the full Discover → Score → Assign pipeline with a unified data layer and real-time dashboards.', icon: BarChart3, iconBg: 'bg-violet-500' },
  { title: 'Intent-Based Prioritization', description: 'Surface accounts showing real buying signals — hiring patterns, tech adoption, funding rounds, and community buzz.', icon: TrendingUp, iconBg: 'bg-rose-500' },
];

const stats = [
  { value: '5', label: 'Unified pipeline stages from discovery to CRM sync', color: 'text-blue-400' },
  { value: '6+', label: 'Real-time data providers powering intent signals', color: 'text-purple-400' },
  { value: '100%', label: 'Automated account enrichment — zero manual research', color: 'text-pink-400' },
];

const faqs = [
  { q: 'How does RevMap help Sales Operations teams?', a: 'RevMap replaces spreadsheets and manual territory planning with an AI-powered platform that discovers accounts, scores them against your ICP, assigns them to the right rep, and syncs everything back to Salesforce — automatically.' },
  { q: 'What is the Propensity-to-Buy Engine?', a: 'Unlike static lead scoring, our Propensity-to-Buy Engine ingests real-time intent signals from multiple providers — PredictLeads for technographics and company signals, Reddit for community sentiment, Bombora and G2 for buyer intent — then uses Claude AI to analyze buying readiness and surface accounts most likely to convert.' },
  { q: 'What does "Git for Sales Territories" mean?', a: 'Just like developers use Git to branch, compare, and merge code changes, RevMap lets you create territory "branches" to model different scenarios, compare them side-by-side, and roll back changes — with a full audit trail.' },
  { q: 'Does RevMap integrate with our CRM?', a: 'Yes. We support bi-directional sync with Salesforce today, with HubSpot coming next. Territory assignments, account scores, and enriched data flow directly into your CRM. We also offer a native Salesforce Lightning Web Component.' },
  { q: 'Where do the intent signals come from?', a: 'We aggregate signals from Bombora (topic-level intent), G2 Buyer Intent (product comparison activity), job postings (hiring signals), funding databases, technographic providers, and web research.' },
  { q: 'How does territory optimization work?', a: 'Our AI analyzes account density, revenue potential, rep capacity, geographic proximity, vertical expertise, and historical win rates to suggest balanced territory structures. You approve changes before anything hits Salesforce.' },
  { q: 'How quickly can we see results?', a: 'Most teams see their first scored accounts and recommendations within 24 hours of connecting Salesforce. The model improves continuously as you approve and dismiss recommendations.' },
  { q: 'Is RevMap suitable for small teams or just enterprises?', a: 'RevMap is built for mid-market B2B teams first. No 3-month implementation, no professional services requirement. Connect your CRM and start seeing value immediately.' },
];

// ─── Animated Section ────────────────────────────────────────────────
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useAnimateOnScroll(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────
export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white antialiased">
      {/* ─── Nav ─── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0F1A]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              R
            </div>
            <span className="text-xl font-bold text-white">RevMap</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pipeline" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#use-cases" className="text-sm text-gray-400 hover:text-white transition-colors">Use Cases</a>
            <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              to="/app"
              className="rounded-full border border-blue-500/50 bg-transparent px-5 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>
        {/* Thin gradient line under nav */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedSection>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-sm text-blue-400">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Territory Intelligence Platform</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
                Your CRM only shows
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  half the picture.
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 leading-relaxed md:text-xl">
                RevMap scans job postings, funding events, intent signals, industry directories, and web research to surface the right accounts at the right time — then ensures your best rep is working every one of them, automatically inside Salesforce.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/app"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  See Your Territory Health
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#pipeline"
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Play className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  Request a Demo
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  Real-Time Intent Signals
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Enterprise Security
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  Unified GTM Pipeline
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
                Purpose-Built for<br />Sales Operations
              </h2>
              <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                A complete platform with real-time intent data, AI scoring, territory versioning, and bi-directional CRM sync — built to replace spreadsheets and manual processes.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 80}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} text-white shadow-lg`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pipeline ─── */}
      <section id="pipeline" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
                The 5-Stage GTM Pipeline
              </h2>
              <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                Every account flows through a unified pipeline — from initial discovery to CRM sync — with AI at every stage.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {pipelineStages.map((stage, i) => (
              <AnimatedSection key={stage.number} delay={i * 100}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04] relative">
                  {/* Stage number */}
                  <p className="text-4xl font-extrabold text-white/[0.08] mb-4">{stage.number}</p>

                  {/* Gradient pill with icon */}
                  <div className="mb-4 h-10 rounded-lg bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80 flex items-center px-3 shadow-lg shadow-indigo-500/10">
                    <stage.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Title + arrow */}
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-base font-bold text-white">{stage.title}</h3>
                    {i < pipelineStages.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-600 hidden md:block" />
                    )}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">{stage.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section id="use-cases" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
                Built for Sales Ops Leaders
              </h2>
              <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                From territory design to account routing, see how sales operations teams use RevMap to eliminate manual work.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc, i) => (
              <AnimatedSection key={uc.title} delay={i * 100}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]">
                  {/* Dashboard preview image area */}
                  <div className="h-44 w-full relative bg-gradient-to-br from-[#111827] to-[#1E293B] overflow-hidden">
                    {/* Fake dashboard lines */}
                    <div className="absolute inset-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400/60" />
                        <div className="ml-2 h-2 w-24 rounded bg-white/[0.06]" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="h-16 flex-1 rounded bg-gradient-to-t from-blue-500/20 to-transparent border border-white/[0.04]" />
                          <div className="h-16 flex-1 rounded bg-gradient-to-t from-purple-500/20 to-transparent border border-white/[0.04]" />
                        </div>
                        <div className="h-2 w-3/4 rounded bg-white/[0.04]" />
                        <div className="h-2 w-1/2 rounded bg-white/[0.04]" />
                        <div className="flex gap-1">
                          <div className="h-6 flex-1 rounded bg-white/[0.03]" />
                          <div className="h-6 flex-1 rounded bg-white/[0.03]" />
                          <div className="h-6 flex-1 rounded bg-white/[0.03]" />
                        </div>
                      </div>
                    </div>
                    {/* Icon badge overlay */}
                    <div className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg ${uc.iconBg} text-white shadow-lg z-10`}>
                      <uc.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold text-white">{uc.title}</h3>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">{uc.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-12 md:p-16">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.value} className="text-center">
                    <p className={`text-5xl font-extrabold md:text-6xl ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-5 text-lg text-gray-400">
                Everything you need to know about the RevMap sales operations platform
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'}`}>
                  <button
                    className="flex w-full items-center justify-between px-7 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${openFaq === i ? 'bg-blue-600 rotate-180' : 'bg-white/[0.06]'}`}>
                      <ChevronDown className={`h-4 w-4 transition-colors ${openFaq === i ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openFaq === i ? '200px' : '0',
                      opacity: openFaq === i ? 1 : 0,
                    }}
                  >
                    <div className="px-7 pb-5">
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
              Ready to automate your<br />sales operations?
            </h2>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Replace spreadsheets and manual processes with a unified GTM pipeline powered by real-time intelligence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/app"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#pipeline"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-300 hover:bg-white/10 transition-all duration-200"
              >
                Request a Demo
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                  R
                </div>
                <span className="text-lg font-bold text-white">RevMap</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                The unified GTM pipeline for modern sales operations.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a></li>
                <li><a href="#pipeline" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Use Cases</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#faq" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <p className="text-sm text-gray-600 text-center">© 2026 RevMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';
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
  ChevronUp,
  Sparkles,
  Globe,
  Brain,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'AI-Powered Account Discovery',
    description:
      'Surface net-new accounts that match your ICP by scanning job postings, funding rounds, hiring patterns, and industry directories — no manual research required.',
  },
  {
    icon: Brain,
    title: 'Propensity-to-Buy Engine',
    description:
      'Go beyond static lead scores. Ingest real-time intent signals from Bombora, G2 Buyer Intent, hiring data, and technographic providers — then use Claude AI to analyze buying readiness.',
  },
  {
    icon: GitBranch,
    title: 'Git for Sales Territories',
    description:
      'Plan, version, compare, and roll back territory changes like code. Create territory branches, model scenarios side-by-side, and merge the best plan with full audit trail.',
  },
  {
    icon: Target,
    title: 'Smart Account Assignment',
    description:
      'Eliminate manual routing. Automatically match accounts to the best-fit rep based on industry expertise, product specialization, current workload, and historical win rates.',
  },
  {
    icon: BarChart3,
    title: 'Intelligent Territory Optimization',
    description:
      'Design territories that maximize revenue potential while ensuring fair distribution. AI analyzes account density, revenue opportunity, geography, and rep capacity.',
  },
  {
    icon: RefreshCcw,
    title: 'Bi-Directional CRM Sync',
    description:
      'Push territory assignments, account routing, and enriched intelligence directly into Salesforce. Your CRM stays the system of record — zero manual data entry.',
  },
];

const pipelineStages = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Our engine crawls the web, news, funding rounds, and directories to surface net-new accounts that match your ICP.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    title: 'Classify',
    description:
      'Accounts are automatically segmented by size, industry, geography, and fit — ready for scoring.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    number: '03',
    title: 'Score',
    description:
      'The Propensity-to-Buy Engine applies real-time intent signals and AI analysis to rank accounts by buying readiness.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '04',
    title: 'Assign',
    description:
      'Intelligent routing matches each account to the best-fit rep based on expertise, capacity, and territory rules.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    number: '05',
    title: 'Sync',
    description:
      'Assignments, scores, and enriched data flow bi-directionally into Salesforce — keeping your CRM the source of truth.',
    color: 'from-fuchsia-500 to-fuchsia-600',
  },
];

const useCases = [
  {
    title: 'Territory Management',
    description:
      'Design optimal territory structures with Git-style versioning — branch, compare scenarios, and merge the best plan.',
    icon: GitBranch,
  },
  {
    title: 'Account Routing',
    description:
      'Intelligently assign accounts based on rep specialization, workload, territory rules, and historical success rates.',
    icon: Target,
  },
  {
    title: 'Pipeline Intelligence',
    description:
      'Track the full Discover → Score → Assign pipeline with a unified data layer and real-time dashboards.',
    icon: BarChart3,
  },
  {
    title: 'Intent-Based Prioritization',
    description:
      'Surface accounts showing real buying signals — hiring patterns, tech adoption, funding rounds, and community buzz.',
    icon: TrendingUp,
  },
];

const stats = [
  { value: '5', label: 'Unified pipeline stages from discovery to CRM sync' },
  { value: '6+', label: 'Real-time data providers powering intent signals' },
  { value: '100%', label: 'Automated account enrichment — zero manual research' },
];

const faqs = [
  {
    q: 'How does RevMap help Sales Operations teams?',
    a: 'RevMap replaces spreadsheets and manual territory planning with an AI-powered platform that discovers accounts, scores them against your ICP, assigns them to the right rep, and syncs everything back to Salesforce — automatically.',
  },
  {
    q: 'What is the Propensity-to-Buy Engine?',
    a: 'It\'s our scoring model that goes beyond firmographics. We ingest real-time intent signals (Bombora, G2, hiring data, technographic changes) and use Claude AI to produce a 0-100 buying readiness score with plain-English explanations.',
  },
  {
    q: 'What does "Git for Sales Territories" mean?',
    a: 'Just like developers use Git to branch, compare, and merge code changes, RevMap lets you create territory "branches" to model different scenarios, compare them side-by-side, and roll back changes — with a full audit trail.',
  },
  {
    q: 'Does RevMap integrate with our CRM?',
    a: 'Yes. We support bi-directional sync with Salesforce today, with HubSpot coming next. Territory assignments, account scores, and enriched data flow directly into your CRM. We also offer a native Salesforce Lightning Web Component.',
  },
  {
    q: 'Where do the intent signals come from?',
    a: 'We aggregate signals from Bombora (topic-level intent), G2 Buyer Intent (product comparison activity), job postings (hiring signals), funding databases, technographic providers, and web research.',
  },
  {
    q: 'How does territory optimization work?',
    a: 'Our AI analyzes account density, revenue potential, rep capacity, geographic proximity, vertical expertise, and historical win rates to suggest balanced territory structures. You approve changes before anything hits Salesforce.',
  },
  {
    q: 'How quickly can we see results?',
    a: 'Most teams see their first scored accounts and recommendations within 24 hours of connecting Salesforce. The model improves continuously as you approve and dismiss recommendations.',
  },
  {
    q: 'Is RevMap suitable for small teams or just enterprises?',
    a: 'RevMap is built for mid-market B2B teams first. No 3-month implementation, no professional services requirement. Connect your CRM and start seeing value immediately.',
  },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
              R
            </div>
            <span className="text-xl font-bold text-gray-900">RevMap</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pipeline" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#use-cases" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Use Cases</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/app"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-shadow"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
              <Sparkles className="h-4 w-4" />
              Territory Intelligence Platform
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
              Your CRM only shows{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                half the picture.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
              RevMap scans job postings, funding events, intent signals, industry directories, and web research to surface the right accounts at the right time — then ensures your best rep is working every one of them, automatically inside Salesforce.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/app"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                See Your Territory Health
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#pipeline"
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Request a Demo
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-blue-500" /> Real-Time Intent Signals</span>
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-blue-500" /> Enterprise Security</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-blue-500" /> Unified GTM Pipeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Purpose-Built for Sales Operations
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A complete platform with real-time intent data, AI scoring, territory versioning, and bi-directional CRM sync — built to replace spreadsheets and manual processes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              The 5-Stage GTM Pipeline
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every account flows through a unified pipeline — from initial discovery to CRM sync — with AI at every stage.
            </p>
          </div>
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-fuchsia-300 md:hidden" />
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 -translate-y-1/2" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
              {pipelineStages.map((stage) => (
                <div key={stage.number} className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                  <div className={`relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stage.color} text-white shadow-lg`}>
                    <span className="text-xl font-bold">{stage.number}</span>
                  </div>
                  <div className="md:mt-5 md:text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Built for Sales Ops Leaders
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From territory design to account routing, see how sales operations teams use RevMap to eliminate manual work.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="group flex gap-5 rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                  <uc.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{uc.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to know about the RevMap platform
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-colors hover:border-gray-300"
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to automate your sales operations?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Replace spreadsheets and manual processes with a unified GTM pipeline powered by real-time intelligence.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/app"
              className="flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-blue-600 shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#pipeline"
              className="flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
                R
              </div>
              <span className="text-lg font-bold text-gray-900">RevMap</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-700 transition-colors">Features</a>
              <a href="#pipeline" className="hover:text-gray-700 transition-colors">How It Works</a>
              <a href="#use-cases" className="hover:text-gray-700 transition-colors">Use Cases</a>
              <a href="#faq" className="hover:text-gray-700 transition-colors">FAQ</a>
            </div>
            <p className="text-sm text-gray-400">© 2026 RevMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

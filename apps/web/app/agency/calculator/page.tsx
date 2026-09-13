import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import WebsiteCostCalculator from '@/components/calculator/WebsiteCostCalculator';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Custom Website Cost Calculator — Grekam Visuals',
  description: 'Calculate an instant, itemized estimate for your custom website development in Indian Rupees (₹). Get live transparent pricing in 2–4 minutes.',
  openGraph: {
    title: 'Custom Website Cost Calculator — Grekam Visuals',
    description: 'Instant transparent pricing in Indian Rupees (₹) for custom websites, web applications, and online stores.',
    url: 'https://agency.grekam.in/calculator',
    siteName: 'Grekam Visuals',
    type: 'website',
  },
};

export default function CalculatorStandalonePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-400 selection:text-black antialiased relative overflow-x-hidden">
      {/* Background Gradients & Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_center,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/agency"
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Agency Main</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 font-black tracking-widest uppercase text-sm">
            <span>Grekam Visuals</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PRICING LAB
            </span>
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Transparent Estimate</span>
        </div>
      </header>

      {/* Calculator Body */}
      <main className="relative z-10 px-4 md:px-8 py-8 md:py-12">
        <WebsiteCostCalculator agencyPhone="+919944747754" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-4 text-center text-xs text-zinc-500 font-mono">
        <p>© {new Date().getFullYear()} Grekam Visuals Agency. All rights reserved. Prices shown are estimates in Indian Rupees (₹).</p>
      </footer>
    </div>
  );
}

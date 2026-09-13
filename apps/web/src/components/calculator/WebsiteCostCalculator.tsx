"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
  HelpCircle,
  IndianRupee,
  Layers,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Smartphone,
  Globe,
  Sliders,
  Send,
  Zap,
  ShoppingBag,
  Database,
  Search,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  CalculatorConfig,
  CalculatorState,
  DEFAULT_CALCULATOR_CONFIG,
  INITIAL_CALCULATOR_STATE,
  calculateWebsiteEstimate,
  generateWhatsAppQuoteMessage
} from '@/lib/calculator/calculator-config';

interface WebsiteCostCalculatorProps {
  customConfig?: CalculatorConfig;
  onLeadSubmitted?: (leadData: any) => void;
  className?: string;
  agencyPhone?: string;
}

export default function WebsiteCostCalculator({
  customConfig,
  onLeadSubmitted,
  className = '',
  agencyPhone = '+919789359407',
}: WebsiteCostCalculatorProps) {
  const [config, setConfig] = useState<CalculatorConfig>(customConfig || DEFAULT_CALCULATOR_CONFIG);
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showMobileSummary, setShowMobileSummary] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Load latest config from API if not provided
  useEffect(() => {
    if (!customConfig) {
      fetch('/api/calculator/config')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.config) {
            setConfig(data.config);
          }
        })
        .catch(err => console.error('Failed to load dynamic pricing config:', err));
    }
  }, [customConfig]);

  // Dynamically compute step flow
  const steps = useMemo(() => {
    const list = [
      { id: 'website_type', label: 'Website', short: '01 Website', title: 'What type of website do you need?' },
      { id: 'pages', label: 'Pages', short: '02 Pages', title: 'How many pages do you need?' },
      { id: 'design', label: 'Design', short: '03 Design', title: 'What kind of design do you want?' },
      { id: 'features', label: 'Features', short: '04 Features', title: 'What features do you need?' },
    ];

    if (state.websiteType === 'ecommerce') {
      list.push({ id: 'ecommerce_features', label: 'Store Features', short: '05 Store', title: 'What does your online store need?' });
      list.push({ id: 'products', label: 'Products', short: '06 Products', title: 'How many products will you have?' });
    }

    list.push({ id: 'integrations', label: 'Integrations', short: '05 Integrations', title: 'Do you need any third-party integrations?' });
    list.push({ id: 'seo', label: 'SEO', short: '06 SEO', title: 'Do you need SEO setup?' });
    list.push({ id: 'content', label: 'Content', short: '07 Content', title: 'Who will provide website content & images?' });
    list.push({ id: 'branding', label: 'Branding', short: '08 Branding', title: 'Do you already have a brand identity?' });
    list.push({ id: 'migration', label: 'Migration', short: '09 Migration', title: 'Are you moving from another platform?' });
    list.push({ id: 'hosting', label: 'Hosting', short: '10 Hosting', title: 'Do you need domain and hosting?' });
    list.push({ id: 'maintenance', label: 'Maintenance', short: '11 Maintenance', title: 'Do you need ongoing website maintenance?' });
    list.push({ id: 'delivery', label: 'Speed', short: '12 Speed', title: 'When do you need the website delivered?' });
    list.push({ id: 'details', label: 'Estimate', short: 'Final Estimate', title: 'Almost there! Review your estimate' });

    return list;
  }, [state.websiteType]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Recalculate live estimate
  const estimate = useMemo(() => {
    return calculateWebsiteEstimate(state, config);
  }, [state, config]);

  // Clean phone number for WhatsApp
  const cleanPhone = useMemo(() => {
    return (agencyPhone || '919789359407').replace(/[^0-9]/g, '');
  }, [agencyPhone]);

  const whatsappMessage = useMemo(() => {
    return generateWhatsAppQuoteMessage(state, estimate, config);
  }, [state, estimate, config]);

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Navigation handlers
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setState(INITIAL_CALCULATOR_STATE);
    setCurrentStepIndex(0);
    setIsSubmitted(false);
  };

  // Feature toggle with dependency resolution
  const toggleFeature = (featureId: string) => {
    setState(prev => {
      const exists = prev.selectedFeatures.includes(featureId);
      let updated = exists
        ? prev.selectedFeatures.filter(id => id !== featureId)
        : [...prev.selectedFeatures, featureId];

      // Auto-include dependency if adding
      if (!exists) {
        const feat = config.features.find(f => f.id === featureId);
        if (feat?.requiredFeatures) {
          feat.requiredFeatures.forEach(req => {
            if (!updated.includes(req)) updated.push(req);
          });
        }
      } else {
        // If removing customer_login, also remove features that require it
        if (featureId === 'customer_login') {
          updated = updated.filter(id => {
            const f = config.features.find(x => x.id === id);
            return !f?.requiredFeatures?.includes('customer_login');
          });
        }
      }

      return { ...prev, selectedFeatures: updated };
    });
  };

  const toggleEcommerceFeature = (featureId: string) => {
    setState(prev => {
      const exists = prev.selectedEcommerceFeatures.includes(featureId);
      const updated = exists
        ? prev.selectedEcommerceFeatures.filter(id => id !== featureId)
        : [...prev.selectedEcommerceFeatures, featureId];
      return { ...prev, selectedEcommerceFeatures: updated };
    });
  };

  const toggleIntegration = (intId: string) => {
    setState(prev => {
      const exists = prev.selectedIntegrations.includes(intId);
      const updated = exists
        ? prev.selectedIntegrations.filter(id => id !== intId)
        : [...prev.selectedIntegrations, intId];
      return { ...prev, selectedIntegrations: updated };
    });
  };

  // Lead Submission
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/calculator/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          customer: {
            name: state.customerName,
            businessName: state.businessName,
            email: state.email,
            phone: state.phone,
            city: state.city,
            websiteUrl: state.websiteUrl,
            additionalNotes: state.additionalNotes,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        onLeadSubmitted?.(data);
      } else {
        alert(data.error || 'Failed to submit estimate. Please check your details.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting estimate. You can also contact us directly via WhatsApp.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto flex flex-col text-white font-sans ${className}`}>
      {/* Header Consultation Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Website Cost Calculator</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Custom Website Development Estimator
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Select your exact business specifications below for instant transparent pricing in Indian Rupees (₹).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Reset all selections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* Progress Step Indicator */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between text-xs font-sans mb-2">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            Step {currentStepIndex + 1} of {steps.length} — {currentStep.label}
          </span>
          <span className="text-zinc-500">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Chips (Scrollable on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {steps.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-sans whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-black font-bold shadow-md shadow-white/10'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 text-emerald-400" /> : <span>0{idx + 1}</span>}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Left (Col 7-8) + Sticky Live Summary Right (Col 4-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-28 lg:pb-12">
        {/* Left Interactive Consultation Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl min-h-[480px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 mb-6">
                  {currentStep.id === 'website_type' && 'Choose the base blueprint that best matches your immediate business model.'}
                  {currentStep.id === 'pages' && 'Select your total intended website pages. Base package inclusions are already credited.'}
                  {currentStep.id === 'design' && 'Choose the visual polish and interactivity caliber for your brand.'}
                  {currentStep.id === 'features' && 'Select the operational modules and conversion tools you want integrated.'}
                  {currentStep.id === 'ecommerce_features' && 'Empower your storefront with scalable e-commerce infrastructure.'}
                  {currentStep.id === 'products' && 'Select your inventory size and whether you want our team to format & upload your items.'}
                  {currentStep.id === 'integrations' && 'Connect your web platform to CRM, search engines, APIs, and analytics.'}
                  {currentStep.id === 'seo' && 'Pick your search engine visibility and ranking optimization depth.'}
                  {currentStep.id === 'content' && 'Select who writes the text copy and who sources visual imagery.'}
                  {currentStep.id === 'branding' && 'Let us know if you have an established identity or require visual identity creation.'}
                  {currentStep.id === 'migration' && 'Select if you are transferring an existing store or database from another system.'}
                  {currentStep.id === 'hosting' && 'High-speed cloud VPS infrastructure, automated SSL certificates & domain setups.'}
                  {currentStep.id === 'maintenance' && 'Ongoing technical protection, backups, security audits, and content updates.'}
                  {currentStep.id === 'delivery' && 'Choose your production timeline priority sprint.'}
                  {currentStep.id === 'details' && 'Fill in your details to receive your formal estimate and discuss your requirements.'}
                </p>

                {/* STEP 1: WEBSITE TYPE */}
                {currentStep.id === 'website_type' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.websiteTypes.map(w => {
                      const isSelected = state.websiteType === w.id;
                      return (
                        <div
                          key={w.id}
                          onClick={() => setState(prev => ({ ...prev, websiteType: w.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left relative group ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/50'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          {w.badge && (
                            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-emerald-400 text-black">
                              {w.badge}
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                              </span>
                              <h4 className="font-bold text-base text-white">{w.title}</h4>
                            </div>
                            <div className="text-xl font-black text-emerald-400 font-sans mb-3">
                              Starting ₹{w.startingPrice.toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                              {w.description}
                            </p>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span>Includes {w.includedPages} {w.includedPages === 1 ? 'Page' : 'Pages'}</span>
                            <span className="text-emerald-400/80 font-bold">{isSelected ? 'Selected' : 'Select'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 2: PAGES COUNT */}
                {currentStep.id === 'pages' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {config.pageTiers.map(p => {
                        const isSelected = state.pageTier === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setState(prev => ({ ...prev, pageTier: p.id }))}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-white">{p.label}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                                {p.description}
                              </p>
                            </div>
                            <div className="text-[11px] font-sans text-emerald-400 font-bold">
                              {p.ratePerPage === 0 ? 'Included in Base' : `+₹${p.ratePerPage.toLocaleString('en-IN')} / page`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-start gap-3 mt-4">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Zero Double Charge:</strong> Pages already included in your chosen website package (e.g. 5 pages in Business Website, 1 in Landing Page) are never double-charged.
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 3: DESIGN STYLE */}
                {currentStep.id === 'design' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.designTiers.map(d => {
                      const isSelected = state.designTier === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setState(prev => ({ ...prev, designTier: d.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-base text-white">{d.title}</h4>
                              <span className="text-xs font-sans font-bold text-emerald-400">
                                {d.price === 0 ? 'Included (+₹0)' : `+₹${d.price.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                              {d.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-sans text-zinc-500">
                            <span>{isSelected ? '✓ Active Selection' : 'Click to Select'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 4: WEBSITE FEATURES */}
                {currentStep.id === 'features' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {config.features.map(f => {
                        const isSelected = state.selectedFeatures.includes(f.id);
                        const isIncludedInSite = f.includedInWebsites?.includes(state.websiteType);
                        return (
                          <div
                            key={f.id}
                            onClick={() => toggleFeature(f.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-white/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{f.title}</span>
                                  {isIncludedInSite && (
                                    <span className="text-[9px] font-sans px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                                      Package Included
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                                  {f.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs font-sans font-bold text-emerald-400 shrink-0">
                              {isIncludedInSite ? '₹0' : `+₹${f.price.toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5: E-COMMERCE FEATURES (Conditional) */}
                {currentStep.id === 'ecommerce_features' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                      {config.ecommerceFeatures.map(ef => {
                        const isSelected = state.selectedEcommerceFeatures.includes(ef.id);
                        const isBaseIncluded = ef.includedInWebsites?.includes('ecommerce');
                        return (
                          <div
                            key={ef.id}
                            onClick={() => toggleEcommerceFeature(ef.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-white/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{ef.title}</span>
                                  {isBaseIncluded && (
                                    <span className="text-[9px] font-sans px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                                      Store Core
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                                  {ef.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs font-sans font-bold text-emerald-400 shrink-0">
                              {isBaseIncluded ? '₹0' : `+₹${ef.price.toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 6: PRODUCTS COUNT (Conditional) */}
                {currentStep.id === 'products' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold mb-3">
                        Catalogue Size
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {config.productTiers.map(pt => {
                          const isSelected = state.productTier === pt.id;
                          return (
                            <div
                              key={pt.id}
                              onClick={() => setState(prev => ({ ...prev, productTier: pt.id }))}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                              }`}
                            >
                              <div className="text-sm font-bold text-white mb-1">{pt.label}</div>
                              <div className="text-xs font-sans text-emerald-400 font-bold">
                                {pt.price === 0 ? 'Included (+₹0)' : pt.isCustomQuote ? 'Custom Quote' : `+₹${pt.price.toLocaleString('en-IN')}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold mb-3">
                        Do you need us to upload your products?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {config.productUploadTiers.map(ut => {
                          const isSelected = state.productUploadTier === ut.id;
                          return (
                            <div
                              key={ut.id}
                              onClick={() => setState(prev => ({ ...prev, productUploadTier: ut.id }))}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                              }`}
                            >
                              <div className="text-sm font-bold text-white mb-1">{ut.label}</div>
                              <div className="text-xs font-sans text-emerald-400 font-bold">
                                {ut.price === 0 ? '₹0 (Self-Upload)' : ut.isCustomQuote ? 'Custom Quote' : `+₹${ut.price.toLocaleString('en-IN')}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: INTEGRATIONS */}
                {currentStep.id === 'integrations' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                      {config.integrations.map(item => {
                        const isSelected = state.selectedIntegrations.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleIntegration(item.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-white/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{item.title}</div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs font-sans font-bold text-emerald-400 shrink-0">
                              +₹{item.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Integration "Something else" */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>I need a different or proprietary integration</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Oracle ERP, SAP API, Custom Inventory Webhook..."
                        value={state.customIntegrationText || ''}
                        onChange={e => setState(prev => ({ ...prev, customIntegrationText: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-xs text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 8: SEO */}
                {currentStep.id === 'seo' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {config.seoOptions.map(s => {
                      const isSelected = state.seoOption === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setState(prev => ({ ...prev, seoOption: s.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-base text-white">{s.title}</h4>
                              <span className="text-xs font-sans font-bold text-emerald-400">
                                {s.price === 0 ? 'Included (+₹0)' : `+₹${s.price.toLocaleString('en-IN')}${s.isMonthly ? '/mo' : ''}`}
                              </span>
                            </div>
                            <ul className="space-y-1.5 my-4 border-t border-white/5 pt-3">
                              {s.features.map((feat, i) => (
                                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5">
                            {s.isMonthly ? '★ Ongoing Monthly Service' : '✓ One-time Setup Included'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 9: CONTENT & IMAGES */}
                {currentStep.id === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold mb-3">
                        Who will provide the website content?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {config.contentOptions.map(c => {
                          const isSelected = state.contentOption === c.id;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setState(prev => ({ ...prev, contentOption: c.id }))}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                              }`}
                            >
                              <div className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                                <span>{c.title}</span>
                                <span className="text-xs font-sans text-emerald-400 font-bold">
                                  {c.price === 0 ? '₹0' : `+₹${c.price.toLocaleString('en-IN')}`}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                                {c.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold mb-3">
                        Who will provide photography & imagery?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {config.imageOptions.map(img => {
                          const isSelected = state.imageOption === img.id;
                          return (
                            <div
                              key={img.id}
                              onClick={() => setState(prev => ({ ...prev, imageOption: img.id }))}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                              }`}
                            >
                              <div className="text-sm font-bold text-white mb-1">{img.title}</div>
                              <div className="text-xs font-sans text-emerald-400 font-bold">
                                {img.price === 0 && !img.isContactOnly ? '₹0' : img.isContactOnly ? 'Contact Us' : `+₹${img.price.toLocaleString('en-IN')}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 10: BRANDING */}
                {currentStep.id === 'branding' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.brandingOptions.map(b => {
                      const isSelected = state.brandingOption === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setState(prev => ({ ...prev, brandingOption: b.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-base text-white">{b.title}</h4>
                              <span className="text-xs font-sans font-bold text-emerald-400">
                                {b.price === 0 ? '₹0' : `+₹${b.price.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                              {b.description}
                            </p>
                            {b.items && (
                              <div className="space-y-1 my-3 border-t border-white/5 pt-2">
                                {b.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>{it}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5">
                            {isSelected ? '✓ Selected' : 'Choose Plan'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 11: MIGRATION */}
                {currentStep.id === 'migration' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {config.migrationOptions.map(m => {
                      const isSelected = state.migrationOption === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setState(prev => ({ ...prev, migrationOption: m.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-sm text-white">{m.title}</h4>
                              <span className="text-xs font-sans font-bold text-emerald-400">
                                {m.price === 0 ? '₹0' : m.isCustomQuote ? 'Custom' : `+₹${m.price.toLocaleString('en-IN')}`}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                              {m.description}
                            </p>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5 mt-4">
                            {isSelected ? '✓ Selected' : 'Select'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 12: DOMAIN & HOSTING */}
                {currentStep.id === 'hosting' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.domainHostingOptions.map(h => {
                      const isSelected = state.domainHostingOption === h.id;
                      return (
                        <div
                          key={h.id}
                          onClick={() => setState(prev => ({ ...prev, domainHostingOption: h.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-base text-white">{h.title}</h4>
                              <span className="text-xs font-sans font-bold text-emerald-400">
                                {h.price === 0 ? '₹0' : `+₹${h.price.toLocaleString('en-IN')}/year`}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                              {h.description}
                            </p>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5 mt-4">
                            ★ Billed Annually
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 13: MAINTENANCE */}
                {currentStep.id === 'maintenance' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {config.maintenanceOptions.map(m => {
                      const isSelected = state.maintenanceOption === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setState(prev => ({ ...prev, maintenanceOption: m.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40 shadow-lg'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <h4 className="font-bold text-sm text-white mb-1">{m.title}</h4>
                            <div className="text-base font-black text-emerald-400 font-sans mb-3">
                              {m.price === 0 ? '₹0 /mo' : `₹${m.price.toLocaleString('en-IN')} /mo`}
                            </div>
                            <ul className="space-y-1.5 my-3 border-t border-white/5 pt-3">
                              {m.features.map((feat, idx) => (
                                <li key={idx} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5 mt-2">
                            {isSelected ? '✓ Active Plan' : 'Select'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 14: DELIVERY SPEED */}
                {currentStep.id === 'delivery' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {config.deliverySpeeds.map(d => {
                      const isSelected = state.deliverySpeed === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setState(prev => ({ ...prev, deliverySpeed: d.id }))}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-base text-white">{d.title}</h4>
                            </div>
                            <div className="text-xl font-black text-emerald-400 font-sans mb-2">
                              {d.multiplier === 1 ? 'Standard Price' : `+${Math.round((d.multiplier - 1) * 100)}% Sprint`}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                              {d.description}
                            </p>
                          </div>
                          <div className="text-[10px] font-sans text-zinc-500 pt-3 border-t border-white/5 mt-4">
                            SLA subject to final scope review
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 15: CUSTOMER DETAILS & ESTIMATE SUMMARY */}
                {currentStep.id === 'details' && (
                  <div>
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmitLead} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">Your Name *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Rahul Sharma"
                              value={state.customerName || ''}
                              onChange={e => setState(prev => ({ ...prev, customerName: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">Business / Brand Name *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Zenith Apparel / Apex Logistics"
                              value={state.businessName || ''}
                              onChange={e => setState(prev => ({ ...prev, businessName: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">Email Address</label>
                            <input
                              type="email"
                              placeholder="rahul@example.com"
                              value={state.email || ''}
                              onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">WhatsApp / Phone Number *</label>
                            <input
                              required
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={state.phone || ''}
                              onChange={e => setState(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">City / Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Bangalore / Chennai / Mumbai"
                              value={state.city || ''}
                              onChange={e => setState(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-sans text-zinc-400 block mb-1.5">Existing Website / Instagram (Optional)</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={state.websiteUrl || ''}
                              onChange={e => setState(prev => ({ ...prev, websiteUrl: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-sans text-zinc-400 block mb-1.5">Any specific operational requirements?</label>
                          <textarea
                            rows={3}
                            placeholder="Tell us about any specific workflows, sample competitor sites you like, or expected launch timelines..."
                            value={state.additionalNotes || ''}
                            onChange={e => setState(prev => ({ ...prev, additionalNotes: e.target.value }))}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-sm text-white outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="w-full py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                          {isSubmittingLead ? (
                            <span>Generating Formal Estimate...</span>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>GET MY ESTIMATE</span>
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      /* Confirmation Screen */
                      <div className="py-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                          Your Website Estimate Is Ready
                        </h3>
                        <div className="text-3xl md:text-4xl font-black text-emerald-400 font-sans my-3">
                          {estimate.isCustomProject
                            ? 'Starting from ₹2,50,000'
                            : `Estimated: ₹${estimate.oneTimeTotal.toLocaleString('en-IN')}`}
                        </div>
                        <p className="text-xs md:text-sm text-zinc-300 max-w-lg mb-8 leading-relaxed">
                          Your requirements and selections have been saved. Our lead technical team will review your scope and provide a confirmed formal quotation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Talk on WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={handleRestart}
                            className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs border border-white/20 transition-all cursor-pointer"
                          >
                            Start Again
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Back & Next footer buttons */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={handlePrev}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentStepIndex === 0
                      ? 'opacity-30 cursor-not-allowed text-zinc-500'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="text-xs text-zinc-500 font-sans hidden sm:block">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>

                {currentStepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-sans text-emerald-400 font-bold">
                    ✓ Final Step
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Legal Disclaimer Note */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-zinc-400">
            <p>
              <strong>Important Notice:</strong> "This is an estimated price. Final pricing may vary based on the exact project requirements, technical complexity, custom third-party APIs, and asset availability."
            </p>
          </div>
        </div>

        {/* Right Sticky Price Summary Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-6">
          <div className="bg-zinc-950/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-emerald-400 font-bold block">
                  LIVE ESTIMATE
                </span>
                <h3 className="text-lg font-bold text-white">Project Scope</h3>
              </div>

              {/* GST Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans text-zinc-400">GST (18%)</span>
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, includeGst: !prev.includeGst }))}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    state.includeGst ? 'bg-emerald-400' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${
                      state.includeGst ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Selected Spec Pills */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Website:</span>
                <span className="font-bold text-white capitalize">
                  {config.websiteTypes.find(w => w.id === state.websiteType)?.title || state.websiteType}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Pages:</span>
                <span className="font-bold text-white">
                  {config.pageTiers.find(p => p.id === state.pageTier)?.label || state.pageTier}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Design Caliber:</span>
                <span className="font-bold text-white capitalize">
                  {config.designTiers.find(d => d.id === state.designTier)?.title || state.designTier}
                </span>
              </div>
              {state.selectedFeatures.length > 0 && (
                <div className="py-1 border-b border-white/5">
                  <div className="text-zinc-400 mb-1">Features ({state.selectedFeatures.length}):</div>
                  <div className="flex flex-wrap gap-1">
                    {state.selectedFeatures.slice(0, 5).map(fId => {
                      const f = config.features.find(x => x.id === fId);
                      return (
                        <span key={fId} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300 font-sans">
                          {f?.title || fId}
                        </span>
                      );
                    })}
                    {state.selectedFeatures.length > 5 && (
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400 font-sans font-bold">
                        +{state.selectedFeatures.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Package Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-emerald-400 font-bold">
                  [ BEST FOR YOU ]
                </span>
                {estimate.recommendedPackage.badge && (
                  <span className="text-[9px] font-sans px-2 py-0.5 bg-emerald-400 text-black font-bold rounded-full">
                    {estimate.recommendedPackage.badge}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-white mb-1">
                {estimate.recommendedPackage.title}
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {estimate.recommendedPackage.description}
              </p>
            </div>

            {/* Custom Project Banner if criteria met */}
            {estimate.isCustomProject && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>CUSTOM PROJECT ARCHITECTURE</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Your requirements include enterprise modules ({estimate.customProjectReasons.join(', ')}). A custom engineering blueprint will be prepared.
                </p>
              </div>
            )}

            {/* One-Time Development Price Box */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center relative overflow-hidden">
              <span className="text-[11px] font-sans uppercase tracking-widest text-zinc-400 block mb-1">
                Estimated Project Cost
              </span>
              <div className="text-3xl font-black text-white font-sans tracking-tight">
                {estimate.isCustomProject ? (
                  <span className="text-2xl text-emerald-400">Starting from ₹2,50,000</span>
                ) : (
                  <span>₹{estimate.oneTimeTotal.toLocaleString('en-IN')}</span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                One-time development sprint {state.includeGst ? '(Incl. 18% GST)' : '(Excl. GST)'}
              </span>
            </div>

            {/* Optional Recurring Services Box */}
            {(estimate.yearlyHosting > 0 || estimate.monthlyMaintenance > 0 || estimate.monthlySeo > 0) && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                  OPTIONAL RECURRING SERVICES
                </span>
                {estimate.yearlyHosting > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Hosting & Domain:</span>
                    <span className="font-sans font-bold text-zinc-200">
                      ₹{estimate.yearlyHosting.toLocaleString('en-IN')}/year
                    </span>
                  </div>
                )}
                {estimate.monthlyMaintenance > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Maintenance:</span>
                    <span className="font-sans font-bold text-zinc-200">
                      ₹{estimate.monthlyMaintenance.toLocaleString('en-IN')}/month
                    </span>
                  </div>
                )}
                {estimate.monthlySeo > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">SEO Retainer:</span>
                    <span className="font-sans font-bold text-zinc-200">
                      ₹{estimate.monthlySeo.toLocaleString('en-IN')}/month
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black tracking-wider uppercase text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>GET THIS QUOTE ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Estimate Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-zinc-950/95 border-t border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[9px] font-sans text-zinc-400 uppercase tracking-wider block">
            Estimated Cost {state.includeGst ? '(Incl. GST)' : ''}
          </span>
          <div className="text-xl font-black text-emerald-400 font-sans">
            {estimate.isCustomProject ? '₹2,50,000+' : `₹${estimate.oneTimeTotal.toLocaleString('en-IN')}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobileSummary(true)}
            className="px-3 py-2 rounded-xl bg-white/10 text-white font-sans text-xs font-bold uppercase border border-white/10"
          >
            Breakdown
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#25D366] text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Mobile Breakdown Modal / Bottom Sheet */}
      <AnimatePresence>
        {showMobileSummary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSummary(false)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-zinc-900 border-t border-white/20 rounded-t-3xl p-6 z-[101] overflow-y-auto custom-scrollbar flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-lg text-white">Itemized Estimate Summary</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileSummary(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>

              {/* GST Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-sans text-zinc-300">Include GST (18%) in display:</span>
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, includeGst: !prev.includeGst }))}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    state.includeGst ? 'bg-emerald-400' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${
                      state.includeGst ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Detailed Breakdown List */}
              <div className="space-y-2">
                {estimate.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-zinc-400">{item.category}: {item.title}</span>
                    <span className="font-sans font-bold text-zinc-200">
                      {item.isIncluded ? 'Included' : item.isCustomQuote ? 'Custom' : `₹${item.cost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center my-2">
                <span className="text-xs text-zinc-400 block mb-1">Total One-Time Development</span>
                <div className="text-2xl font-black text-emerald-400 font-sans">
                  {estimate.isCustomProject ? 'Starting from ₹2,50,000' : `₹${estimate.oneTimeTotal.toLocaleString('en-IN')}`}
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#25D366] text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get This Quote on WhatsApp</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

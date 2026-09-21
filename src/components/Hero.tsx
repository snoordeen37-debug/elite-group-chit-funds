import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, PhoneCall, MessageCircle, Shield, TrendingUp, Sparkles, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_DETAILS } from '../data/chitPlansData';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (plan?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenEnquiry }) => {
  const { t } = useTranslation();
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappDefaultMsg)}`;

  const quickDenominations = [
    { label: '₹50,000', monthly: `₹2,500${t('hero.perMonth')}` },
    { label: '₹1,00,000', monthly: `₹5,000${t('hero.perMonth')}` },
    { label: '₹2,00,000', monthly: `₹10,000${t('hero.perMonth')}` },
    { label: '₹3,00,000', monthly: t('hero.twentyOneInstallments') },
    { label: '₹4,00,000', monthly: `₹15,000${t('hero.perMonth')}` },
    { label: '₹5,00,000', monthly: `₹25,000${t('hero.perMonth')}` },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F7F3E9] via-[#FDFBF7] to-[#FBF8F1] pt-6 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20 border-b border-amber-200/70" id="hero-section">
      {/* Background Aesthetic Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06] stroke-slate-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="financial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#financial-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Column (Hero Text & Actions) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Verified Brand Tag */}
            <div className="w-fit max-w-full inline-flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-white border border-amber-300 shadow-sm mb-5 flex-wrap sm:flex-nowrap">
              <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#C5A028] animate-pulse shrink-0 ring-4 ring-[#C5A028]/20"></span>
              <span className="font-bold text-sm sm:text-base text-[#001A33] tracking-wide whitespace-nowrap uppercase">
                {t('hero.badge')}
              </span>
              <span className="hidden sm:inline-block w-px h-4 bg-amber-300 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
                {t('hero.location')}
              </span>
            </div>

            {/* Official Primary Heading */}
            <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#001A33] tracking-tight leading-[1.15] mb-3">
              {t('hero.titleLine1')} <br className="hidden sm:block" />
              <span className="text-[#C5A028]">
                {t('hero.titleLine2')}
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-600 text-[15px] sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-6">
              {t('hero.subtitle')}
            </p>

            {/* CTAs Row */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
              {/* Primary CTA */}
              <button
                onClick={() => onNavigate('chit-plans')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-bold text-sm uppercase tracking-wider text-[#001A33] bg-[#C5A028] hover:bg-[#e0b83e] shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 border border-[#f0c842] cursor-pointer"
                id="hero-view-plans-btn"
              >
                <span>{t('hero.viewPlansBtn')}</span>
                <ArrowRight className="w-4 h-4 text-[#001A33]" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-sm text-[#001A33] bg-white hover:bg-slate-100 border border-slate-300 hover:border-[#C5A028]/60 shadow-sm transition-all duration-150 cursor-pointer"
                id="hero-contact-us-btn"
              >
                <PhoneCall className="w-4 h-4 text-[#C5A028]" />
                <span>{t('hero.contactUsBtn')}</span>
              </button>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all duration-150 shadow-sm"
                id="hero-whatsapp-btn"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t('hero.chatWhatsAppBtn')}</span>
              </a>
            </div>

            {/* Quick Micro-Trust Signals */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200 w-full font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#C5A028] shrink-0" />
                <span>{t('hero.trustSignal1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#C5A028] shrink-0" />
                <span>{t('hero.trustSignalRange')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C5A028] shrink-0" />
                <span>{t('hero.trustSignal3')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Brand Emblem & Quick Plan Catalog Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-xl bg-white p-5 sm:p-6 border border-amber-200/80 shadow-xl shadow-amber-950/5">
              
              {/* Card Header with Brand Crest */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                <BrandLogo size="md" showManagedBy={false} />
                <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[#001A33] font-mono text-xs font-bold">
                  {t('hero.cardBadge')}
                </div>
              </div>

              {/* Quick Interactive Denomination Ticker */}
              <div className="my-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2.5 flex items-center justify-between">
                  <span>{t('hero.cardTitle')}</span>
                  <span className="text-[#C5A028] text-xs font-bold">{t('hero.cardSubtitle')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {quickDenominations.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenEnquiry(p.label)}
                      className="p-2.5 rounded-md bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-[#C5A028]/60 text-left transition-all group cursor-pointer shadow-sm"
                    >
                      <div className="text-sm font-bold text-[#001A33] group-hover:text-[#C5A028] transition-colors">
                        {p.label}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{p.monthly}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Company Credentials Box */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{t('hero.corpIdentity')}</span>
                  <span className="font-mono text-slate-900 font-bold select-all">{COMPANY_DETAILS.cin}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{t('hero.operationalEntity')}</span>
                  <span className="text-[#001A33] font-bold">{t('hero.managedBy')}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{t('hero.headquarters')}</span>
                  <span className="text-slate-800 font-semibold">{t('hero.headquartersLocation')}</span>
                </div>
              </div>

              {/* Action Inside Card */}
              <div className="mt-4">
                <button
                  onClick={() => onOpenEnquiry()}
                  className="w-full py-3 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  id="hero-card-enquire-btn"
                >
                  <Award className="w-4 h-4 text-[#001A33]" />
                  <span>{t('hero.cardEnquireBtn')}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HOW_IT_WORKS_STEPS } from '../data/chitPlansData';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenEnquiry: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenEnquiry }) => {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 bg-slate-50 relative border-t border-slate-200" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            {t('howItWorks.badge')}
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001A33] tracking-tight mb-2.5">
            {t('howItWorks.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="rounded-xl bg-white border border-slate-200 hover:border-[#C5A028] p-5 flex flex-col justify-between transition-all hover:shadow-md group relative shadow-sm"
              id={`step-card-${step.stepNumber}`}
            >
              <div>
                {/* Gold Step Number Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A028] text-[#001A33] font-['Cinzel'] font-black text-sm flex items-center justify-center shadow-xs">
                    {step.stepNumber}
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {t('howItWorks.stepLabel')} {idx + 1}
                  </span>
                </div>

                <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#001A33] transition-colors mb-1.5">
                  {t('data.steps.' + parseInt(step.stepNumber) + '.title')}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-[#b48616] mb-2">
                  {t('data.steps.' + parseInt(step.stepNumber) + '.description')}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('data.steps.' + parseInt(step.stepNumber) + '.detail')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C5A028]" />
                <span>{t('howItWorks.proceduralClarity')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper Strip */}
        <div className="mt-8 p-5 sm:p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900">{t('howItWorks.bottomQuestion')}</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('howItWorks.bottomDesc')}
            </div>
          </div>
          <button
            onClick={onOpenEnquiry}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm hover:shadow-md"
            id="how-it-works-enquire-btn"
          >
            <span>{t('howItWorks.startRegistrationBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

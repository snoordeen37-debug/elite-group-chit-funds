import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/chitPlansData';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenEnquiry: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            Clear 5-Step Path
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            HOW IT WORKS
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            A structured, disciplined process designed to help you save systematically and access funds when required.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="rounded-lg bg-[#001226] border border-slate-800 hover:border-[#C5A028]/50 p-4 flex flex-col justify-between transition-all hover:bg-[#001c3d] group relative"
              id={`step-card-${step.stepNumber}`}
            >
              <div>
                {/* Gold Step Number Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#C5A028] text-[#001A33] font-['Cinzel'] font-black text-sm flex items-center justify-center shadow-md">
                    {step.stepNumber}
                  </div>
                  <span className="text-[10px] font-bold text-[#C5A028] uppercase tracking-widest bg-[#001A33] px-2 py-0.5 rounded border border-slate-800">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-white group-hover:text-[#C5A028] transition-colors mb-1.5">
                  {step.title}
                </h3>

                <p className="text-xs font-semibold text-[#C5A028] mb-2">
                  {step.description}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.detail}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A028]" />
                <span>Procedural Clarity</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper Strip */}
        <div className="mt-8 p-4 rounded-lg bg-[#001226] border border-[#C5A028]/35 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">Have questions about subscription or auction cycles?</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Our team at ELITE TURF Mettupalayam is available to guide you through every stage.
            </div>
          </div>
          <button
            onClick={onOpenEnquiry}
            className="px-4 py-2 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            id="how-it-works-enquire-btn"
          >
            <span>Start Registration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

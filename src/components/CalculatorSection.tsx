import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldAlert, Sparkles, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { 
  OFFICIAL_CHIT_CATALOG, 
  CHIT_CONTRIBUTION_OPTIONS, 
  CHIT_PLANS_SUMMARY 
} from '../data/chitPlansData';

interface CalculatorSectionProps {
  onOpenEnquiry: (plan?: string) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({ onOpenEnquiry }) => {
  const [selectedPlanValue, setSelectedPlanValue] = useState<string>('₹1,00,000');

  // Plan summary lookup
  const currentPlan = CHIT_PLANS_SUMMARY.find(p => p.value === selectedPlanValue) || CHIT_PLANS_SUMMARY[1];
  const contributionInfo = CHIT_CONTRIBUTION_OPTIONS.find(c => c.chitValue === selectedPlanValue);

  // Column key in official catalog
  const getCatalogColumnKey = (val: string): keyof typeof OFFICIAL_CHIT_CATALOG[0] => {
    switch (val) {
      case '₹50,000': return 'plan50k';
      case '₹1,00,000': return 'plan100k';
      case '₹2,00,000': return 'plan200k';
      case '₹3,00,000': return 'plan300k';
      case '₹4,00,000': return 'plan400k';
      case '₹5,00,000': return 'plan500k';
      default: return 'plan100k';
    }
  };

  const colKey = getCatalogColumnKey(selectedPlanValue);

  // Extract catalog sample progression milestones: Row 2 (Min auction), Row 11 (Mid-tier), Row 21 (Final tier)
  const minTierVal = OFFICIAL_CHIT_CATALOG[1][colKey]; // Row 2
  const midTierVal = OFFICIAL_CHIT_CATALOG[10][colKey]; // Row 11
  const maxTierVal = OFFICIAL_CHIT_CATALOG[20][colKey]; // Row 21

  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Calculator className="w-3.5 h-3.5 text-[#C5A028]" />
            Official Plan Explorer
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2.5">
            CHIT PLAN CALCULATOR
          </h2>
          <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed">
            Select a chit value to review the official installment schedule, contribution modes, and catalog payout progression.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="max-w-4xl mx-auto rounded-lg bg-[#001226] border border-[#C5A028]/35 p-5 sm:p-7 shadow-xl">
          
          {/* Step 1: Select Denomination */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-200 mb-2.5">
              1. Choose Chit Denomination:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹4,00,000', '₹5,00,000'].map((val) => {
                const isSelected = selectedPlanValue === val;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedPlanValue(val)}
                    className={`py-2.5 px-2 rounded-md text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C5A028] text-[#001A33] font-black shadow-md border-2 border-[#fff]'
                        : 'bg-[#001A33] text-slate-200 hover:bg-[#00264d] border border-slate-800 font-semibold'
                    }`}
                    id={`calc-select-${val.replace(/[^0-9]/g, '')}`}
                  >
                    <div className="text-sm font-bold">{val}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Data Display Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
            
            {/* Box 1: Installment & Frequency */}
            <div className="p-4 sm:p-5 rounded-md bg-[#001A33] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Contribution Cycle</span>
                <div className="text-lg sm:text-xl font-bold text-white mt-1">21 Installments</div>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Monthly:</span>
                  <span className="font-bold text-[#C5A028]">
                    {contributionInfo ? contributionInfo.monthly : currentPlan.monthlyContribution}
                  </span>
                </div>
                {contributionInfo && (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Weekly:</span>
                      <span className="font-mono text-white font-semibold">{contributionInfo.weekly}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Daily:</span>
                      <span className="font-mono text-white font-semibold">{contributionInfo.daily}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Box 2: Catalog Take-Home Progression */}
            <div className="p-4 sm:p-5 rounded-md bg-[#001A33] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Catalog Take-Home Range</span>
                <div className="text-lg sm:text-xl font-bold text-[#C5A028] mt-1 font-mono">
                  {currentPlan.minTakeHome} – {currentPlan.maxTakeHome}
                </div>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span>Row 2 (Starting tier):</span>
                  <span className="font-mono text-slate-200 font-semibold">{minTierVal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Row 11 (Mid-cycle):</span>
                  <span className="font-mono text-slate-200 font-semibold">{midTierVal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Row 21 (Final tier):</span>
                  <span className="font-mono text-slate-200 font-semibold">{maxTierVal}</span>
                </div>
              </div>
            </div>

            {/* Box 3: Action & Group Status */}
            <div className="p-4 sm:p-5 rounded-md bg-[#001A33] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Selected Plan</span>
                <div className="text-lg sm:text-xl font-bold text-white mt-1">{selectedPlanValue} Chit</div>
              </div>
              <div className="mt-3.5">
                <button
                  onClick={() => onOpenEnquiry(selectedPlanValue)}
                  className="w-full py-2.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  id="calc-enquire-btn"
                >
                  <span>Enquire This Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Tier Sample Breakdown Accordion / Visual Strip */}
          <div className="bg-[#001A33] p-4 rounded-md border border-slate-800 mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#C5A028]" />
                Official Progression Sample for {selectedPlanValue}
              </span>
              <span className="text-xs text-[#C5A028] font-bold font-mono">S.NO 2 → 21</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#000d1a] border border-slate-800">
                <div className="text-slate-400 text-xs">Tier S.NO 2</div>
                <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[1][colKey]}</div>
              </div>
              <div className="p-2.5 rounded bg-[#000d1a] border border-slate-800">
                <div className="text-slate-400 text-xs">Tier S.NO 7</div>
                <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[6][colKey]}</div>
              </div>
              <div className="p-2.5 rounded bg-[#000d1a] border border-slate-800">
                <div className="text-slate-400 text-xs">Tier S.NO 13</div>
                <div className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[12][colKey]}</div>
              </div>
              <div className="p-2.5 rounded bg-[#000d1a] border border-slate-800">
                <div className="text-slate-400 text-xs">Tier S.NO 21</div>
                <div className="text-sm sm:text-base font-bold text-[#C5A028] font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[20][colKey]}</div>
              </div>
            </div>
          </div>

          {/* MANDATORY PROMINENT DISCLAIMER */}
          <div className="p-4 rounded-md bg-[#000d1a] border border-amber-500/30 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">Official Disclaimer:</strong>
              “Illustrative information only. Actual contributions, auction terms, discounts, payout amounts and other conditions are subject to the applicable chit agreement and company terms.”
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

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
    <section className="py-12 md:py-16 bg-white relative border-t border-slate-200" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#C5A028]" />
            Official Plan Explorer
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#001A33] tracking-tight mb-2.5">
            CHIT PLAN CALCULATOR
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            Select a chit value to review the official installment schedule, contribution modes, and catalog payout progression.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="max-w-4xl mx-auto rounded-xl bg-white border border-slate-200 p-5 sm:p-7 shadow-lg">
          
          {/* Step 1: Select Denomination */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-900 mb-2.5">
              1. Choose Chit Denomination:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {['₹50,000', '₹1,00,000', '₹2,00,000', '₹3,00,000', '₹4,00,000', '₹5,00,000'].map((val) => {
                const isSelected = selectedPlanValue === val;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedPlanValue(val)}
                    className={`py-3 px-2 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#001A33] text-[#C5A028] font-black shadow-md border-2 border-[#C5A028]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 font-bold'
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Box 1: Installment & Frequency */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contribution Cycle</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">21 Installments</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Monthly:</span>
                  <span className="font-bold text-[#001A33]">
                    {contributionInfo ? contributionInfo.monthly : currentPlan.monthlyContribution}
                  </span>
                </div>
                {contributionInfo && (
                  <>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Weekly:</span>
                      <span className="font-mono text-slate-900 font-bold">{contributionInfo.weekly}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Daily:</span>
                      <span className="font-mono text-slate-900 font-bold">{contributionInfo.daily}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Box 2: Catalog Take-Home Progression */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Catalog Take-Home Range</span>
                <div className="text-lg sm:text-xl font-black text-[#001A33] mt-1 font-mono">
                  {currentPlan.minTakeHome} – {currentPlan.maxTakeHome}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Row 2 (Starting tier):</span>
                  <span className="font-mono text-slate-900 font-bold">{minTierVal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Row 11 (Mid-cycle):</span>
                  <span className="font-mono text-slate-900 font-bold">{midTierVal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Row 21 (Final tier):</span>
                  <span className="font-mono text-[#b48616] font-black">{maxTierVal}</span>
                </div>
              </div>
            </div>

            {/* Box 3: Action & Group Status */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Plan</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{selectedPlanValue} Chit</div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onOpenEnquiry(selectedPlanValue)}
                  className="w-full py-3 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  id="calc-enquire-btn"
                >
                  <span>Enquire This Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Tier Sample Breakdown Visual Strip */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#C5A028]" />
                Official Progression Sample for {selectedPlanValue}
              </span>
              <span className="text-xs text-[#b48616] font-bold font-mono">S.NO 2 → 21</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium">Tier S.NO 2</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[1][colKey]}</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium">Tier S.NO 7</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[6][colKey]}</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium">Tier S.NO 13</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[12][colKey]}</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium">Tier S.NO 21</div>
                <div className="text-sm sm:text-base font-bold text-[#b48616] font-mono mt-0.5">{OFFICIAL_CHIT_CATALOG[20][colKey]}</div>
              </div>
            </div>
          </div>

          {/* MANDATORY PROMINENT DISCLAIMER */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-900 block mb-0.5 font-bold">Official Disclaimer:</strong>
              “Illustrative information only. Actual contributions, auction terms, discounts, payout amounts and other conditions are subject to the applicable chit agreement and company terms.”
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

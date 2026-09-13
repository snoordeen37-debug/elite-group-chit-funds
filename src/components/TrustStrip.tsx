import React from 'react';
import { ShieldCheck, Building2, Landmark, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';

export const TrustStrip: React.FC = () => {
  return (
    <section className="w-full bg-white border-y border-slate-200 shadow-sm relative z-20 py-3.5 px-4 sm:px-6" id="trust-strip">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          
          {/* Item 1: Company */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#C5A028]/50 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Company</div>
              <div className="text-sm sm:text-base font-bold text-[#001A33] tracking-tight">{COMPANY_DETAILS.companyName}</div>
            </div>
          </div>

          {/* Item 2: Business & Service */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#C5A028]/50 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Business</div>
              <div className="text-sm sm:text-base font-bold text-[#C5A028] tracking-tight">{COMPANY_DETAILS.businessName}</div>
            </div>
          </div>

          {/* Item 3: Corporate Identification Number */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#C5A028]/50 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">CIN Reference</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 select-all">{COMPANY_DETAILS.cin}</div>
            </div>
          </div>

          {/* Item 4: Managed By */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-50/50 border border-[#C5A028]/50 hover:bg-amber-50 transition-colors shadow-sm">
            <div className="w-9 h-9 rounded-md bg-[#C5A028] flex items-center justify-center shrink-0 text-[#001A33]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Operating Entity</div>
              <div className="text-sm sm:text-base font-bold text-[#001A33] tracking-tight flex items-center gap-1.5">
                <span>{COMPANY_DETAILS.managedBy}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A028] text-[#001A33] font-bold">Verified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

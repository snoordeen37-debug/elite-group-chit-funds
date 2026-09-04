import React from 'react';
import { ShieldCheck, Building2, Landmark, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';

export const TrustStrip: React.FC = () => {
  return (
    <section className="w-full bg-[#000d1a] border-y border-[#C5A028]/30 relative z-20 py-3.5 px-4 sm:px-6" id="trust-strip">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          
          {/* Item 1: Company */}
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#001226] border border-slate-800 hover:border-[#C5A028]/40 transition-colors">
            <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Company</div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight">{COMPANY_DETAILS.companyName}</div>
            </div>
          </div>

          {/* Item 2: Business & Service */}
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#001226] border border-slate-800 hover:border-[#C5A028]/40 transition-colors">
            <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Business</div>
              <div className="text-xs sm:text-sm font-bold text-[#C5A028] tracking-tight">{COMPANY_DETAILS.businessName}</div>
            </div>
          </div>

          {/* Item 3: Corporate Identification Number */}
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#001226] border border-slate-800 hover:border-[#C5A028]/40 transition-colors">
            <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center shrink-0 text-[#C5A028]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">CIN Reference</div>
              <div className="text-xs font-mono font-bold text-slate-200 select-all">{COMPANY_DETAILS.cin}</div>
            </div>
          </div>

          {/* Item 4: Managed By */}
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#001226] border border-[#C5A028]/40 hover:bg-[#00264d]/40 transition-colors">
            <div className="w-9 h-9 rounded-md bg-[#C5A028] flex items-center justify-center shrink-0 text-[#001A33]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Operating Entity</div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{COMPANY_DETAILS.managedBy}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A028]/20 text-[#C5A028] font-bold border border-[#C5A028]/40">Verified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

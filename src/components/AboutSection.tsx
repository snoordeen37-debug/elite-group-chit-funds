import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight,
  Landmark
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';
import { BrandLogo } from './BrandLogo';

interface AboutSectionProps {
  onOpenEnquiry: () => void;
  onNavigate: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEnquiry, onNavigate }) => {
  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual & Verification Card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-lg bg-[#001226] border border-[#C5A028]/35 p-5 sm:p-6 shadow-xl relative">
              
              <div className="mb-4 pb-4 border-b border-slate-800 flex items-center justify-between">
                <BrandLogo size="md" showManagedBy={true} />
              </div>

              {/* Verified Credentials Block */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-md bg-[#001A33] border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Corporate Identification Number (CIN)
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wide select-all">
                    {COMPANY_DETAILS.cin}
                  </div>
                </div>

                <div className="p-3 rounded-md bg-[#001A33] border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Operating Entity
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#C5A028]">
                    Managed by {COMPANY_DETAILS.managedBy}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                    <span>{COMPANY_DETAILS.officeAddress}</span>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-[#001A33] border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Direct Contact Lines
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-slate-200">
                    <a href={`tel:${COMPANY_DETAILS.phone1Clean}`} className="hover:text-[#C5A028] flex items-center gap-1.5 font-medium">
                      <Phone className="w-4 h-4 text-[#C5A028]" /> {COMPANY_DETAILS.phone1}
                    </a>
                    <a href={`tel:${COMPANY_DETAILS.phone2Clean}`} className="hover:text-[#C5A028] flex items-center gap-1.5 font-medium">
                      <Phone className="w-4 h-4 text-[#C5A028]" /> {COMPANY_DETAILS.phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Assurance */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#C5A028] shrink-0" />
                <span>Dedicated to procedural compliance and subscriber clarity</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-3">
              <Landmark className="w-4 h-4 text-[#C5A028]" />
              Company Background
            </div>

            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.2] mb-4">
              About <span className="text-[#C5A028]">ELITE GROUP</span> – SS CHIT FUNDS
            </h2>

            <div className="space-y-3.5 text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              <p className="font-semibold text-white">
                ELITE GROUP – SS CHIT FUNDS provides structured chit-fund plans designed to give members a disciplined way to contribute regularly while providing access to different chit values according to their financial requirements.
              </p>
              
              <p className="text-slate-300">
                Operating in Mettupalayam under the stewardship of <strong>ELITE TURF</strong>, we believe that transparency, structured planning, and prompt customer communication form the bedrock of sustainable financial relationships.
              </p>

              <p className="text-slate-300">
                Whether you are looking to cultivate systematic savings habits or require timely access to capital for personal, agricultural, trade, or business aspirations, our structured 21-installment plans offer clear schedules and predictable processes.
              </p>
            </div>

            {/* Core Commitments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mb-6">
              {[
                { title: 'Transparency', desc: 'Clear terms and exact catalog schedules upfront.' },
                { title: 'Clear Plan Information', desc: 'No hidden complexities or ambiguous auction rules.' },
                { title: 'Structured Plans', desc: 'Strict 21-installment schedules for all ticket sizes.' },
                { title: 'Professional Service', desc: 'Systematic documentation and prompt account support.' },
                { title: 'Customer Communication', desc: 'Direct accessibility via phone, WhatsApp and office.' },
                { title: 'Financial Discipline', desc: 'Daily, weekly, and monthly payment convenience.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-md bg-[#001226] border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs sm:text-sm text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenEnquiry}
                className="w-full sm:w-auto px-5 py-3 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                id="about-enquire-btn"
              >
                <span>Enquire With Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('chit-plans')}
                className="w-full sm:w-auto px-4 py-3 rounded-md bg-[#001226] hover:bg-[#00264d] text-slate-200 border border-slate-700 hover:border-[#C5A028]/50 font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer"
                id="about-view-catalog-btn"
              >
                <span>View Full Catalog</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

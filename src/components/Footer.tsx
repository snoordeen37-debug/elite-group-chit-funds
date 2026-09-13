import React from 'react';
import { Phone, MapPin, ShieldCheck, Mail, ArrowUp, Sparkles, Building2, CheckCircle2, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_DETAILS } from '../data/chitPlansData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLegal: (type: 'terms' | 'privacy' | 'disclaimer') => void;
  onOpenEnquiry: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal,
  onOpenEnquiry,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000d1a] text-slate-300 border-t border-slate-800 relative z-10" id="main-footer">
      {/* Top Decorative Gold Accent Line */}
      <div className="h-0.5 w-full bg-[#C5A028] opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          {/* Column 1: Brand & Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <BrandLogo size="lg" showManagedBy={false} />
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mt-2">
              <strong className="text-white">{COMPANY_DETAILS.fullBrandName}</strong> offers structured 21-installment chit fund plans designed to encourage disciplined savings and provide timely access to credit.
            </p>

            <div className="inline-block p-2.5 rounded-md bg-[#001226] border border-slate-800 text-xs sm:text-sm">
              <div className="text-slate-400 text-xs uppercase tracking-wider font-bold">Corporate Identity</div>
              <div className="text-white font-mono font-bold tracking-wider select-all">{COMPANY_DETAILS.cin}</div>
              <div className="text-xs text-[#C5A028] mt-0.5">Managed by {COMPANY_DETAILS.managedBy}</div>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-['Cinzel'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5A028]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'chit-plans', label: 'Chit Plans' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'benefits', label: 'Benefits' },
                { id: 'calculator', label: 'Plan Calculator' },
                { id: 'faq', label: 'FAQ' },
                { id: 'contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-slate-400 hover:text-[#C5A028] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C5A028]"></span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Office Details (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="font-['Cinzel'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5A028]">
              Office & Support
            </h4>
            
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A028] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {COMPANY_DETAILS.officeAddress}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A028] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`tel:${COMPANY_DETAILS.phone1Clean}`} className="hover:text-[#C5A028] font-medium">
                    {COMPANY_DETAILS.phone1}
                  </a>
                  <a href={`tel:${COMPANY_DETAILS.phone2Clean}`} className="hover:text-[#C5A028] font-medium">
                    {COMPANY_DETAILS.phone2}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 pt-1">
                <Building2 className="w-3.5 h-3.5 text-[#C5A028]" />
                <span>Managed by <strong>ELITE TURF</strong>, Mettupalayam</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenEnquiry}
                  className="w-full py-2.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  id="footer-enquire-btn"
                >
                  ENQUIRE NOW
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Compliance / Disclaimer Bar */}
        <div className="py-4 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1">
          <p>
            <strong className="text-slate-300">Statutory Disclaimer:</strong> Chit fund subscriptions and participation are subject to applicable terms, subscriber agreements, and regulations. ELITE GROUP – SS CHIT FUNDS does not guarantee fixed returns or speculative profit. All catalog figures are illustrative structured examples across the 21-installment duration.
          </p>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-slate-300">ELITE GROUP – SS CHIT FUNDS</strong>. All rights reserved.
            <span className="block sm:inline sm:ml-2 text-slate-500">CIN: {COMPANY_DETAILS.cin}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#C5A028] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#C5A028] transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-[#C5A028] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            {onOpenAdmin && (
              <>
                <span className="text-slate-700">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#C5A028] transition-colors cursor-pointer flex items-center gap-1 text-[#C5A028]"
                  id="footer-admin-btn"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </>
            )}
            <span className="text-slate-700">|</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white px-2 py-0.5 rounded bg-[#001226] border border-slate-800 flex items-center gap-1 text-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3 h-3 text-[#C5A028]" />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'disclaimer' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const titles = {
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    disclaimer: 'Legal & Regulatory Disclaimer',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xl my-6 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#001A33]/5 border border-[#001A33]/15 flex items-center justify-center text-[#001A33]">
              {type === 'disclaimer' ? <ShieldAlert className="w-4 h-4 text-[#C5A028]" /> : type === 'privacy' ? <Lock className="w-4 h-4 text-[#C5A028]" /> : <FileText className="w-4 h-4 text-[#C5A028]" />}
            </div>
            <h3 className="font-['Cinzel'] text-lg font-bold text-slate-900">
              {titles[type]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-4 text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3.5 pr-2">
          
          {type === 'disclaimer' && (
            <>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm">
                <strong className="text-amber-900 font-bold">Statutory Notice:</strong> Chit fund subscriptions and participation are subject to applicable terms, subscriber agreements, and regulations.
              </div>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">1. Illustrative Catalog Information</h4>
              <p>
                All tables, catalog values, contribution schedules (daily/weekly/monthly), and progression figures displayed on this website are illustrative representations derived from our standard 21-installment plan structure. Actual dividend distributions, auction discounts, and net payout sums vary by monthly auction results and individual subscriber agreements.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">2. No Guaranteed Returns or Profits</h4>
              <p>
                ELITE GROUP – SS CHIT FUNDS does not offer guaranteed speculative profits or fixed investment return promises. Chit funds are structured rotating savings and credit instruments governed by periodic member contributions and procedural auctions.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">3. Company & Corporate Identity</h4>
              <p>
                Business operations are managed by <strong>ELITE TURF</strong> at Mettupalayam – 641104, Tamil Nadu. Corporate Reference CIN: <strong className="text-slate-900 font-mono">{COMPANY_DETAILS.cin}</strong>.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">1. Membership & Enrollment</h4>
              <p>
                Enrollment into any chit fund group offered by ELITE GROUP – SS CHIT FUNDS is subject to document verification (valid identity proof, address proof, photograph) and acceptance of the formal subscriber agreement.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">2. Contribution Discipline</h4>
              <p>
                Subscribers agree to contribute their designated installment (monthly, weekly, or daily) punctually across the full duration of 21 installments. Timely contributions ensure eligibility for periodic auction participation and dividend distributions.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">3. Auction & Prize Disbursement</h4>
              <p>
                Chit auctions and draws are conducted strictly in adherence to group bylaws. Successful prize takers must fulfill standard verification and security documentation prior to prize disbursement.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">4. Modifications & Governance</h4>
              <p>
                ELITE GROUP reserves the right to modify promotional materials, inquiry processes, and operational timings in accordance with business guidelines.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">1. Information Collection</h4>
              <p>
                When you submit an enquiry through our website or contact us via phone/WhatsApp, we collect basic contact details including your full name, mobile number, email address, and preferred chit denomination.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">2. Purpose of Use</h4>
              <p>
                Collected contact data is used solely to respond to your specific chit fund inquiries, provide schedule details, verify eligibility, and facilitate enrollment coordination. We do not sell, trade, or share your contact details with external third-party marketing companies.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">3. Security & Access</h4>
              <p>
                We maintain appropriate administrative and physical security measures at our office premises to safeguard your subscriber records and documentation.
              </p>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base">4. Contact Inquiries</h4>
              <p>
                For any privacy questions or data modification requests, you can contact our office at ELITE TURF, Ajandha Garden, Kuttaiyur, Mettupalayam – 641104 or call +91 7338736352.
              </p>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-slate-100 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#C5A028] text-[#001A33] font-bold text-xs sm:text-sm uppercase hover:bg-[#b59020] transition-colors cursor-pointer shadow-xs"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

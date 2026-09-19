import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  Check, 
  Loader2,
  Building2,
  ExternalLink
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';
import { submitEnquiry, DirectWhatsAppUrls } from '../services/enquiryService';
import { BrandLogo } from './BrandLogo';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

const CHIT_PLAN_OPTIONS = [
  { label: '₹50,000 Plan (₹2,500/month • 21 Months)', value: '₹50,000', amount: '₹50,000' },
  { label: '₹1,00,000 Plan (₹5,000/month • 21 Months)', value: '₹1,00,000', amount: '₹1,00,000' },
  { label: '₹2,00,000 Plan (₹10,000/month • 21 Months)', value: '₹2,00,000', amount: '₹2,00,000' },
  { label: '₹3,00,000 Plan (₹12,000-₹15,000/month • 21 Months)', value: '₹3,00,000', amount: '₹3,00,000' },
  { label: '₹4,00,000 Plan (₹15,000/month • 21 Months)', value: '₹4,00,000', amount: '₹4,00,000' },
  { label: '₹5,00,000 Plan (₹25,000/month • 21 Months)', value: '₹5,00,000', amount: '₹5,00,000' },
  { label: 'Custom / Other Chit Value', value: 'Custom', amount: 'Custom' },
];

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialPlan = '₹1,00,000',
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [interestedPlan, setInterestedPlan] = useState('₹1,00,000 Plan (₹5,000/month • 21 Months)');
  const [preferredChitValue, setPreferredChitValue] = useState('₹1,00,000');
  const [customValue, setCustomValue] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [directUrls, setDirectUrls] = useState<DirectWhatsAppUrls | null>(null);
  const [whatsappResult, setWhatsappResult] = useState<{
    number1: { number: string; name?: string; status: string; error?: string };
    number2: { number: string; name?: string; status: string; error?: string };
    provider?: string;
    autoOpenClient?: boolean;
  } | null>(null);

  useEffect(() => {
    if (initialPlan) {
      const match = CHIT_PLAN_OPTIONS.find(p => p.amount === initialPlan || p.label.includes(initialPlan));
      if (match) {
        setInterestedPlan(match.label);
        setPreferredChitValue(match.amount);
      } else {
        setInterestedPlan(initialPlan);
        setPreferredChitValue(initialPlan);
      }
    }
  }, [initialPlan]);

  if (!isOpen) return null;

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setInterestedPlan(selected);
    const opt = CHIT_PLAN_OPTIONS.find(o => o.label === selected);
    if (opt && opt.value !== 'Custom') {
      setPreferredChitValue(opt.amount);
    } else {
      setPreferredChitValue(customValue || 'Custom');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanDigits = mobileNumber.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const finalChitValue = interestedPlan.includes('Custom') ? (customValue || 'Custom') : preferredChitValue;

    setIsSubmitting(true);
    try {
      const result = await submitEnquiry({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        interestedPlan: interestedPlan.trim(),
        preferredChitValue: finalChitValue.trim(),
        preferredContactMethod: 'WhatsApp',
        message: message.trim(),
      });

      setIsSubmitting(false);
      if (result.success) {
        setSubmitted(true);
        if (result.directWhatsAppUrls) {
          setDirectUrls(result.directWhatsAppUrls);
        }
        if (result.whatsappDispatch) {
          setWhatsappResult(result.whatsappDispatch);
        }

        // If automated gateway wasn't active or autoOpenClient is enabled, launch WhatsApp for instant delivery
        if (result.directWhatsAppUrls?.line1 && result.whatsappDispatch?.number1.status !== 'delivered') {
          try {
            window.open(result.directWhatsAppUrls.line1, '_blank');
          } catch {
            // Popup blocker may prevent automatic window open
          }
        }
      } else {
        setErrorMessage(result.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Network error occurred. Please check your connection.');
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setMobileNumber('');
    setMessage('');
    setErrorMessage('');
    setDirectUrls(null);
    setWhatsappResult(null);
    onClose();
  };

  const handleNotifyBoth = () => {
    if (!directUrls) return;
    window.open(directUrls.line1, '_blank');
    setTimeout(() => {
      window.open(directUrls.line2, '_blank');
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      id="enquiry-modal-backdrop"
    >
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="enquiry-modal-card"
      >
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#C5A028] to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
          aria-label="Close modal"
          id="enquiry-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="py-4 sm:py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                Enquiry Registered Successfully
              </div>
              <h3 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Thank You!
              </h3>
              <p className="text-sm sm:text-base text-emerald-700 font-semibold max-w-md mx-auto leading-relaxed">
                Thank you for your enquiry! Our team will contact you shortly.
              </p>
            </div>

            {/* Direct Dual WhatsApp Notification Action Box */}
            {directUrls && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Direct WhatsApp Notification
                  </span>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    {whatsappResult?.number1?.status === 'delivered' ? 'Gateway Sent' : '1-Click Send'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                  Tap below to immediately send this enquiry to our business WhatsApp numbers:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={directUrls.line1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                    id="enquiry-notify-line1-btn"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send to +91 7338736352</span>
                  </a>
                  <a
                    href={directUrls.line2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                    id="enquiry-notify-line2-btn"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send to +91 9345836032</span>
                  </a>
                </div>

                <button
                  onClick={handleNotifyBoth}
                  className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-800 hover:text-emerald-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  id="enquiry-notify-both-btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                  <span>Notify BOTH Business Numbers in 1 Click</span>
                </button>
              </div>
            )}

            {/* Dual WhatsApp Status Details */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-[#C5A028]" />
                  Database Record Stored
                </span>
                <span className="text-xs text-emerald-700 font-bold font-mono">
                  Saved Securely
                </span>
              </div>
              
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Primary Business Line (+91 7338736352):</span>
                  <span className={whatsappResult?.number1?.status === 'delivered' ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-emerald-700 font-semibold flex items-center gap-1'}>
                    {whatsappResult?.number1?.status === 'delivered' ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-600" /> Sent via Gateway</>
                    ) : (
                      <><Check className="w-3.5 h-3.5 text-emerald-600" /> Ready for WhatsApp</>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Secondary Business Line (+91 9345836032):</span>
                  <span className={whatsappResult?.number2?.status === 'delivered' ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-emerald-700 font-semibold flex items-center gap-1'}>
                    {whatsappResult?.number2?.status === 'delivered' ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-600" /> Sent via Gateway</>
                    ) : (
                      <><Check className="w-3.5 h-3.5 text-emerald-600" /> Ready for WhatsApp</>
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#C5A028]" />
                <span>ELITE GROUP – SS CHIT FUNDS (Managed by ELITE TURF)</span>
              </div>
            </div>

            <div className="pt-2 max-w-xs mx-auto">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
                id="enquiry-success-done-btn"
              >
                Done / Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div>
            {/* Header */}
            <div className="mb-5 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                  Instant Plan Information
                </div>
                <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Enquire About Chit Plans
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Submit your details below to receive complete plan catalog & enrollment options.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="chit-enquiry-form">
              {/* Full Name */}
              <div>
                <label htmlFor="enquiry-fullname-input" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#b48616]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors shadow-xs"
                  id="enquiry-fullname-input"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="enquiry-mobile-input" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (WhatsApp) <span className="text-[#b48616]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors shadow-xs"
                    id="enquiry-mobile-input"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#C5A028]" />
                  We will contact you directly on this number.
                </p>
              </div>

              {/* Chit Plan Selection */}
              <div>
                <label htmlFor="enquiry-plan-select" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chit Plan Interested In
                </label>
                <select
                  value={interestedPlan}
                  onChange={handlePlanChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors cursor-pointer shadow-xs"
                  id="enquiry-plan-select"
                >
                  {CHIT_PLAN_OPTIONS.map((plan, idx) => (
                    <option key={idx} value={plan.label}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Chit Value (or custom input if Custom is selected) */}
              {interestedPlan.includes('Custom') ? (
                <div>
                  <label htmlFor="enquiry-custom-value-input" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Chit Value (Custom Amount)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹10,00,000 or ₹50,000"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors shadow-xs"
                    id="enquiry-custom-value-input"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="enquiry-chit-value-input" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Chit Value
                  </label>
                  <input
                    type="text"
                    value={preferredChitValue}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold cursor-not-allowed shadow-xs"
                    id="enquiry-chit-value-input"
                  />
                </div>
              )}

              {/* Message / Enquiry */}
              <div>
                <label htmlFor="enquiry-message-input" className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Enquiry <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. When is the next auction date? Can I join from Kuttaiyur / Mettupalayam?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm transition-colors resize-none shadow-xs"
                  id="enquiry-message-input"
                />
              </div>

              {/* Notification Notice */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Dual Business Alert:</span> Submitting sends your enquiry to both official business numbers (+91 7338736352 & +91 9345836032) independently.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-sm uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="enquiry-modal-submit-btn"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#001A33]" />
                    <span>Processing Enquiry...</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT ENQUIRY</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

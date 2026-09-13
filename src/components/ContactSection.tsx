import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Building2, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  ExternalLink
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';
import { EnquiryFormData } from '../types';
import { submitEnquiry, DirectWhatsAppUrls } from '../services/enquiryService';

interface ContactSectionProps {
  initialPlan?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialPlan = '' }) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    interestedPlan: initialPlan || '₹1,00,000 (₹5,000 × 21)',
    preferredChitValue: initialPlan || '₹1,00,000',
    preferredContactMethod: 'WhatsApp',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [directUrls, setDirectUrls] = useState<DirectWhatsAppUrls | null>(null);
  const [whatsappLogs, setWhatsappLogs] = useState<{
    number1: { number: string; status: string };
    number2: { number: string; status: string };
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const chitVal = val.split(' ')[0] || val;
    setFormData(prev => ({
      ...prev,
      interestedPlan: val,
      preferredChitValue: chitVal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = formData.mobileNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitEnquiry({
        ...formData,
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        interestedPlan: formData.interestedPlan || formData.preferredChitValue,
        preferredChitValue: formData.preferredChitValue || formData.interestedPlan,
      });

      setIsSubmitting(false);
      if (res.success) {
        setSubmitted(true);
        if (res.directWhatsAppUrls) {
          setDirectUrls(res.directWhatsAppUrls);
        }
        if (res.whatsappDispatch) {
          setWhatsappLogs(res.whatsappDispatch);
        }
      } else {
        setErrorMsg(res.error || 'Could not submit enquiry. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(
    formData.fullName 
      ? `Hello ELITE GROUP SS CHIT FUNDS, My name is ${formData.fullName}. I would like to know more about the ${formData.preferredChitValue} chit plan.`
      : COMPANY_DETAILS.whatsappDefaultMsg
  )}`;

  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
            Official Assistance & Inquiries
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            Contact ELITE GROUP
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            Reach out to our team for plan details, current group enrollment, or visit our office at Mettupalayam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Official Contact Cards & Office Details */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Contact Card */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#001226] border border-slate-800 hover:border-[#C5A028]/50 transition-all shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center text-[#C5A028]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Direct Phone Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">Available Mon – Sat, 9:00 AM – 7:30 PM</p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#001A33] border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Primary Line</div>
                    <a href={`tel:${COMPANY_DETAILS.phone1Clean}`} className="text-white hover:text-[#C5A028] font-bold text-sm sm:text-base">
                      {COMPANY_DETAILS.phone1}
                    </a>
                  </div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone1Clean}`}
                    className="px-2.5 py-1 rounded bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#001A33] border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Secondary Line</div>
                    <a href={`tel:${COMPANY_DETAILS.phone2Clean}`} className="text-white hover:text-[#C5A028] font-bold text-sm sm:text-base">
                      {COMPANY_DETAILS.phone2}
                    </a>
                  </div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone2Clean}`}
                    className="px-2.5 py-1 rounded bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>

            {/* Office Address & Google Maps Integration Card */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#001226] border border-slate-800 hover:border-[#C5A028]/50 transition-all shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center text-[#C5A028]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      Office Headquarters
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">Direct In-Person Consultation</p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=ELITE+TURF,+Ajandha+Garden,+Kuttaiyur,+Mettupalayam+-+641104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow cursor-pointer"
                  id="view-google-maps-btn-header"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Exact Address Details */}
              <div className="p-3 rounded bg-[#001A33] border border-slate-800 text-xs sm:text-sm space-y-1.5">
                <div className="font-bold text-white leading-relaxed flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A028] shrink-0 mt-0.5" />
                  <span>{COMPANY_DETAILS.officeAddress}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#C5A028] flex items-center gap-1.5 pt-1 pl-5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Managed by {COMPANY_DETAILS.managedBy}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span>CIN: {COMPANY_DETAILS.cin}</span>
                  <span className="text-slate-400 font-sans">Kuttaiyur, Mettupalayam</span>
                </div>
              </div>

              {/* Interactive Google Maps Preview */}
              <div className="relative rounded-lg overflow-hidden border border-slate-800 hover:border-[#C5A028]/40 transition-colors bg-[#001A33] shadow-inner">
                {/* Gold Pin Badge in top corner */}
                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#001226]/90 backdrop-blur-md border border-[#C5A028]/60 text-[#C5A028] text-xs font-bold shadow-lg">
                    <MapPin className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>ELITE TURF • Kuttaiyur</span>
                  </div>
                </div>

                <iframe
                  title="ELITE GROUP Office Location - Google Maps"
                  src="https://maps.google.com/maps?q=ELITE+TURF,+Ajandha+Garden,+Kuttaiyur,+Mettupalayam+641104&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-48 sm:h-56 border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  id="office-google-maps-preview"
                />
              </div>

              {/* Full Width "View on Google Maps" Action Button */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=ELITE+TURF,+Ajandha+Garden,+Kuttaiyur,+Mettupalayam+-+641104"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-md bg-[#00264d] hover:bg-[#C5A028] text-[#C5A028] hover:text-[#001A33] border border-[#C5A028]/50 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md group"
                id="view-google-maps-btn"
              >
                <MapPin className="w-4 h-4 text-[#C5A028] group-hover:text-[#001A33] transition-colors" />
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick WhatsApp Support Card */}
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">Fast Response</div>
                <div className="text-white text-xs sm:text-sm font-semibold">Chat on WhatsApp Instantly</div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm uppercase flex items-center gap-1.5 shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open Chat</span>
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-lg bg-[#001226] border border-[#C5A028]/40 p-5 sm:p-7 shadow-2xl relative">
              
              <div className="mb-5 pb-3 border-b border-slate-800">
                <h3 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-white">
                  Send Your Plan Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Our official team will automatically receive your request on both business lines.
                </p>
              </div>

              {submitted ? (
                <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-['Cinzel'] text-xl font-bold text-white">
                      Enquiry Registered
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-300 font-medium max-w-md mx-auto leading-relaxed">
                      Thank you for your enquiry! Our team will contact you shortly.
                    </p>
                  </div>

                  {/* Direct Dual WhatsApp Notification Actions */}
                  {directUrls && (
                    <div className="p-4 rounded-xl bg-[#001A33] border border-emerald-500/40 text-left max-w-md mx-auto space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          Send Instant WhatsApp Notification
                        </span>
                        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          1-Click Send
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Click below to deliver this enquiry directly to our business lines on WhatsApp:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={directUrls.line1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Line 1 (+91 7338736352)</span>
                        </a>
                        <a
                          href={directUrls.line2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Line 2 (+91 9345836032)</span>
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          window.open(directUrls.line1, '_blank');
                          setTimeout(() => window.open(directUrls.line2, '_blank'), 600);
                        }}
                        className="w-full py-2 rounded-lg bg-[#001226] hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
                        <span>Send to BOTH WhatsApp Numbers</span>
                      </button>
                    </div>
                  )}

                  {/* Dual WhatsApp Dispatch Status */}
                  <div className="p-3.5 rounded-lg bg-[#001A33] border border-slate-800 text-xs sm:text-sm text-left max-w-md mx-auto space-y-1.5">
                    <div className="text-xs sm:text-sm font-bold text-[#C5A028] uppercase flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Database Record Stored
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                      <span>Primary Line (+91 7338736352):</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Registered & Ready
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
                      <span>Secondary Line (+91 9345836032):</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Registered & Ready
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setDirectUrls(null);
                        setFormData({
                          fullName: '',
                          mobileNumber: '',
                          emailAddress: '',
                          interestedPlan: '₹1,00,000 (₹5,000 × 21)',
                          preferredChitValue: '₹1,00,000',
                          preferredContactMethod: 'WhatsApp',
                          message: '',
                        });
                      }}
                      className="px-5 py-2.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5" id="enquiry-form">
                  
                  {errorMsg && (
                    <div className="p-2.5 rounded-md bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-fullName">
                      Full Name <span className="text-[#C5A028]">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="e.g. R. Senthil Kumar"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028] text-sm sm:text-base"
                    />
                  </div>

                  {/* Mobile Number & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-mobileNumber">
                        Mobile Number <span className="text-[#C5A028]">*</span>
                      </label>
                      <input
                        id="field-mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-md bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028] text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-emailAddress">
                        Email Address (Optional)
                      </label>
                      <input
                        id="field-emailAddress"
                        name="emailAddress"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-md bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028] text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Preferred Chit Value Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-preferredChitValue">
                        Chit Plan Interested In
                      </label>
                      <select
                        id="field-preferredChitValue"
                        value={formData.interestedPlan}
                        onChange={handlePlanChange}
                        className="w-full px-3 py-2.5 rounded-md bg-[#001A33] border border-slate-700 text-white focus:outline-none focus:border-[#C5A028] text-sm sm:text-base cursor-pointer"
                      >
                        <option value="₹50,000 (₹2,500 × 21)">₹50,000 (₹2,500 × 21)</option>
                        <option value="₹1,00,000 (₹5,000 × 21)">₹1,00,000 (₹5,000 × 21)</option>
                        <option value="₹2,00,000 (₹10,000 × 21)">₹2,00,000 (₹10,000 × 21)</option>
                        <option value="₹3,00,000 (21 Installments)">₹3,00,000 (21 Installments)</option>
                        <option value="₹4,00,000 (₹15,000 × 21)">₹4,00,000 (₹15,000 × 21)</option>
                        <option value="₹5,00,000 (₹25,000 × 21)">₹5,00,000 (₹25,000 × 21)</option>
                        <option value="Custom Chit Plan">Custom Chit Plan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-preferredContactMethod">
                        Preferred Contact Method
                      </label>
                      <select
                        id="field-preferredContactMethod"
                        name="preferredContactMethod"
                        value={formData.preferredContactMethod}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-md bg-[#001A33] border border-slate-700 text-white focus:outline-none focus:border-[#C5A028] text-sm sm:text-base cursor-pointer"
                      >
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="Phone">Phone Call</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-1" htmlFor="field-message">
                      Message / Enquiry (Optional)
                    </label>
                    <textarea
                      id="field-message"
                      name="message"
                      rows={3}
                      placeholder="Ask any question about start dates, documentation, or contribution schedule..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028] text-sm sm:text-base resize-none"
                    />
                  </div>

                  {/* Automated Dual Notification Note */}
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A028]" />
                    <span>Auto-dispatches notification to both official lines (+91 7338736352 & +91 9345836032).</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="enquiry-submit-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#001A33]" />
                        <span>Sending Dual Notification...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SUBMIT ENQUIRY</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MapPin, 
  Building2, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
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
  const { t } = useTranslation();
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
    <section className="py-12 md:py-16 bg-[#FDFBF7] relative border-t border-amber-200/80" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A028]" />
            {t('contact.badge')}
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001A33] tracking-tight mb-2.5">
            {t('contact.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Official Contact Cards & Office Details */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Contact Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-amber-200/80 hover:border-[#C5A028] transition-all shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#001A33]/5 border border-[#001A33]/10 flex items-center justify-center text-[#001A33]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
                    {t('contact.directPhoneSupport')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">{t('contact.availableHours')}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">{t('contact.primaryLine')}</div>
                    <a href={`tel:${COMPANY_DETAILS.phone1Clean}`} className="text-slate-900 hover:text-[#001A33] font-bold text-sm sm:text-base">
                      {COMPANY_DETAILS.phone1}
                    </a>
                  </div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone1Clean}`}
                    className="px-3 py-1.5 rounded-md bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs uppercase tracking-wider shadow-xs"
                  >
                    {t('contact.callBtn')}
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">{t('contact.secondaryLine')}</div>
                    <a href={`tel:${COMPANY_DETAILS.phone2Clean}`} className="text-slate-900 hover:text-[#001A33] font-bold text-sm sm:text-base">
                      {COMPANY_DETAILS.phone2}
                    </a>
                  </div>
                  <a
                    href={`tel:${COMPANY_DETAILS.phone2Clean}`}
                    className="px-3 py-1.5 rounded-md bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs uppercase tracking-wider shadow-xs"
                  >
                    {t('contact.callBtn')}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Address & Google Maps Integration Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-amber-200/80 hover:border-[#C5A028] transition-all shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#001A33]/5 border border-[#001A33]/10 flex items-center justify-center text-[#001A33]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
                      {t('contact.officeHeadquarters')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">{t('contact.inPersonConsultation')}</p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=ELITE+TURF,+Ajandha+Garden,+Kuttaiyur,+Mettupalayam+-+641104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  id="view-google-maps-btn-header"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('contact.viewOnMaps')}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Exact Address Details */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="font-bold text-slate-900 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A028] shrink-0 mt-0.5" />
                  <span>{COMPANY_DETAILS.officeAddress}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#b48616] font-semibold flex items-center gap-1.5 pt-1 pl-6">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Managed by {COMPANY_DETAILS.managedBy}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span>CIN: {COMPANY_DETAILS.cin}</span>
                  <span className="text-slate-500 font-sans">Kuttaiyur, Mettupalayam</span>
                </div>
              </div>

              {/* Interactive Google Maps Preview */}
              <div className="relative rounded-lg overflow-hidden border border-slate-200 hover:border-[#C5A028]/60 transition-colors bg-slate-100 shadow-inner">
                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold shadow-md">
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
                className="w-full py-3 px-4 rounded-lg bg-slate-100 hover:bg-[#C5A028] text-slate-800 hover:text-[#001A33] border border-slate-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
                id="view-google-maps-btn"
              >
                <MapPin className="w-4 h-4 text-[#C5A028] group-hover:text-[#001A33] transition-colors" />
                <span>{t('contact.viewOnMaps')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick WhatsApp Support Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider">{t('contact.fastResponse')}</div>
                <div className="text-slate-900 text-xs sm:text-sm font-semibold">{t('contact.chatWhatsAppInstantly')}</div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('contact.openChat')}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-white border border-amber-200/80 p-5 sm:p-7 shadow-lg relative">
              
              <div className="mb-5 pb-3.5 border-b border-slate-100">
                <h3 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-slate-900">
                  {t('contact.sendPlanEnquiry')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {t('contact.receiveBothLines')}
                </p>
              </div>

              {submitted ? (
                <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-['Cinzel'] text-xl font-bold text-slate-900">
                      {t('contact.enquiryRegistered')}
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 font-medium max-w-md mx-auto leading-relaxed">
                      {t('contact.thankYouRegister')}
                    </p>
                  </div>

                  {/* Direct Dual WhatsApp Notification Actions */}
                  {directUrls && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          {t('contact.sendInstantNotification')}
                        </span>
                        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                          {t('contact.oneClickSend')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {t('contact.clickBelowNotify')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={directUrls.line1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Line 1 ({COMPANY_DETAILS.phone1})</span>
                        </a>
                        <a
                          href={directUrls.line2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Line 2 ({COMPANY_DETAILS.phone2})</span>
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          window.open(directUrls.line1, '_blank');
                          setTimeout(() => window.open(directUrls.line2, '_blank'), 600);
                        }}
                        className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-800 hover:text-emerald-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-4 h-4 text-[#C5A028]" />
                        <span>{t('contact.sendBothWhatsApp')}</span>
                      </button>
                    </div>
                  )}

                  {/* Dual WhatsApp Dispatch Status */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-left max-w-md mx-auto space-y-2">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 uppercase flex items-center gap-1.5 pb-1.5 border-b border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-[#C5A028]" />
                      Database Record Stored
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                      <span>Primary Line ({COMPANY_DETAILS.phone1}):</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Registered & Ready
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
                      <span>Secondary Line ({COMPANY_DETAILS.phone2}):</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Registered & Ready
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
                      className="px-6 py-2.5 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs hover:shadow-md"
                    >
                      {t('contact.sendAnotherBtn')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="enquiry-form">
                  
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-fullName">
                      {t('contact.fullName')} <span className="text-[#b48616]">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder={t('contact.fullNamePlaceholder')}
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base shadow-xs"
                    />
                  </div>

                  {/* Mobile Number & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-mobileNumber">
                        {t('contact.mobileNumber')} <span className="text-[#b48616]">*</span>
                      </label>
                      <input
                        id="field-mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        required
                        placeholder={t('contact.mobilePlaceholder')}
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-emailAddress">
                        {t('contact.email')}
                      </label>
                      <input
                        id="field-emailAddress"
                        name="emailAddress"
                        type="email"
                        placeholder={t('contact.emailPlaceholder')}
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Preferred Chit Value Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-preferredChitValue">
                        {t('contact.interestedPlan')}
                      </label>
                      <select
                        id="field-preferredChitValue"
                        value={formData.interestedPlan}
                        onChange={handlePlanChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base cursor-pointer shadow-xs"
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
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-preferredContactMethod">
                        {t('contact.preferredContact')}
                      </label>
                      <select
                        id="field-preferredContactMethod"
                        name="preferredContactMethod"
                        value={formData.preferredContactMethod}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base cursor-pointer shadow-xs"
                      >
                        <option value="WhatsApp">{t('contact.contactWhatsApp')}</option>
                        <option value="Phone">{t('contact.contactPhone')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="field-message">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="field-message"
                      name="message"
                      rows={3}
                      placeholder={t('contact.messagePlaceholder')}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C5A028] focus:ring-1 focus:ring-[#C5A028] text-sm sm:text-base resize-none shadow-xs"
                    />
                  </div>

                  {/* Automated Dual Notification Note */}
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A028]" />
                    <span>Auto-dispatches notification to both official lines ({COMPANY_DETAILS.phone1} & {COMPANY_DETAILS.phone2}).</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="enquiry-submit-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#001A33]" />
                        <span>{t('contact.submitting')}</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('contact.submitBtn')}</span>
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

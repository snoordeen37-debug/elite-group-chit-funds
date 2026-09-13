import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { FAQS, COMPANY_DETAILS } from '../data/chitPlansData';

interface FaqSectionProps {
  onOpenEnquiry: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenEnquiry }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappDefaultMsg)}`;

  return (
    <section className="py-12 md:py-16 bg-white relative border-t border-slate-200" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A028]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001A33] tracking-tight mb-2.5">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            Essential information regarding chit fund mechanics, documentation, contribution schedules, and auction procedures.
          </p>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="space-y-2.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl transition-all border ${
                  isOpen
                    ? 'bg-slate-50/80 border-[#C5A028] shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
                id={`faq-item-${index + 1}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-3.5 px-4 sm:px-5 flex items-center justify-between text-left focus:outline-none rounded-xl cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-['Cinzel'] font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2.5">
                    <span className="text-[#b48616] font-mono text-xs sm:text-sm font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className={`p-1.5 rounded-lg transition-transform duration-150 shrink-0 ml-3 ${
                    isOpen ? 'rotate-180 bg-[#001A33] text-[#C5A028]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-200/70 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-8 p-5 sm:p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900">Still have more specific questions?</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Contact our team directly on WhatsApp or call us during business hours.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              id="faq-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={onOpenEnquiry}
              className="px-5 py-2.5 rounded-lg bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer"
              id="faq-enquire-btn"
            >
              Send Enquiry
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

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
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A028]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Essential information regarding chit fund mechanics, documentation, contribution schedules, and auction procedures.
          </p>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-lg transition-all border ${
                  isOpen
                    ? 'bg-[#001226] border-[#C5A028]/50 shadow-md'
                    : 'bg-[#001226] border-slate-800 hover:border-slate-700'
                }`}
                id={`faq-item-${index + 1}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-3 px-4 sm:px-5 flex items-center justify-between text-left focus:outline-none rounded-lg cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-['Cinzel'] font-bold text-xs sm:text-sm text-white flex items-center gap-2.5">
                    <span className="text-[#C5A028] font-mono text-xs font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className={`p-1 rounded-md bg-[#00264d] text-[#C5A028] transition-transform duration-150 shrink-0 ml-3 ${
                    isOpen ? 'rotate-180 bg-[#C5A028] text-[#001A33]' : ''
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-3.5 pt-1 text-slate-300 text-xs leading-relaxed border-t border-slate-800 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-8 p-4 sm:p-5 rounded-lg bg-[#001226] border border-[#C5A028]/35 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">Still have more specific questions?</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Contact our team directly on WhatsApp or call us during business hours.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              id="faq-whatsapp-btn"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={onOpenEnquiry}
              className="px-3.5 py-1.5 rounded-md bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
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

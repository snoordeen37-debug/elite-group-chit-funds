import React, { useState } from 'react';
import { MessageCircle, Sparkles, X, PhoneCall } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';

interface WhatsAppFloatingButtonProps {
  onOpenEnquiry?: (plan?: string) => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ onOpenEnquiry }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappDefaultMsg)}`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE STICKY BOTTOM DOCK (Ultra Prominent for Mobile Viewports < 640px) */}
      {/* ========================================================================= */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.14)] px-3 py-2.5 flex items-center gap-2 sm:hidden"
        id="mobile-sticky-lead-bar"
      >
        {/* Mobile Enquire Now Button */}
        <button
          type="button"
          onClick={() => onOpenEnquiry?.()}
          className="flex-1 py-3 px-3 rounded-xl bg-[#C5A028] hover:bg-[#b59020] active:scale-[0.98] text-[#001A33] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#C5A028]/25 transition-all cursor-pointer border border-[#e0b83e]"
          id="mobile-sticky-enquire-btn"
        >
          <Sparkles className="w-4 h-4 text-[#001A33] shrink-0 fill-current" />
          <span>Enquire Now</span>
        </button>

        {/* Mobile Direct WhatsApp Chat Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all border border-emerald-400/40"
          id="mobile-sticky-whatsapp-btn"
          aria-label="Chat with ELITE GROUP SS CHIT FUNDS on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
          <span>WhatsApp Chat</span>
        </a>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP / TABLET FLOATING DUAL-ACTION STACK (Screens >= 640px)          */}
      {/* ========================================================================= */}
      <div
        className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2.5"
        id="desktop-floating-actions"
      >
        {/* Friendly Tooltip Bubble */}
        {showTooltip && (
          <div className="relative bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xl max-w-[240px] flex items-start justify-between gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="leading-snug">
              <span className="font-bold text-slate-900 block text-xs">Need Chit Plan Advice?</span>
              <span className="text-[11px] text-slate-600">Quick answers on WhatsApp or request a callback!</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Desktop Enquire Now Floating Pill */}
        {onOpenEnquiry && (
          <button
            type="button"
            onClick={() => onOpenEnquiry()}
            className="group flex items-center gap-2 px-4 py-2.5 bg-[#C5A028] hover:bg-[#b59020] text-[#001A33] rounded-full shadow-lg border border-[#f0c842] font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-[#C5A028]/20"
            id="floating-enquire-btn"
          >
            <Sparkles className="w-4 h-4 text-[#001A33] shrink-0 fill-current" />
            <span className="font-sans">Enquire Now</span>
          </button>
        )}

        {/* Desktop WhatsApp Floating Action Pill */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg border border-emerald-400/40 font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 shadow-emerald-600/25"
          aria-label="Chat with ELITE GROUP SS CHIT FUNDS on WhatsApp"
          id="floating-whatsapp-btn"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
          <span className="font-sans">WhatsApp Chat</span>
        </a>
      </div>
    </>
  );
};

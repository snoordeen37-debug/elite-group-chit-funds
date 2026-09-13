import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/chitPlansData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappDefaultMsg)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2" id="whatsapp-floating-container">
      {/* Friendly Tooltip Bubble */}
      {showTooltip && (
        <div className="relative bg-white text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xl max-w-[220px] flex items-start justify-between gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="leading-snug">
            <span className="font-bold text-emerald-600 block text-xs sm:text-sm">Chat With Us</span>
            <span className="text-xs text-slate-600">Quick answers about chit plans on WhatsApp</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border border-emerald-400/40 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150"
        aria-label="Chat with ELITE GROUP SS CHIT FUNDS on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-4 h-4 text-white shrink-0 fill-current" />
        <span className="hidden sm:inline font-sans">WhatsApp Chat</span>
      </a>
    </div>
  );
};

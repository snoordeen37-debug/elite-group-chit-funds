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
        <div className="relative bg-[#001226] text-white text-xs px-3 py-2 rounded-lg border border-emerald-500/40 shadow-xl max-w-[210px] flex items-start justify-between gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="leading-snug">
            <span className="font-bold text-emerald-400 block text-xs">Chat With Us</span>
            <span className="text-[10px] text-slate-300">Quick answers about chit plans on WhatsApp</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#001A33] rounded-md shadow-lg border border-emerald-300/40 font-bold text-xs uppercase tracking-wider transition-all duration-150"
        aria-label="Chat with ELITE GROUP SS CHIT FUNDS on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-4 h-4 text-[#001A33] shrink-0 fill-current" />
        <span className="hidden sm:inline font-sans">WhatsApp Chat</span>
      </a>
    </div>
  );
};

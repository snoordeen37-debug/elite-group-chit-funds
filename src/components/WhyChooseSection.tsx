import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  Sliders, 
  Headphones, 
  FileText, 
  Users,
  Sparkles
} from 'lucide-react';
import { WHY_CHOOSE_ITEMS } from '../data/chitPlansData';

export const WhyChooseSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#C5A028]" />;
      case 'Eye': return <Eye className="w-5 h-5 text-[#C5A028]" />;
      case 'Lock': return <Lock className="w-5 h-5 text-[#C5A028]" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-[#C5A028]" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-[#C5A028]" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#C5A028]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#C5A028]" />;
      default: return <Sparkles className="w-5 h-5 text-[#C5A028]" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-[#001A33] relative border-t border-slate-800" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001226] border border-[#C5A028]/40 text-[#C5A028] text-xs font-semibold uppercase tracking-wider mb-2.5">
            Core Principles & Advantages
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            WHY CHOOSE ELITE GROUP?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Built upon principles of systematic financial discipline, open communication, and long-term customer relationships.
          </p>
        </div>

        {/* 7 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const isFeatured = index === 0;
            return (
              <div
                key={item.title}
                className={`rounded-lg p-4 flex flex-col justify-between transition-all group border ${
                  isFeatured 
                    ? 'bg-[#001226] border-[#C5A028]/60 shadow-lg' 
                    : 'bg-[#001226] border-slate-800 hover:border-[#C5A028]/50 hover:bg-[#001c3d]'
                }`}
                id={`benefit-card-${index + 1}`}
              >
                <div>
                  {/* Icon Box */}
                  <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/40 flex items-center justify-center mb-3">
                    {getIcon(item.iconName)}
                  </div>

                  <h3 className="font-['Cinzel'] text-sm font-bold text-white group-hover:text-[#C5A028] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Standard of Service</span>
                  <span className="text-[#C5A028] font-bold">0{index + 1}</span>
                </div>
              </div>
            );
          })}

          {/* Quick Contact Highlight Card */}
          <div className="rounded-lg p-4 bg-[#001226] border border-[#C5A028]/50 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-9 h-9 rounded-md bg-[#00264d] border border-[#C5A028]/60 flex items-center justify-center mb-3 text-[#C5A028]">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-['Cinzel'] text-sm font-bold text-white mb-2">
                PERSONALIZED ASSISTANCE
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our dedicated coordinators in Mettupalayam for plan guidance and enrollment support.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-800 text-xs font-bold text-[#C5A028]">
              +91 7338736352 / +91 9345836032
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

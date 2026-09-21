import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { WHY_CHOOSE_ITEMS, COMPANY_DETAILS } from '../data/chitPlansData';

export const WhyChooseSection: React.FC = () => {
  const { t } = useTranslation();

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
    <section className="py-12 md:py-16 bg-[#FBF8F1] relative border-t border-amber-200/80" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A33]/5 border border-[#001A33]/15 text-[#001A33] text-xs font-bold uppercase tracking-wider mb-3">
            {t('whyChoose.badge')}
          </div>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001A33] tracking-tight mb-2.5">
            {t('whyChoose.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('whyChoose.subtitle')}
          </p>
        </div>

        {/* 7 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {WHY_CHOOSE_ITEMS.map((item, index) => (
            <div
              key={index}
              className="rounded-xl p-5 flex flex-col justify-between transition-all group bg-white border border-amber-200/80 hover:border-[#C5A028] hover:shadow-md shadow-xs"
              id={`benefit-card-${index + 1}`}
            >
                <div>
                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-lg bg-[#001A33]/5 border border-[#001A33]/10 flex items-center justify-center mb-3.5">
                    {getIcon(item.iconName)}
                  </div>

                  <h3 className="font-['Cinzel'] text-base font-bold text-slate-900 group-hover:text-[#001A33] transition-colors mb-2">
                    {t('data.benefits.' + (index + 1) + '.title')}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t('data.benefits.' + (index + 1) + '.description')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{t('whyChoose.serviceStandard')}</span>
                  <span className="text-[#b48616] font-bold">0{index + 1}</span>
                </div>
              </div>
            ))}

          {/* Quick Contact Highlight Card */}
          <div className="rounded-xl p-5 bg-white border border-amber-200/80 hover:border-[#C5A028] flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#001A33]/5 border border-[#001A33]/10 flex items-center justify-center mb-3.5 text-[#001A33]">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-['Cinzel'] text-base font-bold text-slate-900 mb-2">
                {t('whyChoose.assistanceTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('whyChoose.assistanceDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 text-sm font-bold text-[#b48616]">
              {COMPANY_DETAILS.phone1} / {COMPANY_DETAILS.phone2}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

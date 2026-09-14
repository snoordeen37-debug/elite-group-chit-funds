import React from 'react';

// Hardcoded brand name constant - strictly locked to English (bypasses i18n translation)
export const BRAND_NAME = 'ELITE GROUP SS CHIT FUNDS';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showManagedBy?: boolean;
  showText?: boolean;
  className?: string;
  imgClassName?: string;
  managedByClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showManagedBy = false,
  showText = false,
  className = '',
  imgClassName = '',
  managedByClassName = 'text-slate-400',
}) => {
  // Height sizing for responsive display while keeping exact aspect ratio
  const sizeClasses = {
    sm: 'h-9 sm:h-11 max-w-[150px] sm:max-w-[180px]',
    md: 'h-10 sm:h-13 md:h-16 max-w-[160px] sm:max-w-[210px] md:max-w-[240px]',
    lg: 'h-16 sm:h-20 md:h-24 max-w-[260px] sm:max-w-[360px]',
    xl: 'h-24 sm:h-28 md:h-32 max-w-[340px] sm:max-w-[460px]',
  };

  return (
    <div 
      className={`inline-flex flex-col items-start select-none transition-transform duration-200 group ${className}`} 
      id="brand-logo-container"
    >
      {/* Official Brand Logo - Exact proportions, unmodified artwork */}
      <div className="relative flex items-center">
        <img
          src="/logo.png"
          alt="ELITE GROUP SS CHIT FUNDS - Trusted Chit Investment Plans"
          title={BRAND_NAME}
          className={`${sizeClasses[size]} w-auto object-contain transition-all duration-200 group-hover:scale-[1.02] ${imgClassName}`}
          style={{
            filter: 'drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.75)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
          }}
          loading="eager"
          decoding="async"
          width="1024"
          height="682"
        />
      </div>

      {/* Explicit Fixed English Brand Name Label (Bypasses i18n) */}
      {showText && (
        <span className="font-['Cinzel'] font-bold text-xs sm:text-sm text-slate-900 tracking-wider mt-1 select-none">
          {BRAND_NAME}
        </span>
      )}

      {/* Optional Managed by text - Fixed in English */}
      {showManagedBy && (
        <div className={`mt-1 pl-1 flex items-center gap-1.5 text-xs sm:text-sm font-medium tracking-wide ${managedByClassName}`}>
          <span>Managed by</span>
          <span className="text-[#C5A028] font-bold tracking-wider">ELITE TURF</span>
        </div>
      )}
    </div>
  );
};

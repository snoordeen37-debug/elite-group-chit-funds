import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showManagedBy?: boolean;
  className?: string;
  imgClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showManagedBy = false,
  className = '',
  imgClassName = '',
}) => {
  // Height sizing for responsive display while keeping exact aspect ratio
  const sizeClasses = {
    sm: 'h-11 sm:h-12 max-w-[180px]',
    md: 'h-14 sm:h-16 md:h-18 max-w-[240px]',
    lg: 'h-20 sm:h-24 md:h-28 max-w-[360px]',
    xl: 'h-28 sm:h-32 md:h-36 max-w-[460px]',
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

      {/* Optional Managed by text */}
      {showManagedBy && (
        <div className="mt-1 pl-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-medium tracking-wide">
          <span>Managed by</span>
          <span className="text-[#C5A028] font-bold tracking-wider">ELITE TURF</span>
        </div>
      )}
    </div>
  );
};

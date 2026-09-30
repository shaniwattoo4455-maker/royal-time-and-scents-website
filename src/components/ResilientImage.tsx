import React, { useState, useEffect } from 'react';
import { Watch, Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'watch' | 'perfume' | 'hero';
  title?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'watch',
  title,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#17171B] via-[#111114] to-[#1E1B14] text-[#D4AF37] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-3 bg-[#D4AF37]/5">
          {fallbackType === 'perfume' ? (
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <Watch className="w-5 h-5 text-[#D4AF37]" />
          )}
        </div>
        <span className="font-display text-base font-semibold text-[#F5F3EF] tracking-wide line-clamp-2">
          {title || alt}
        </span>
        <span className="text-[11px] text-[#9E9A90] mt-1">
          Royal Time &amp; Scents Studio Archive
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

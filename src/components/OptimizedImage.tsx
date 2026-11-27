import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { ImageSpec } from '../data/landscapingData';

interface OptimizedImageProps {
  image: ImageSpec;
  sizes: string;
  priority?: boolean;
  variant?: 'default' | 'thumbnail' | 'full';
  className?: string;
  wrapperClassName?: string;
  objectPosition?: string;
}

export function OptimizedImage({
  image,
  sizes,
  priority = false,
  variant = 'default',
  className = '',
  wrapperClassName = '',
  objectPosition = 'center center',
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false);

  const srcSet =
    variant === 'thumbnail'
      ? `/images/opt/${image.slug}-sm.webp 640w, /images/opt/${image.slug}-md.webp 1080w`
      : `/images/opt/${image.slug}-sm.webp 640w, /images/opt/${image.slug}-md.webp 1080w, /images/opt/${image.slug}-lg.webp 1600w`;

  const defaultSrc =
    variant === 'full'
      ? `/images/opt/${image.slug}-lg.webp`
      : variant === 'thumbnail'
      ? `/images/opt/${image.slug}-sm.webp`
      : `/images/opt/${image.slug}-md.webp`;

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE5] text-[#294D4A] p-6 text-center ${wrapperClassName}`}
        role="img"
        aria-label={image.alt}
      >
        <ImageIcon className="w-7 h-7 opacity-40 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium opacity-70 max-w-[24ch]">{image.alt}</span>
      </div>
    );
  }

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ objectPosition }}
      className={`block ${className}`}
    />
  );
}

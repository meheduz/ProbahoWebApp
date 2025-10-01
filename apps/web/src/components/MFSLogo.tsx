import Image from 'next/image';
import { MFSProvider } from '@/types';

interface MFSLogoProps {
  provider: MFSProvider;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MFSLogo = ({ provider, size = 'md', className = '' }: MFSLogoProps) => {
  const sizeClasses = {
    sm: 'w-[80px] h-8',
    md: 'w-[120px] h-10',
    lg: 'w-[160px] h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image 
        src={`/images/mfs/${provider}.svg`}
        alt={`${provider.toUpperCase()} Logo`}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default MFSLogo;
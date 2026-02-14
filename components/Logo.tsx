import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <div className={`bg-vibe-red rounded-xl flex items-center justify-center text-white ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        className="w-2/3 h-2/3"
        fill="currentColor" 
        stroke="none" 
      >
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
      </svg>
    </div>
  );
};

export default Logo;
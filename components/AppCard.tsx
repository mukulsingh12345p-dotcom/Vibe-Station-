import React, { useState } from 'react';
import { AppEntry } from '../types';
import { ExternalLink, Zap } from 'lucide-react';
import Logo from './Logo';

interface AppCardProps {
  app: AppEntry;
  index: number;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [imageError, setImageError] = useState(false);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return '';
    }
  };

  const faviconUrl = getFaviconUrl(app.url);

  return (
    <a 
        href={app.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group block bg-white rounded-[2rem] p-5 shadow-soft hover:shadow-lg transition-all active:scale-[0.98] border border-transparent hover:border-vibe-red/10"
    >
      <div className="flex items-center gap-4">
        
        {/* Logo Section */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-vibe-light flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
           {!imageError && faviconUrl ? (
             <img 
               src={faviconUrl} 
               alt={`${app.name} logo`} 
               className="w-8 h-8 object-contain"
               onError={() => setImageError(true)}
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-vibe-gray">
               <Zap size={20} />
             </div>
           )}
        </div>

        {/* Text Content */}
        <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-vibe-dark truncate pr-2 tracking-tight group-hover:text-vibe-red transition-colors">
                    {app.name}
                </h3>
                <ExternalLink size={16} className="text-vibe-gray/40 group-hover:text-vibe-red transition-colors" />
            </div>
            
            <p className="text-xs font-medium text-vibe-gray truncate mt-0.5">
                {app.description || 'Launch Application'}
            </p>
        </div>
      </div>
    </a>
  );
};

export default AppCard;
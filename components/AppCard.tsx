import React, { useState } from 'react';
import { AppEntry } from '../types';
import { ExternalLink, Zap, Bot } from 'lucide-react';

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
    <div className="group bg-white rounded-[2rem] p-5 shadow-soft hover:shadow-lg transition-all border border-transparent hover:border-vibe-red/10 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        
        {/* Logo Section - Clickable for Main URL */}
        <a 
            href={app.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-vibe-light flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
        >
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
        </a>

        {/* Text Content - Clickable for Main URL */}
        <a 
            href={app.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-grow min-w-0"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-vibe-dark truncate pr-2 tracking-tight group-hover:text-vibe-red transition-colors">
                    {app.name}
                </h3>
            </div>
            
            <p className="text-xs font-medium text-vibe-gray truncate mt-0.5">
                {app.description || 'Launch Application'}
            </p>
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-1">
          <a 
            href={app.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-gray-50 text-vibe-dark hover:bg-vibe-dark hover:text-white transition-colors rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider group/btn"
          >
             Open App
             <ExternalLink size={14} className="opacity-50 group-hover/btn:opacity-100" />
          </a>

          {app.aiStudioUrl && (
              <a 
                href={app.aiStudioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Open in AI Studio"
                className="w-12 bg-vibe-teal/10 text-vibe-teal hover:bg-vibe-teal hover:text-white transition-colors rounded-xl flex items-center justify-center"
              >
                 <Bot size={18} />
              </a>
          )}
      </div>
    </div>
  );
};

export default AppCard;
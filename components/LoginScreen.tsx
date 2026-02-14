import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = () => {
    setIsLoading(true);
    // Simulate initialization delay for effect
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#F8F9FB] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-vibe-red/5 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-vibe-red rounded-full flex items-center justify-center shadow-glow mb-6">
                <span className="text-white font-black text-2xl italic">V</span>
            </div>
            
            <h1 className="text-5xl font-black italic tracking-tighter text-vibe-dark mb-1">
                VIBE
            </h1>
            <h1 className="text-5xl font-black italic tracking-tighter text-vibe-red mb-6">
                STATION
            </h1>
            
            <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-vibe-teal rounded-full"></div>
                <span className="text-xs font-bold tracking-[0.3em] text-vibe-gray uppercase">Vibecoding Club Portal</span>
            </div>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-4">
            <button 
                onClick={handleEnter}
                disabled={isLoading}
                className="w-full bg-[#1F2125] text-white rounded-[1.5rem] py-5 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
                {isLoading ? 'Initializing...' : (
                    <>
                        Enter Portal <ArrowRight size={18} />
                    </>
                )}
            </button>
            
            <p className="text-center text-[10px] font-bold text-vibe-gray uppercase tracking-widest opacity-60">
                Secure Environment • Authorized Access Only
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;
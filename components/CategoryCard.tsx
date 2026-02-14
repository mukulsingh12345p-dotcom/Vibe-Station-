import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, LayoutGrid, Layers } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  count?: number;
  onClick: () => void;
  type: 'category' | 'subcategory';
  categoryId?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, count, onClick, type, categoryId }) => {
  const isMain = type === 'category';

  // Specific Styling based on Category ID (simulating the images)
  const getIcon = () => {
    if (categoryId === 'cat-skrm') return <Sparkles size={24} className="text-vibe-red" />;
    if (categoryId === 'cat-def') return <GraduationCap size={24} className="text-white" />;
    if (categoryId === 'cat-others') return <LayoutGrid size={24} className="text-vibe-dark" />;
    return isMain ? <LayoutGrid size={24} className="text-vibe-dark" /> : <Layers size={24} className="text-vibe-teal" />;
  };

  const getIconBg = () => {
    if (categoryId === 'cat-skrm') return 'bg-vibe-red/10';
    if (categoryId === 'cat-def') return 'bg-vibe-teal';
    if (categoryId === 'cat-others') return 'bg-gray-100';
    return isMain ? 'bg-gray-100' : 'bg-vibe-teal/10';
  };

  const getSubtitle = () => {
    if (categoryId === 'cat-skrm') return 'SPIRITUALITY SECTOR';
    if (categoryId === 'cat-def') return 'ACADEMIC SECTOR';
    if (categoryId === 'cat-others') return 'GENERAL SECTOR';
    return 'SECTION';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
    >
      <div className="flex items-center gap-5">
        <div className={`w-16 h-16 rounded-[1.2rem] ${getIconBg()} flex items-center justify-center transition-transform group-hover:scale-110`}>
           {getIcon()}
        </div>
        
        <div>
           {isMain && (
               <span className="block text-[10px] font-bold text-vibe-gray/60 tracking-widest uppercase mb-1">
                   {getSubtitle()}
               </span>
           )}
           <h3 className="text-2xl font-black italic text-vibe-dark tracking-tight leading-none mb-2">
             {name}
           </h3>
           
           {/* Dynamic Pill */}
           {type === 'category' ? (
                <span className="inline-block px-3 py-1 bg-vibe-red/10 text-vibe-red text-[10px] font-bold rounded-full tracking-wider uppercase">
                    {count !== undefined ? count : 0} Sections
                </span>
           ) : (
                <span className="text-xs font-bold text-vibe-teal">
                    {count !== undefined ? `${count} Apps` : 'Open'}
                </span>
           )}
        </div>
      </div>

      <div className="text-vibe-red opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
         <ArrowRight size={24} />
      </div>
    </div>
  );
};

export default CategoryCard;
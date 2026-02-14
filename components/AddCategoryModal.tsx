import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  type: 'Category' | 'Sub-Category';
  parentName?: string;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd, type, parentName }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black italic text-vibe-dark">NEW {type.toUpperCase()}</h2>
            {parentName && <p className="text-[10px] font-bold text-vibe-teal mt-1 tracking-wider uppercase">IN: {parentName}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-vibe-dark hover:bg-vibe-red hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">Name</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Accounts"
              className="w-full bg-[#F8F9FB] rounded-xl px-4 py-4 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-vibe-dark text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
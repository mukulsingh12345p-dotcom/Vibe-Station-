import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AppEntry, Category } from '../types';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Omit<AppEntry, 'id' | 'createdAt'>) => void;
  categories: Category[];
  initialCategoryId?: string;
  initialSubCategoryId?: string;
  initialData?: AppEntry | null;
}

const AddAppModal: React.FC<AddAppModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories, 
  initialCategoryId, 
  initialSubCategoryId,
  initialData
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [aiStudioUrl, setAiStudioUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        setName(initialData.name);
        setUrl(initialData.url);
        setAiStudioUrl(initialData.aiStudioUrl || '');
        setDescription(initialData.description);
        setSelectedCategoryId(initialData.categoryId);
        setSelectedSubCategoryId(initialData.subCategoryId);
      } else {
        // Add Mode
        setSelectedCategoryId(initialCategoryId || '');
        setSelectedSubCategoryId(initialSubCategoryId || '');
        setName('');
        setUrl('');
        setAiStudioUrl('');
        setDescription('');
      }
    }
  }, [isOpen, initialData, initialCategoryId, initialSubCategoryId]);

  useEffect(() => {
    if (selectedCategoryId !== (initialData?.categoryId || initialCategoryId)) {
       // Only clear subcategory if we manually changed the category, not during initial load
       if (!initialData || selectedCategoryId !== initialData.categoryId) {
          // Reset subcat if category changes
          if (!isOpen) return; // Don't reset if not open (prevents flickers)
          // Actually, standard behavior: if cat changes, reset subcat.
          // We need to be careful not to reset it immediately after setting it from initialData
       }
    }
  }, [selectedCategoryId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedSubCategoryId) {
      alert("Please select both a Category and a Sub-Category");
      return;
    }

    onSave({
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      aiStudioUrl: aiStudioUrl ? (aiStudioUrl.startsWith('http') ? aiStudioUrl : `https://${aiStudioUrl}`) : undefined,
      description: description,
      categoryId: selectedCategoryId,
      subCategoryId: selectedSubCategoryId
    });
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black italic text-vibe-dark">{initialData ? 'EDIT UNIT' : 'NEW UNIT'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-vibe-dark hover:bg-vibe-red hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">App Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 transition-all"
              placeholder="e.g. Dashboard"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">Website URL</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">AI Studio Link (Optional)</label>
            <input
              type="text"
              value={aiStudioUrl}
              onChange={(e) => setAiStudioUrl(e.target.value)}
              className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 transition-all"
              placeholder="https://aistudio.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">Sector</label>
                <select
                value={selectedCategoryId}
                onChange={(e) => { setSelectedCategoryId(e.target.value); setSelectedSubCategoryId(''); }}
                required
                className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 appearance-none"
                >
                <option value="">Select...</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">Sub-Section</label>
                <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                required
                disabled={!selectedCategoryId}
                className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-bold outline-none focus:ring-2 focus:ring-vibe-teal/20 appearance-none disabled:opacity-50"
                >
                <option value="">Select...</option>
                {selectedCategory?.subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-vibe-gray mb-2 ml-1">Brief (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#F8F9FB] rounded-xl px-4 py-3 text-vibe-dark font-medium outline-none focus:ring-2 focus:ring-vibe-teal/20 resize-none"
              placeholder="..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-vibe-dark text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {initialData ? 'Update Unit' : 'Confirm Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppModal;
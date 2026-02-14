import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ChevronRight, Home, Grid, LogOut, LayoutGrid, ArrowLeft, FolderPlus } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { AppEntry, Category } from './types';
import AppCard from './components/AppCard';
import CategoryCard from './components/CategoryCard';
import AddAppModal from './components/AddAppModal';
import AddCategoryModal from './components/AddCategoryModal';
import LoginScreen from './components/LoginScreen';
import Logo from './components/Logo';

// View State Management
type ViewState = 
  | { type: 'HOME' }
  | { type: 'CATEGORY'; categoryId: string }
  | { type: 'SUBCATEGORY'; categoryId: string; subCategoryId: string }
  | { type: 'JUMP' }
  | { type: 'GRID' }
  | { type: 'GRID_GROUP'; groupId: string };

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewState, setViewState] = useState<ViewState>({ type: 'HOME' });
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Auth & Data Fetching ---
  useEffect(() => {
    const authSession = localStorage.getItem('def_auth_session');
    if (authSession === 'true') {
        setIsAuthenticated(true);
        fetchData();
    } else {
        setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        // Fetch Categories and SubCategories
        const { data: catsData, error: catError } = await supabase
            .from('categories')
            .select('*, sub_categories(*)');

        if (catError) console.error('Error fetching categories:', catError);

        if (catsData) {
            const formattedCats: Category[] = catsData.map((c: any) => ({
                id: c.id,
                name: c.name,
                subCategories: (c.sub_categories || []).map((sc: any) => ({
                    id: sc.id,
                    name: sc.name
                }))
            }));
            setCategories(formattedCats);
        }

        // Fetch Apps
        const { data: appsData, error: appError } = await supabase
            .from('apps')
            .select('*');
        
        if (appError) console.error('Error fetching apps:', appError);

        if (appsData) {
            const formattedApps: AppEntry[] = appsData.map((a: any) => ({
                id: a.id,
                name: a.name,
                url: a.url,
                aiStudioUrl: a.ai_studio_url,
                description: a.description,
                categoryId: a.category_id,
                subCategoryId: a.sub_category_id,
                createdAt: Number(a.created_at)
            }));
            setApps(formattedApps);
        }

    } catch (e) {
        console.error("Connection error:", e);
    } finally {
        setLoading(false);
    }
  };

  // --- Handlers ---
  const handleLogin = () => {
    localStorage.setItem('def_auth_session', 'true');
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('def_auth_session');
    setIsAuthenticated(false);
  };

  const handleAddCategory = async (name: string) => {
    try {
        // HOME or GRID view -> Create a new Main Category
        if (viewState.type === 'HOME' || viewState.type === 'GRID') {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name: name, created_at: Date.now() })
                .select()
                .single();
            
            if (error) throw error;
            if (data) {
                const newCat: Category = { id: data.id, name: data.name, subCategories: [] };
                setCategories(prev => [...prev, newCat]);
                
                // If in GRID mode, add a default 'Main' subcategory automatically
                if (viewState.type === 'GRID') {
                    const { data: subData } = await supabase
                        .from('sub_categories')
                        .insert({ name: 'Main', category_id: data.id, created_at: Date.now() })
                        .select()
                        .single();
                    
                    if (subData) {
                        setCategories(prev => prev.map(c => c.id === data.id ? { ...c, subCategories: [{ id: subData.id, name: subData.name }] } : c));
                    }
                }
            }

        } else if (viewState.type === 'CATEGORY') {
            // CATEGORY view -> Create a new Sub-Category
            const { data, error } = await supabase
                .from('sub_categories')
                .insert({ 
                    name: name, 
                    category_id: viewState.categoryId,
                    created_at: Date.now() 
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setCategories(prev => prev.map(cat => {
                    if (cat.id === viewState.categoryId) {
                        return { ...cat, subCategories: [...cat.subCategories, { id: data.id, name: data.name }] };
                    }
                    return cat;
                }));
            }
        }
    } catch (e) {
        console.error("Error adding category:", e);
        alert("Failed to save category. Check console.");
    }
  };

  const handleAddApp = async (newApp: Omit<AppEntry, 'id' | 'createdAt'>) => {
      try {
        const { data, error } = await supabase
            .from('apps')
            .insert({
                name: newApp.name,
                url: newApp.url,
                ai_studio_url: newApp.aiStudioUrl,
                description: newApp.description,
                category_id: newApp.categoryId,
                sub_category_id: newApp.subCategoryId,
                created_at: Date.now()
            })
            .select()
            .single();

        if (error) throw error;

        if (data) {
            const app: AppEntry = { 
                id: data.id,
                name: data.name,
                url: data.url,
                aiStudioUrl: data.ai_studio_url,
                description: data.description,
                categoryId: data.category_id,
                subCategoryId: data.sub_category_id,
                createdAt: Number(data.created_at)
            };
            setApps(prev => [app, ...prev]);
        }
      } catch (e) {
        console.error("Error adding app:", e);
        alert("Failed to save app. Check console.");
      }
  };

  // --- Navigation Helpers ---
  const getCurrentCategory = () => {
      if (viewState.type === 'CATEGORY') return categories.find(c => c.id === viewState.categoryId);
      if (viewState.type === 'SUBCATEGORY') return categories.find(c => c.id === viewState.categoryId);
      if (viewState.type === 'GRID_GROUP') return categories.find(c => c.id === viewState.groupId);
      return null;
  };

  const getCurrentSubCategory = () => {
    if (viewState.type !== 'SUBCATEGORY') return null;
    const cat = getCurrentCategory();
    return cat?.subCategories.find(s => s.id === viewState.subCategoryId);
  };

  const currentCategory = getCurrentCategory();
  const currentSubCategory = getCurrentSubCategory();

  // --- Filter Logic ---
  const displayedContent = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    if (viewState.type === 'HOME') {
      return categories.filter(c => c.name.toLowerCase().includes(searchLower));
    } 
    
    if (viewState.type === 'CATEGORY') {
      const cat = getCurrentCategory();
      if (!cat) return [];
      return cat.subCategories.filter(s => s.name.toLowerCase().includes(searchLower));
    }

    if (viewState.type === 'SUBCATEGORY') {
      return apps.filter(app => 
        app.categoryId === viewState.categoryId &&
        app.subCategoryId === viewState.subCategoryId &&
        (app.name.toLowerCase().includes(searchLower) || app.description.toLowerCase().includes(searchLower))
      );
    }

    if (viewState.type === 'JUMP') {
        if (!searchTerm) return apps.sort((a,b) => b.createdAt - a.createdAt).slice(0, 10); // Show recent if no search
        return apps.filter(app => 
            app.name.toLowerCase().includes(searchLower) || 
            app.description.toLowerCase().includes(searchLower)
        );
    }

    if (viewState.type === 'GRID') {
        // Show ALL apps
        return apps.filter(app => 
            app.name.toLowerCase().includes(searchLower) || 
            app.description.toLowerCase().includes(searchLower)
        );
    }

    if (viewState.type === 'GRID_GROUP') {
        return apps.filter(app => app.categoryId === viewState.groupId && (
            app.name.toLowerCase().includes(searchLower) || 
            app.description.toLowerCase().includes(searchLower)
        ));
    }

    return [];
  }, [viewState, categories, apps, searchTerm]);

  // --- Render ---
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;
  
  // Simple loading state
  if (loading && apps.length === 0 && categories.length === 0) {
      return (
          <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-vibe-red rounded-full mb-4"></div>
                  <div className="text-vibe-gray font-bold text-xs uppercase tracking-widest">Loading Database...</div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-vibe-dark selection:bg-vibe-red/20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F9FB]/80 backdrop-blur-md pt-4 pb-2 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Logo className="w-10 h-10 shadow-lg shadow-vibe-red/20" />
             <span className="text-xl font-black italic tracking-tighter">
               VIBE<span className="text-vibe-dark">STATION</span>
             </span>
          </div>
          
          <div className="flex items-center gap-2">
              {viewState.type === 'JUMP' && (
                  <span className="text-xs font-bold text-vibe-red uppercase tracking-widest bg-vibe-red/10 px-3 py-1 rounded-full">Jump Mode</span>
              )}
              {viewState.type === 'GRID' && (
                  <span className="text-xs font-bold text-vibe-teal uppercase tracking-widest bg-vibe-teal/10 px-3 py-1 rounded-full">App Grid</span>
              )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pt-6 pb-32 animate-fade-in">
        
        {/* Navigation Breadcrumbs */}
        {(viewState.type === 'HOME' || viewState.type === 'CATEGORY' || viewState.type === 'SUBCATEGORY') && (
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-vibe-gray/60 mb-2">
                    <span onClick={() => setViewState({ type: 'HOME' })} className="cursor-pointer hover:text-vibe-red transition-colors">HUB</span>
                    {currentCategory && (
                        <>
                            <ChevronRight size={10} />
                            <span onClick={() => setViewState({ type: 'CATEGORY', categoryId: currentCategory.id })} className="cursor-pointer hover:text-vibe-red transition-colors">{currentCategory.name}</span>
                        </>
                    )}
                    {currentSubCategory && (
                        <>
                            <ChevronRight size={10} />
                            <span className="text-vibe-red">{currentSubCategory.name}</span>
                        </>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-vibe-dark mb-2">
                            {viewState.type === 'HOME' ? 'LAUNCHPAD' : 
                            viewState.type === 'CATEGORY' ? currentCategory?.name :
                            currentSubCategory?.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="h-1 w-8 bg-vibe-red rounded-full"></div>
                            <span className="text-xs font-bold tracking-[0.2em] text-vibe-teal uppercase">
                                {viewState.type === 'HOME' ? 'Active Units' : 
                                viewState.type === 'CATEGORY' ? `${currentCategory?.subCategories.length || 0} In Section` :
                                `${displayedContent.length} Active Apps`}
                            </span>
                        </div>
                    </div>

                    {/* FAB: Add Main Category in HOME, or Sub-Category in CATEGORY, or App in SUBCATEGORY */}
                    {(viewState.type === 'HOME' || viewState.type === 'CATEGORY' || viewState.type === 'SUBCATEGORY') && (
                        <button 
                          onClick={() => {
                              if (viewState.type === 'SUBCATEGORY') setIsAppModalOpen(true);
                              else setIsCategoryModalOpen(true);
                          }}
                          className="w-14 h-14 bg-vibe-red rounded-[1.2rem] shadow-glow flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-20"
                        >
                          <Plus size={28} />
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* JUMP VIEW */}
        {viewState.type === 'JUMP' && (
            <div className="animate-slide-up">
                 <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter text-vibe-dark mb-2">JUMP</h1>
                    <p className="text-vibe-gray text-sm font-medium">Quickly access any application</p>
                 </div>

                 <div className="mb-8 relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-vibe-red">
                        <Search size={24} />
                    </div>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Type app name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white h-20 pl-16 pr-6 rounded-[2rem] shadow-glow text-2xl font-black italic text-vibe-dark placeholder-vibe-gray/20 outline-none focus:ring-4 focus:ring-vibe-red/5 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(displayedContent as AppEntry[]).length > 0 ? (
                        (displayedContent as AppEntry[]).map((app, index) => (
                            <AppCard key={app.id} app={app} index={index} />
                        ))
                    ) : (
                        searchTerm ? (
                            <div className="col-span-full text-center py-10 text-vibe-gray font-bold opacity-50">
                                No apps found matching "{searchTerm}"
                            </div>
                        ) : (
                            <div className="col-span-full text-center py-10 text-vibe-gray font-bold opacity-50">
                                Start typing to search...
                            </div>
                        )
                    )}
                </div>
            </div>
        )}

        {/* GRID VIEW */}
        {viewState.type === 'GRID' && (
             <div className="animate-slide-up">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-vibe-dark mb-2">GRID</h1>
                        <p className="text-vibe-gray text-sm font-medium">All Applications</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsAppModalOpen(true)}
                            className="flex items-center gap-2 bg-vibe-teal text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-lg hover:bg-vibe-teal/90 transition-colors"
                        >
                            <Plus size={14} /> New App
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(displayedContent as AppEntry[]).length > 0 ? (
                         (displayedContent as AppEntry[]).map((app, index) => (
                             <AppCard key={app.id} app={app} index={index} />
                         ))
                    ) : (
                         <div className="col-span-full py-12 flex flex-col items-center justify-center text-vibe-gray/40">
                             <LayoutGrid size={48} className="mb-4 opacity-50" />
                             <p className="font-bold text-sm">No apps found.</p>
                             <button onClick={() => setIsAppModalOpen(true)} className="mt-2 text-vibe-teal font-bold text-xs uppercase tracking-wider hover:underline">Add Your First App</button>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* GRID GROUP VIEW - Kept for internal routing consistency */}
        {viewState.type === 'GRID_GROUP' && currentCategory && (
            <div className="animate-slide-up">
                <div className="mb-8">
                     <button 
                        onClick={() => setViewState({ type: 'GRID' })}
                        className="flex items-center gap-2 text-vibe-gray hover:text-vibe-dark mb-4 text-xs font-bold uppercase tracking-widest transition-colors"
                     >
                        <ArrowLeft size={14} /> Back to Grid
                     </button>
                     <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-black italic tracking-tighter text-vibe-dark mb-2">{currentCategory.name}</h1>
                            <p className="text-vibe-gray text-sm font-medium">Group Content</p>
                        </div>
                        <button 
                            onClick={() => setIsAppModalOpen(true)}
                            className="flex items-center gap-2 bg-vibe-dark text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-black transition-colors"
                        >
                            <Plus size={16} /> Add App
                        </button>
                    </div>
                </div>
                
                <input 
                    type="text" 
                    placeholder={`Search in ${currentCategory.name}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white h-14 pl-6 pr-6 rounded-xl shadow-soft text-sm font-bold text-vibe-dark placeholder-vibe-gray/30 outline-none mb-6"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(displayedContent as AppEntry[]).length > 0 ? (
                        (displayedContent as AppEntry[]).map((app, index) => (
                            <AppCard key={app.id} app={app} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-vibe-gray/40">
                             <LayoutGrid size={48} className="mb-4 opacity-50" />
                             <p className="font-bold text-sm">No apps in this group yet.</p>
                             <button onClick={() => setIsAppModalOpen(true)} className="mt-2 text-vibe-teal font-bold text-xs uppercase tracking-wider hover:underline">Add First App</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* HOME SEARCH (Legacy Launchpad View) */}
        {viewState.type === 'HOME' && (
             <div className="mb-10 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-vibe-red">
                    <Search size={20} />
                </div>
                <input 
                    id="search-input"
                    type="text" 
                    placeholder="Filter categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white h-16 pl-14 pr-6 rounded-[2rem] shadow-soft text-lg font-bold text-vibe-dark placeholder-vibe-gray/30 outline-none focus:ring-2 focus:ring-vibe-red/10 transition-all"
                />
            </div>
        )}

        {/* Content Grid (Legacy Launchpad View) */}
        {(viewState.type === 'HOME' || viewState.type === 'CATEGORY' || viewState.type === 'SUBCATEGORY') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {viewState.type === 'HOME' && (displayedContent as Category[]).map(cat => (
                    <CategoryCard 
                        key={cat.id} 
                        name={cat.name} 
                        type="category"
                        categoryId={cat.id} 
                        count={cat.subCategories.length}
                        onClick={() => { setViewState({ type: 'CATEGORY', categoryId: cat.id }); setSearchTerm(''); }}
                    />
                ))}

                {viewState.type === 'CATEGORY' && (displayedContent as any[]).map(sub => (
                    <CategoryCard 
                        key={sub.id} 
                        name={sub.name} 
                        type="subcategory"
                        count={apps.filter(a => a.subCategoryId === sub.id).length}
                        onClick={() => { setViewState({ type: 'SUBCATEGORY', categoryId: viewState.categoryId, subCategoryId: sub.id }); setSearchTerm(''); }}
                    />
                ))}

                {viewState.type === 'SUBCATEGORY' && (displayedContent as AppEntry[]).map((app, index) => (
                    <AppCard key={app.id} app={app} index={index} />
                ))}
            </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-4 pb-6 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between px-10">
            <button 
                onClick={() => { setViewState({ type: 'HOME' }); setSearchTerm(''); }} 
                className={`flex flex-col items-center gap-1 transition-colors group ${viewState.type === 'HOME' ? 'text-vibe-red' : 'text-vibe-gray hover:text-vibe-red'}`}
            >
                <Home size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
            </button>
            <button 
                onClick={() => { setViewState({ type: 'JUMP' }); setSearchTerm(''); }} 
                className={`flex flex-col items-center gap-1 transition-colors group ${viewState.type === 'JUMP' ? 'text-vibe-red' : 'text-vibe-gray hover:text-vibe-red'}`}
            >
                <Search size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Jump</span>
            </button>
            <button 
                onClick={() => { setViewState({ type: 'GRID' }); setSearchTerm(''); }} 
                className={`flex flex-col items-center gap-1 transition-colors group ${viewState.type === 'GRID' || viewState.type === 'GRID_GROUP' ? 'text-vibe-red' : 'text-vibe-gray hover:text-vibe-red'}`}
            >
                <Grid size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Grid</span>
            </button>
            <button 
                onClick={handleLogout} 
                className="flex flex-col items-center gap-1 text-vibe-gray hover:text-vibe-red transition-colors group"
            >
                <LogOut size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Out</span>
            </button>
        </div>
      </div>

      {/* Modals */}
      <AddAppModal 
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)} 
        onAdd={handleAddApp} 
        categories={categories}
        initialCategoryId={
            viewState.type === 'SUBCATEGORY' ? viewState.categoryId : 
            viewState.type === 'GRID_GROUP' ? viewState.groupId : undefined
        }
        initialSubCategoryId={
            viewState.type === 'SUBCATEGORY' ? viewState.subCategoryId : 
            viewState.type === 'GRID_GROUP' ? categories.find(c => c.id === viewState.groupId)?.subCategories[0]?.id : undefined
        }
      />
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={handleAddCategory}
        type={viewState.type === 'HOME' || viewState.type === 'GRID' ? 'Category' : 'Sub-Category'}
        parentName={viewState.type === 'CATEGORY' ? currentCategory?.name : undefined}
      />
    </div>
  );
};

export default App;
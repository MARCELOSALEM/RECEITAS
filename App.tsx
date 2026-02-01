
import React, { useState, useCallback } from 'react';
import { 
  Search, 
  FileDown, 
  ChefHat, 
  Utensils, 
  Clock, 
  Users, 
  Loader2, 
  Camera, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { GenerationState } from './types';
import { generateRecipeContent, generateRecipeImage } from './services/geminiService';
import { printRecipe } from './components/RecipePDF';

const App: React.FC = () => {
  const [inputName, setInputName] = useState('');
  const [state, setState] = useState<GenerationState>({
    loading: false,
    recipe: null,
    image: null,
    imageLoading: false,
    error: null,
  });

  const handleGenerate = async () => {
    if (!inputName.trim()) return;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      imageLoading: true, 
      recipe: null, 
      image: null, 
      error: null 
    }));

    try {
      // 1. Generate text recipe
      const recipe = await generateRecipeContent(inputName);
      setState(prev => ({ ...prev, recipe, loading: false }));

      // 2. Generate image
      try {
        const image = await generateRecipeImage(recipe.titulo);
        setState(prev => ({ ...prev, image, imageLoading: false }));
      } catch (imgErr) {
        console.error("Image generation failed", imgErr);
        setState(prev => ({ ...prev, imageLoading: false }));
      }

    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        imageLoading: false, 
        error: "Ocorreu um erro ao criar sua receita. Por favor, tente novamente com outro nome ou prato." 
      }));
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-xl shadow-orange-100 rotate-3">
              <ChefHat size={28} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-neutral-800 block leading-none">CHEF DIGITAL</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Gourmet AI Engine</span>
            </div>
          </div>
          
          {state.recipe && !state.loading && (
            <button
              onClick={() => printRecipe(state.recipe!, state.image)}
              className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-neutral-200"
            >
              <FileDown size={18} />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {/* Search Section */}
        <section className="relative mb-16">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40 -z-10"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-stone-200 rounded-full blur-3xl opacity-40 -z-10"></div>
          
          <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl shadow-stone-200/50 border border-stone-100 transition-all text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-neutral-900 leading-[1.1] tracking-tight">
              O que sua imaginação <br className="hidden md:block" />
              <span className="text-orange-600">quer saborear hoje?</span>
            </h2>
            <p className="text-stone-500 mb-10 text-lg font-medium max-w-2xl">
              Nossa inteligência artificial cria receitas exclusivas de alta gastronomia <br className="hidden md:block" />
              em segundos. Digite um ingrediente, um prato ou um conceito.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors" size={24} />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={onKeyPress}
                  placeholder="Ex: Risoto de Pera com Queijo Gorgonzola e Nozes..."
                  className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all text-lg font-semibold placeholder:text-stone-300"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={state.loading || !inputName.trim()}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 text-lg hover:translate-y-[-2px] active:translate-y-0"
              >
                {state.loading ? (
                  <RefreshCw className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Gerar Receita</span>
                    <Sparkles size={20} />
                  </>
                )}
              </button>
            </div>
            
            {state.error && (
              <div className="mt-6 flex items-center gap-2 text-red-500 font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                <Utensils size={20} />
                {state.error}
              </div>
            )}
          </div>
        </section>

        {/* Recipe Display */}
        {(state.loading || state.recipe) && (
          <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            
            {/* Column Left: Visual & Quick Stats */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden bg-white shadow-3xl border-[12px] border-white ring-1 ring-stone-200">
                {state.imageLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-stone-50">
                    <div className="relative">
                      <div className="w-16 h-16 border-[6px] border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                      <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-600" size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-stone-800 font-black uppercase tracking-tighter text-sm block">Fotografando...</span>
                      <span className="text-stone-400 text-xs font-medium">Renderização em 8k Ultra-HD</span>
                    </div>
                  </div>
                ) : state.image ? (
                  <img 
                    src={state.image} 
                    alt={state.recipe?.titulo} 
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" 
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 bg-stone-50">
                    <Camera size={80} strokeWidth={1} />
                    <span className="mt-4 font-bold uppercase tracking-widest text-xs">Prato em preparo...</span>
                  </div>
                )}
                
                {state.recipe && !state.imageLoading && (
                  <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl flex items-center justify-between border border-white/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Imagem Gerada por IA</span>
                    <Sparkles size={14} className="text-orange-400" />
                  </div>
                )}
              </div>

              {state.recipe && !state.loading && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-stone-100 text-center shadow-sm group hover:border-orange-200 transition-all">
                    <Clock className="mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" size={24} />
                    <span className="block text-[10px] uppercase text-stone-400 font-bold mb-1">Tempo</span>
                    <span className="text-sm font-black text-neutral-800">{state.recipe.tempo}</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-stone-100 text-center shadow-sm group hover:border-orange-200 transition-all">
                    <Users className="mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" size={24} />
                    <span className="block text-[10px] uppercase text-stone-400 font-bold mb-1">Rendimento</span>
                    <span className="text-sm font-black text-neutral-800">{state.recipe.porcoes}</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-stone-100 text-center shadow-sm group hover:border-orange-200 transition-all">
                    <Utensils className="mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" size={24} />
                    <span className="block text-[10px] uppercase text-stone-400 font-bold mb-1">Nível</span>
                    <span className="text-sm font-black text-neutral-800">{state.recipe.dificuldade}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Column Right: Full Recipe Content */}
            <div className="lg:col-span-7 space-y-12">
              {state.loading ? (
                <div className="space-y-8">
                  <div className="h-16 w-3/4 bg-stone-200 animate-pulse rounded-2xl"></div>
                  <div className="space-y-4">
                    <div className="h-8 w-1/4 bg-stone-200 animate-pulse rounded-xl"></div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-stone-100 animate-pulse rounded-2xl"></div>)}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-8 w-1/4 bg-stone-200 animate-pulse rounded-xl"></div>
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-stone-50 animate-pulse rounded-3xl"></div>)}
                  </div>
                </div>
              ) : state.recipe ? (
                <>
                  <div className="border-b-4 border-stone-100 pb-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-wider">Receita Exclusiva IA</span>
                      <span className="px-4 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-black uppercase tracking-wider">Chef Master Series</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[1.1] tracking-tighter font-serif">
                      {state.recipe.titulo}
                    </h1>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-3xl font-black flex items-center gap-4 text-neutral-800">
                      <span className="w-2.5 h-10 bg-orange-600 rounded-full block"></span>
                      Ingredientes Selecionados
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {state.recipe.ingredientes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-stone-100 shadow-sm group hover:border-orange-200 hover:shadow-md transition-all">
                          <div className="bg-orange-50 p-1.5 rounded-full text-orange-600">
                            <CheckCircle2 size={18} strokeWidth={3} />
                          </div>
                          <span className="text-sm font-bold text-stone-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-3xl font-black flex items-center gap-4 text-neutral-800">
                      <span className="w-2.5 h-10 bg-orange-600 rounded-full block"></span>
                      Modo de Preparo
                    </h3>
                    <div className="space-y-6">
                      {state.recipe.instrucoes.map((step, idx) => (
                        <div key={idx} className="group flex gap-6 p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden items-start">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                            {idx + 1}
                          </div>
                          <p className="text-stone-700 text-lg leading-relaxed pt-1 font-semibold flex-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-12">
                     <button
                        onClick={() => printRecipe(state.recipe!, state.image)}
                        className="w-full flex items-center justify-center gap-4 bg-neutral-900 text-white hover:bg-black font-black py-8 rounded-[32px] transition-all shadow-2xl shadow-neutral-300 hover:translate-y-[-4px] active:translate-y-0 text-xl"
                     >
                       <FileDown size={28} />
                       DOWNLOAD DO LIVRO DE RECEITA (PDF)
                     </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {!state.recipe && !state.loading && (
        <div className="flex flex-col items-center justify-center mt-32 text-stone-200">
           <div className="relative">
              <Utensils size={180} strokeWidth={0.5} />
              <div className="absolute top-0 right-0 bg-orange-500 w-8 h-8 rounded-full animate-bounce shadow-lg shadow-orange-300"></div>
           </div>
           <p className="mt-10 text-2xl font-black text-stone-300 tracking-tighter text-center px-6">
             A alta gastronomia começa com uma ideia. <br className="hidden md:block" />
             Qual é a sua hoje?
           </p>
           <div className="mt-12 flex flex-wrap justify-center gap-3">
             {['Souflê de Queijo', 'Polvo Grelhado', 'Macaron Francês', 'Beef Wellington'].map(sug => (
               <button 
                key={sug}
                onClick={() => { setInputName(sug); handleGenerate(); }}
                className="px-6 py-3 bg-white border border-stone-100 rounded-2xl text-stone-400 text-sm font-bold hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
               >
                 {sug}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-32 border-t border-stone-200 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ChefHat size={20} className="text-stone-400" />
          <span className="font-black text-stone-400 tracking-tighter">CHEF DIGITAL AI</span>
        </div>
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
          Criado com Inteligência Artificial &bull; 2024 &bull; Gourmet Engine
        </p>
      </footer>
    </div>
  );
};

export default App;

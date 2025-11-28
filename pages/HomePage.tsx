import React, { useState } from 'react';
import { AVAILABLE_GENRES } from '../types';
import { Button } from '../components/Button';
import { getRecommendations } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Compass } from 'lucide-react';

export const HomePage = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setRecommendations } = useApp();
  const navigate = useNavigate();

  const toggleGenre = (id: string) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedGenres.length === 0) return;
    setLoading(true);
    const movies = await getRecommendations(selectedGenres);
    setRecommendations(movies);
    setLoading(false);
    navigate('/recommendations');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row items-end gap-6 justify-between animate-fade-in">
        <div>
           <div className="flex items-center gap-3 mb-2 text-rose-500">
             <Compass size={24} />
             <span className="text-sm font-bold tracking-widest uppercase">Discovery Engine</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
             Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-500">New Worlds</span>
           </h1>
           <p className="text-slate-400 text-lg mt-4 max-w-2xl">
             Select a few genres to define your current mood, and let our AI curate a personalized list for you.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-32 max-w-7xl mx-auto">
        {AVAILABLE_GENRES.map((genre, index) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`
                relative group p-6 rounded-2xl border transition-all duration-300
                flex flex-col items-center justify-center gap-3
                ${isSelected 
                  ? 'bg-gradient-to-br from-rose-500/20 to-violet-500/20 border-rose-500/50 shadow-[0_0_30px_-10px_rgba(225,29,72,0.3)]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-1'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${isSelected ? 'bg-rose-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}
              `}>
                {isSelected ? <Check size={20} /> : <span className="text-xl opacity-50">#</span>}
              </div>
              <span className={`font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {genre.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className={`pointer-events-auto transition-all duration-500 transform ${selectedGenres.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="p-2 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl">
            <Button 
              size="lg" 
              onClick={handleGenerate} 
              disabled={selectedGenres.length === 0}
              isLoading={loading}
              className="px-10 py-4 text-lg shadow-rose-500/20"
            >
              {!loading && <Sparkles className="mr-2 h-5 w-5 animate-pulse" />}
              {loading ? 'Curating Magic...' : `Get Recommendations (${selectedGenres.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
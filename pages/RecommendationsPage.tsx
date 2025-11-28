import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { ArrowRight, Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { PosterImage } from '../components/PosterImage';

export const RecommendationsPage = () => {
  const { currentRecommendations, addToWatchlist, watchlist } = useApp();
  const navigate = useNavigate();

  if (currentRecommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
           <Star className="text-slate-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ready to explore?</h2>
        <p className="text-slate-400 mb-8">Select some genres to get started with AI recommendations.</p>
        <Button onClick={() => navigate('/explore')}>Start Discovery</Button>
      </div>
    );
  }

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Curated For You</h2>
          <p className="text-slate-400 text-lg">AI-selected masterpieces based on your taste.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/explore')}> Refine Genres</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {currentRecommendations.map((movie, index) => {
          const inWatchlist = watchlist.some(m => m.id === movie.id);

          return (
            <div 
              key={movie.id} 
              className="group relative bg-vista-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-rose-900/20 transition-all duration-500 hover:-translate-y-2 border border-slate-800 hover:border-slate-600"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => handleMovieClick(movie)}>
                <PosterImage
                  src={movie.imageUrl}
                  title={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <span className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                           <Star size={8} className="fill-black" /> {movie.rating}
                        </span>
                        <span className="text-xs text-slate-300 font-medium bg-black/40 backdrop-blur px-2 py-0.5 rounded border border-white/10">{movie.year}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-rose-400 transition-colors">{movie.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 h-0 group-hover:h-auto">{movie.plot}</p>
                   </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 relative z-20">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     inWatchlist ? null : addToWatchlist(movie);
                   }}
                   className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                     inWatchlist 
                       ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                       : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                   }`}
                 >
                   {inWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                   {inWatchlist ? 'Saved' : 'Watchlist'}
                 </button>
                 <button 
                    onClick={() => handleMovieClick(movie)}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all"
                 >
                   <ArrowRight size={18} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, PlayCircle, List } from 'lucide-react';
import { Button } from '../components/Button';
import { PosterImage } from '../components/PosterImage';

export const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row items-end gap-6 justify-between animate-fade-in">
        <div>
           <div className="flex items-center gap-3 mb-2 text-violet-500">
             <List size={24} />
             <span className="text-sm font-bold tracking-widest uppercase">Your Library</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
             My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Watchlist</span>
           </h1>
           <p className="text-slate-400 text-lg mt-4 max-w-2xl">
             Your personal queue of must-watch titles. {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} waiting for you.
           </p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-3xl border border-dashed border-slate-700 animate-slide-up">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
             <PlayCircle className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h3>
          <p className="text-slate-400 text-lg mb-8 text-center max-w-md">Start exploring genres to find your next favorite movie.</p>
          <Button onClick={() => navigate('/explore')}>Discover Movies</Button>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up">
          {watchlist.map((movie, index) => (
            <div 
              key={movie.id} 
              className="group bg-vista-card border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative w-full sm:w-24 aspect-[2/3] flex-shrink-0 cursor-pointer bg-slate-900 rounded-lg overflow-hidden" onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}>
                  <PosterImage 
                    src={movie.imageUrl} 
                    title={movie.title} 
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                  />
              </div>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-rose-400 transition-colors truncate">{movie.title}</h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-sm text-slate-400 mb-3">
                   <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{movie.year}</span>
                   <span>•</span>
                   <span className="truncate">{movie.genre.join(', ')}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl hidden sm:block">{movie.plot}</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="secondary" onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })} className="flex-1 sm:flex-initial py-2 px-4 text-sm whitespace-nowrap">
                  <Eye size={18} className="mr-2"/> View Details
                </Button>
                <button 
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-slate-700 hover:border-red-500/20 bg-slate-800/50"
                  title="Remove from Watchlist"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
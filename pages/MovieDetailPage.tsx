import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { getMovieDeepDive } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { ArrowLeft, Star, MonitorPlay, Users, Bookmark, BookmarkCheck, Quote } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { PosterImage } from '../components/PosterImage';

export const MovieDetailPage = () => {
  const { state } = useLocation();
  const { watchlist, addToWatchlist, removeFromWatchlist, rateMovie, ratings } = useApp();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(state?.movie || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie && !movie.cast) {
      setLoading(true);
      getMovieDeepDive(movie.title).then((details) => {
        setMovie(prev => prev ? { ...prev, ...details } : null);
        setLoading(false);
      });
    }
  }, [movie?.title]);

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Movie not found</div>;
  }

  const inWatchlist = watchlist.some(m => m.id === movie.id);
  // Safely access score from the new ratings object structure
  const userRating = ratings[movie.id]?.score || 0;

  return (
    <div className="min-h-screen pb-20 -mt-24">
      {/* Immersive Hero */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <PosterImage 
            src={movie.imageUrl} 
            title={movie.title} 
            className="w-full h-full object-cover" 
          />
          {/* Complex Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-vista-bg via-vista-bg/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-vista-bg via-vista-bg/80 to-transparent"></div>
          <div className="absolute inset-0 bg-rose-900/10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-28 left-4 md:left-8 text-slate-300 hover:text-white flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-col md:flex-row gap-10 items-end animate-slide-up">
             {/* Floating Poster */}
             <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transform hover:scale-105 transition-transform duration-500 bg-slate-900">
                <PosterImage src={movie.imageUrl} title={movie.title} className="w-full h-auto" />
             </div>

             <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  {movie.genre.map((g, i) => (
                    <span key={i} className="text-xs font-bold tracking-widest uppercase text-white bg-white/10 border border-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      {g}
                    </span>
                  ))}
                  <span className="text-slate-300 font-medium px-2">•</span>
                  <span className="text-slate-200 font-medium">{movie.year}</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[0.9] tracking-tight text-shadow-lg">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3 bg-black/30 backdrop-blur rounded-lg px-4 py-2 border border-white/5">
                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                    <span className="text-3xl font-bold text-white">{movie.rating}</span>
                    <span className="text-slate-400 text-sm mt-1">/ 10</span>
                  </div>
                  
                  {/* User Rating Interactive */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Rating</span>
                    <StarRating 
                        initialRating={userRating} 
                        onRate={(r) => rateMovie(movie.id, movie.title, r)} 
                        size={24}
                    />
                  </div>
                </div>

                <div className="pt-2">
                   <Button 
                     onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                     variant={inWatchlist ? 'secondary' : 'primary'}
                     className="min-w-[200px]"
                   >
                      {inWatchlist ? <BookmarkCheck className="mr-2" /> : <Bookmark className="mr-2" />}
                      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-rose-500 pl-4">The Plot</h3>
            <p className="text-slate-300 leading-8 text-lg font-light tracking-wide">
              {movie.plot}
            </p>
          </section>

          <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-violet-500 pl-4">
               <Users size={20} className="text-violet-400" /> Top Cast
            </h3>
            {loading ? <div className="h-12 bg-slate-800/50 rounded animate-pulse w-full"></div> : (
              <div className="flex flex-wrap gap-4">
                {movie.cast?.map((actor, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-700 px-5 py-3 rounded-xl text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors cursor-default">
                    {actor}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
             <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">Critical Reception</h3>
             {loading ? (
               <div className="grid gap-4">
                 {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-800/30 rounded-xl animate-pulse"></div>)}
               </div>
             ) : (
                <div className="grid gap-6">
                  {movie.criticReviews?.map((review, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                       <Quote className="absolute top-4 right-4 text-white/5 w-12 h-12 rotate-180" />
                       <p className="text-slate-300 italic mb-4 text-lg font-light relative z-10">"{review.snippet}"</p>
                       <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                          <span className="font-bold text-rose-400 tracking-wide uppercase">{review.source}</span>
                          {review.score && <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">{review.score}</span>}
                       </div>
                    </div>
                  ))}
                  {(!movie.criticReviews || movie.criticReviews.length === 0) && (
                    <p className="text-slate-500 italic">No reviews currently available.</p>
                  )}
                </div>
             )}
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
           <div className="glass rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MonitorPlay size={20} className="text-rose-500" /> Streaming On
              </h3>
              {loading ? <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-8 bg-slate-800 rounded animate-pulse"></div>)}</div> : (
                <ul className="space-y-3">
                  {movie.watchProviders?.map((provider, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-200 bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      {provider}
                    </li>
                  ))}
                  {(!movie.watchProviders || movie.watchProviders.length === 0) && (
                     <li className="text-slate-500 text-sm">Stream availability unknown.</li>
                  )}
                </ul>
              )}
           </div>

           <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2 text-slate-400 text-xs uppercase tracking-widest">Directed By</h3>
              <p className="text-white text-xl font-semibold">{movie.director || "Unknown"}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
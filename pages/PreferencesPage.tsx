import React from 'react';
import { useApp } from '../contexts/AppContext';
import { StarRating } from '../components/StarRating';
import { getRecommendations } from '../services/geminiService';
import { Movie, RatedMovieData } from '../types';
import { Button } from '../components/Button';
import { RefreshCw, Star, Heart } from 'lucide-react';
import { PosterImage } from '../components/PosterImage';
import { useNavigate } from 'react-router-dom';

export const PreferencesPage = () => {
  const { ratings, rateMovie } = useApp();
  const [moviesToRate, setMoviesToRate] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const fetchRandomMovies = async () => {
    setLoading(true);
    const randomGenres = ['Action', 'Comedy', 'Drama', 'Sci-Fi'];
    const movies = await getRecommendations(randomGenres);
    setMoviesToRate(movies);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchRandomMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row items-end gap-6 justify-between animate-fade-in">
        <div>
           <div className="flex items-center gap-3 mb-2 text-rose-500">
             <Heart size={24} />
             <span className="text-sm font-bold tracking-widest uppercase">Personalization</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
             Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Preferences</span>
           </h1>
           <p className="text-slate-400 text-lg mt-4 max-w-2xl">
             Teach our AI what you love. Rate movies to refine your recommendations profile.
           </p>
        </div>
        <Button onClick={fetchRandomMovies} variant="outline" isLoading={loading} className="shrink-0">
          <RefreshCw size={16} className="mr-2" /> Load New Movies
        </Button>
      </div>

      <div className="space-y-16">
        {/* Rating Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 text-sm font-bold">1</span>
             Rate These Movies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moviesToRate.map((movie) => {
              // Access score safely from new structure
              const currentRating = ratings[movie.id]?.score || 0;
              return (
                <div 
                  key={movie.id} 
                  onClick={() => handleMovieClick(movie)}
                  className="bg-vista-card border border-slate-800 p-5 rounded-2xl flex gap-5 items-start hover:bg-slate-900 hover:border-slate-700 transition-all shadow-lg cursor-pointer group"
                >
                  <div className="w-20 h-28 flex-shrink-0 bg-slate-900 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    <PosterImage 
                        src={movie.imageUrl} 
                        title={movie.title} 
                        className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-lg mb-1 truncate group-hover:text-rose-400 transition-colors">{movie.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 font-mono">{movie.year}</p>
                    
                    <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                       <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Tap stars to rate</span>
                       <StarRating 
                         initialRating={currentRating} 
                         onRate={(r) => rateMovie(movie.id, movie.title, r)}
                         size={22}
                       />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* History Section */}
        <section className="bg-slate-900/30 rounded-3xl p-8 border border-slate-800">
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <span className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-sm font-bold">2</span>
             Your Rating History
           </h2>
           
           {Object.keys(ratings).length === 0 ? (
               <div className="text-center py-8 text-slate-500">
                 <Star size={32} className="mx-auto mb-3 opacity-20" />
                 <p>You haven't rated any movies yet.</p>
               </div>
           ) : (
               <div className="flex flex-wrap gap-3">
                  {Object.entries(ratings).map(([id, data]) => {
                      const ratingData = data as RatedMovieData;
                      return (
                      <div key={id} className="bg-slate-950 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-3 shadow-sm hover:border-slate-600 transition-colors">
                        <span className="text-slate-300 text-sm font-medium">{ratingData.title}</span>
                        <div className="w-px h-3 bg-slate-800"></div>
                        <span className="text-yellow-500 font-bold flex items-center gap-1 text-sm">
                            <Star size={12} className="fill-yellow-500" /> {ratingData.score}
                        </span>
                      </div>
                  )})}
               </div>
           )}
        </section>
      </div>
    </div>
  );
};
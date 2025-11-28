import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, RatedMovieData } from '../types';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AppContextType {
  // Auth
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  // Data
  watchlist: Movie[];
  ratings: Record<string, RatedMovieData>; // movieId -> { score, title }
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  rateMovie: (movieId: string, title: string, rating: number) => void;
  
  // Transient state (for Recommendations page)
  currentRecommendations: Movie[];
  setRecommendations: (movies: Movie[]) => void;
  
  // Helpers
  isLoggedIn: boolean; // Computed property for backward compatibility with Layout
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatedMovieData>>({});
  const [currentRecommendations, setRecommendations] = useState<Movie[]>([]);

  // 1. Handle Auth State Changes
  useEffect(() => {
    // Only use onAuthStateChange to drive state to avoid race conditions/double fetching
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setWatchlist([]);
        setRatings({});
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch Watchlist
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('watchlist')
        .select('movie_data')
        .eq('user_id', userId);

      if (watchlistError) throw watchlistError;
      
      if (watchlistData) {
        setWatchlist(watchlistData.map((row: any) => row.movie_data));
      }

      // Fetch Ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('movie_id, score, title')
        .eq('user_id', userId);

      if (ratingsError) throw ratingsError;

      if (ratingsData) {
        const ratingsMap: Record<string, RatedMovieData> = {};
        ratingsData.forEach((row: any) => {
          ratingsMap[row.movie_id] = { score: row.score, title: row.title };
        });
        setRatings(ratingsMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auth Actions
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRecommendations([]);
  };

  // Data Actions
  const addToWatchlist = async (movie: Movie) => {
    if (!user) return;
    
    const prevWatchlist = [...watchlist];

    // Optimistic Update
    setWatchlist((prev) => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });

    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      movie_id: movie.id,
      movie_data: movie
    });

    if (error) {
      console.error('Error adding to watchlist:', error);
      setWatchlist(prevWatchlist); // Revert
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    if (!user) return;

    const prevWatchlist = [...watchlist];

    // Optimistic Update
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId);

    if (error) {
      console.error('Error removing from watchlist:', error);
      setWatchlist(prevWatchlist); // Revert
    }
  };

  const rateMovie = async (movieId: string, title: string, rating: number) => {
    if (!user) return;

    const prevRatings = { ...ratings };

    // Optimistic Update
    setRatings((prev) => ({
      ...prev,
      [movieId]: { score: rating, title: title }
    }));

    const { error } = await supabase.from('ratings').upsert({
      user_id: user.id,
      movie_id: movieId,
      title: title,
      score: rating
    }, { onConflict: 'user_id,movie_id' });

    if (error) {
      console.error('Error rating movie:', error);
      setRatings(prevRatings); // Revert
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        signup,
        logout,
        watchlist,
        ratings,
        addToWatchlist,
        removeFromWatchlist,
        rateMovie,
        currentRecommendations,
        setRecommendations,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
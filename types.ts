export interface Movie {
  id: string; // generated UUID or hash
  title: string;
  year: string;
  genre: string[];
  plot: string;
  rating?: string; // e.g., "8.5/10"
  director?: string;
  cast?: string[];
  criticReviews?: Review[];
  watchProviders?: string[];
  imageUrl?: string;
}

export interface Review {
  source: string;
  snippet: string;
  score?: string;
}

export interface RatedMovieData {
  score: number;
  title: string;
}

export interface UserPreferences {
  watchedMovies: Record<string, RatedMovieData>; // movieId -> { score, title }
  watchlist: Movie[];
}

export interface GenreOption {
  id: string;
  label: string;
}

export const AVAILABLE_GENRES: GenreOption[] = [
  { id: 'action', label: 'Action' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'animation', label: 'Animation' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'crime', label: 'Crime' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'drama', label: 'Drama' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'horror', label: 'Horror' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'romance', label: 'Romance' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'western', label: 'Western' },
];
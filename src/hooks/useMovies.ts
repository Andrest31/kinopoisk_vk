// src/hooks/useMovies.ts
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, type Movie } from '../api/kinopoisk';

interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  hasMore: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 50,
          'genres.name': searchParams.get('genre') || undefined,
          year: searchParams.get('year') || undefined,
          'rating.kp': searchParams.get('rating') || undefined,
        };

        const { docs } = await getMovies(params);
        setMovies(prev => [...prev, ...docs]);
        setHasMore(docs.length > 0);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, searchParams]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [searchParams]);

  return { movies, loading, hasMore, setPage };
}
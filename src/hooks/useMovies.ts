import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, type Movie } from '../api/kinopoisk';

interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  hasMore: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

interface MoviesApiParams {
  page: number;
  limit: number;
  genres?: string[];
  year?: string;
  'rating.kp'?: string;
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
        // Формируем параметры запроса в правильном формате
        const params: MoviesApiParams = {
          page,
          limit: 50
        };

        // Добавляем жанры в виде массива
        const genres = searchParams.getAll('genre');
        if (genres.length > 0) {
          params.genres = genres;
        }

        // Добавляем рейтинг если есть
        const rating = searchParams.get('rating');
        if (rating) {
          params['rating.kp'] = rating;
        }

        // Добавляем годы если есть
        const years = searchParams.get('years');
        if (years) {
          params.year = years;
        }

        // Делаем запрос с правильными параметрами
        const { docs } = await getMovies(params);
        
        setMovies(prev => page === 1 ? docs : [...prev, ...docs]);
        setHasMore(docs.length > 0);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, searchParams]);

  // Сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [searchParams]);

  return { movies, loading, hasMore, setPage };
}
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
        // Получаем параметры из URL
        const genreParams = searchParams.getAll('genre');
        const ratingParam = searchParams.get('rating');
        const yearsParam = searchParams.get('years');

        // Формируем параметры запроса
        const params: Record<string, string | string[]> = {
          page: page.toString(),
          limit: '50'
        };

        // Добавляем жанры, если они есть
        if (genreParams.length > 0) {
          params['genres.name'] = genreParams;
        }

        // Добавляем рейтинг (формат "min-max")
        if (ratingParam) {
          params['rating.kp'] = ratingParam;
        }

        // Добавляем годы (формат "start-end")
        if (yearsParam) {
          const [start, end] = yearsParam.split('-');
          params['releaseYears.start'] = start;
          params['releaseYears.end'] = end;
        }

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
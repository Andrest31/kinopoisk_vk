import { useCallback, useRef } from 'react';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard/MovieCard';
import styles from './styles.module.css';
import type { Movie } from '../../api/kinopoisk';

// Функция для преобразования данных API в ожидаемый формат
const transformMovieData = (movie: Movie) => ({
  id: movie.id,
  title: movie.name || movie.alternativeName || movie.enName || 'Без названия',
  year: movie.year || 0,
  rating: movie.rating?.kp || 0,
  poster: movie.poster?.url || movie.poster?.previewUrl || '/placeholder-poster.jpg',
  genres: movie.genres?.map(g => g.name) || [],
  description: movie.description || movie.shortDescription || '',
});

export default function Home() {
  const { movies, loading, hasMore, setPage } = useMovies();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Преобразуем данные из API в нужный формат
  const transformedMovies = movies.map(transformMovieData);

  // Обработчик для бесконечного скролла
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage: number) => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, setPage]);

  if (transformedMovies.length === 0 && !loading) {
    return <div>Фильмы не найдены. Попробуйте изменить параметры поиска.</div>;
  }

  return (
    <div className={styles.movieList}>
      {transformedMovies.map((movie, index: number) => (
        <div 
          key={movie.id} 
          ref={index === transformedMovies.length - 1 ? lastMovieElementRef : null}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
      {loading && <div className={styles.loading}>Загрузка...</div>}
    </div>
  );
}
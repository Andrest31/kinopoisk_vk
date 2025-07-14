import { useCallback, useRef } from 'react';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard/MovieCard';
import styles from './styles.module.css';
import type { Movie } from '../../api/kinopoisk';

// Функция для преобразования данных API в полный формат Movie
const transformMovieData = (movie: Movie): Movie => ({
  id: movie.id,
  name: movie.name,
  alternativeName: movie.alternativeName,
  enName: movie.enName,
  year: movie.year || 0,
  rating: movie.rating || { kp: 0 },
  poster: movie.poster || { url: '/empty.png' },
  genres: movie.genres || [],
  countries: movie.countries || [],
  description: movie.description || movie.shortDescription || '',
  shortDescription: movie.shortDescription,
  movieLength: movie.movieLength,
  ageRating: movie.ageRating,
  videos: movie.videos,
  persons: movie.persons
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
    return <div className={styles.notFound}>Фильмы не найдены. Попробуйте изменить параметры поиска.</div>;
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
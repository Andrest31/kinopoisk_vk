import { useEffect, useState } from 'react';
import type { Movie } from '../../data/movies';
import MovieCard from '../../components/MovieCard/MovieCard';
import styles from './styles.module.css';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteMovies');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранное</h1>
      {favorites.length > 0 ? (
        <div className={styles.movieList}>
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Нет избранных фильмов</p>
      )}
    </div>
  );
}
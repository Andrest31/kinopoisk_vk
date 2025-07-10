import { Link } from 'react-router-dom';
import { mockMovies } from '../../data/movies';
import MovieCard from '../../components/MovieCard/MovieCard';
import styles from './styles.module.css';

export default function Home() {
  return (
    <div className={styles.appContainer}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>Фильмы</h1>
        <Link to="/favorites" className={styles.favoritesLink}>
          Избранное
        </Link>
      </div>
      <div className={styles.movieList}>
        {mockMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
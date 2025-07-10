import { Link } from 'react-router-dom';
import type { Movie } from '../../data/movies';
import styles from './styles.module.css';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onRemoveFavorite?: (id: number) => void;
}

export default function MovieCard({ movie, isFavorite = false, onRemoveFavorite }: MovieCardProps) {
  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrapper}>
          <img 
            src={movie.poster} 
            alt={movie.title}
            className={styles.poster}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          <div className={styles.genres}>
            {movie.genres.slice(0, 2).map(genre => (
              <span key={genre} className={styles.genre}>{genre}</span>
            ))}
          </div>
          <div className={styles.meta}>
            <span className={styles.year}>{movie.year}</span>
            <span className={styles.rating}>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      {isFavorite && onRemoveFavorite && (
        <button 
          className={styles.removeButton}
          onClick={(e) => {
            e.preventDefault();
            onRemoveFavorite(movie.id);
          }}
          aria-label="Удалить из избранного"
        >
          ×
        </button>
      )}
    </div>
  );
}
// src/components/MovieCard/MovieCard.tsx
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster?: string;
    genres?: string[];
    description?: string;
  };
  isFavorite?: boolean;
  onRemoveFavorite?: (id: number) => void;
}

export default function MovieCard({ movie, isFavorite = false, onRemoveFavorite }: MovieCardProps) {
  // Обеспечиваем безопасный доступ к жанрам
  const genres = movie.genres || [];
  
  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrapper}>
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={movie.title}
              className={styles.poster}
              
            />
          ) : (
            <div className={`${styles.poster} ${styles.noPoster}`}>
              <span>Нет постера</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          {genres.length > 0 && (
            <div className={styles.genres}>
              {genres.slice(0, 2).map((genre, index) => (
                <span key={index} className={styles.genre}>{genre}</span>
              ))}
            </div>
          )}
          <div className={styles.meta}>
            <span className={styles.year}>{movie.year}</span>
            <span className={styles.rating}>{movie.rating?.toFixed(1) || '0.0'}</span>
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
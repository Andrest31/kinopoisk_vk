import { Link } from 'react-router-dom';
import type { Movie } from '../../data/movies';
import styles from './styles.module.css';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.card}>
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
          {movie.genres.length > 2 && (
            <span className={styles.genre}>+{movie.genres.length - 2}</span>
          )}
        </div>
        <div className={styles.meta}>
          <span className={styles.year}>{movie.year}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.rating}>{movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
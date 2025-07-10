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
        <div className={styles.meta}>
          <span className={styles.year}>{movie.year}</span>
          <span className={styles.rating}>{movie.rating}</span>
        </div>
      </div>
    </Link>
  );
}
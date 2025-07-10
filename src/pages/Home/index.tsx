import useFilteredMovies from '../../hooks/useFilteredMovies';
import MovieCard from '../../components/MovieCard/MovieCard';
import styles from './styles.module.css';

export default function Home() {
  const filteredMovies = useFilteredMovies();

  return (
    <div className={styles.movieList}>
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
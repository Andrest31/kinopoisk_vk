import { Link } from "react-router-dom";
import styles from "./styles.module.css";

interface MovieCardProps {
  movie: {
    id: number;
    title: string | { name?: string }; // Может быть объектом или строкой
    year: number;
    rating: number | { kp?: number }; // Рейтинг может быть числом или объектом
    poster?: string;
    genres?: string[] | { name: string }[]; // Жанры могут быть массивом строк или объектов
    description?: string;
  };
  isFavorite?: boolean;
  onRemoveFavorite?: (id: number) => void;
}

export default function MovieCard({
  movie,
  isFavorite = false,
  onRemoveFavorite,
}: MovieCardProps) {
  // Нормализуем название фильма
  const getTitle = () => {
    if (typeof movie.title === "string") {
      return movie.title;
    } else if (movie.title && typeof movie.title === "object" && "name" in movie.title) {
      return (movie.title as { name?: string }).name || "Без названия";
    }
    return "Без названия";
  };

  // Нормализуем жанры
  const getGenres = (): string[] => {
    if (!movie.genres) return [];
    return movie.genres.map((genre) =>
      typeof genre === "object" ? genre.name : genre
    );
  };

  // Нормализуем рейтинг
  const getRating = (): string => {
    let ratingValue: number | undefined;

    if (typeof movie.rating === "number") {
      ratingValue = movie.rating;
    } else if (typeof movie.rating === "object" && movie.rating?.kp !== undefined) {
      ratingValue = movie.rating.kp;
    }

    return ratingValue?.toFixed(1) ?? "0.0";
  };

  const genres = getGenres();

  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrapper}>
          {movie.poster ? (
            <img src={movie.poster} alt={getTitle()} className={styles.poster} />
          ) : (
            <div className={`${styles.poster} ${styles.noPoster}`}>
              <span>Нет постера</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{getTitle()}</h3>
          {genres.length > 0 && (
            <div className={styles.genres}>
              {genres.slice(0, 2).map((genre, index) => (
                <span key={index} className={styles.genre}>
                  {genre}
                </span>
              ))}
            </div>
          )}
          <div className={styles.meta}>
            <span className={styles.year}>{movie.year}</span>
            <span className={styles.rating}>{getRating()}</span>
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
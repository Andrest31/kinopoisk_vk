import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import type { Movie } from "../../api/kinopoisk";

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onRemoveFavorite?: (id: number) => void;
}

export default function MovieCard({
  movie,
  isFavorite = false,
  onRemoveFavorite,
}: MovieCardProps) {
  const getTitle = () => {
    return movie.name ?? movie.alternativeName ?? movie.enName ?? "Без названия";
  };

  const getPoster = () => {
    if (typeof movie.poster === "string") return movie.poster;
    return movie.poster?.url || movie.poster?.previewUrl;
  };

  const getGenres = () => {
    return movie.genres?.map(g => g.name) || [];
  };

  const getRating = () => {
    return movie.rating?.kp?.toFixed(1) || "0.0";
  };

  const getYear = () => {
    return movie.year || "—";
  };

  const genres = getGenres();
  const title = getTitle();
  const poster = getPoster();
  const rating = getRating();
  const year = getYear();

  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
        <div className={styles.posterWrapper}>
          <img
            src={poster}
            alt={title}
            className={styles.poster}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-poster.jpg";
            }}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
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
            <span className={styles.year}>{year}</span>
            <span className={styles.rating}>{rating}</span>
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
          title="Удалить из избранного"
        >
          ×
        </button>
      )}
    </div>
  );
}
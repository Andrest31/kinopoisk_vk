import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./styles.module.css";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster?: string;
  genres?: string[];
  description?: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem("favoriteMovies");
        if (saved) {
          const parsed: Partial<Movie>[] = JSON.parse(saved);
          // Нормализуем данные, гарантируя наличие всех обязательных полей
          const normalizedFavorites = parsed.map((movie) => ({
            id: movie.id || 0,
            title: movie.title || 'Без названия',
            year: movie.year || 0,
            rating: movie.rating || 0,
            poster: movie.poster,
            genres: movie.genres,
            description: movie.description
          }));
          setFavorites(normalizedFavorites as Movie[]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();

    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранное</h1>
      {favorites.length > 0 ? (
        <div className={styles.movieList}>
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Нет избранных фильмов</p>
      )}
    </div>
  );
}
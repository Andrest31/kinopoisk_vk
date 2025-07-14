import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./styles.module.css";
import type { Movie } from "../../api/kinopoisk";

const FAVORITES_KEY = "favoriteMovies";

const normalizeFavorites = (movies: unknown): Movie[] => {
  if (!Array.isArray(movies)) {
    console.warn("Данные избранного не являются массивом");
    return [];
  }

  return movies.map((item) => {
    const movie = item.movie || item;
    
    // Обработка постера
    const posterUrl = typeof movie.poster === "string" 
      ? movie.poster 
      : movie.poster?.url || movie.poster?.previewUrl || "/empty.png";

    return {
      id: movie.id,
      name: movie.name || "Без названия",
      alternativeName: movie.alternativeName,
      enName: movie.enName,
      year: movie.year || 0,
      rating: movie.rating || { kp: 0 },
      poster: posterUrl,
      genres: movie.genres || [],
      countries: movie.countries || [],
      description: movie.description || "",
      shortDescription: movie.shortDescription,
      movieLength: movie.movieLength,
      ageRating: movie.ageRating,
      videos: movie.videos,
      persons: movie.persons
    };
  });
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log("Raw data from localStorage:", parsed);
          const normalized = normalizeFavorites(parsed);
          console.log("Normalized data:", normalized);
          setFavorites(normalized);
        }
      } catch (error) {
        console.error("Ошибка при загрузке избранных фильмов:", error);
      }
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((m) => m.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
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
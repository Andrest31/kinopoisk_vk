import { useEffect, useState } from "react";
import type { Movie } from "../../data/movies";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./styles.module.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem("favoriteMovies");
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log("Loaded favorites:", parsed); // Добавим лог для отладки
          setFavorites(parsed);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();

    // Добавим обработчик для обновления при изменениях из других вкладок
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

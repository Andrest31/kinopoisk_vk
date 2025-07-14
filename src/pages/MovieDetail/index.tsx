import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "../../api/kinopoisk";
import AddToFavoritesModal from "../../components/AddModal";
import styles from "./styles.module.css";

// src/types/movie.ts
export interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  enName?: string;
  type?: string;
  year: number;
  description?: string;
  shortDescription?: string;
  slogan?: string;
  rating?: {
    kp?: number;
    imdb?: number;
    filmCritics?: number;
    russianFilmCritics?: number;
    await?: number;
  };
  votes?: {
    kp?: string;
    imdb?: number;
    filmCritics?: number;
    russianFilmCritics?: number;
    await?: number;
  };
  movieLength?: number;
  ageRating?: number;
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  backdrop?: {
    url?: string;
    previewUrl?: string;
  };
  genres?: Array<{ name: string }>;
  countries?: Array<{ name: string }>;
  persons?: Array<{
    id: number;
    photo?: string;
    name?: string;
    enName?: string;
    description?: string;
    profession?: string;
  }>;
  videos?: {
    trailers?: Array<{
      url: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  premiere?: {
    world?: string;
    russia?: string;
    country?: string;
  };
  budget?: {
    value?: number;
    currency?: string;
  };
  fees?: {
    world?: {
      value?: number;
      currency?: string;
    };
  };
  similarMovies?: Array<{
    id: number;
    name?: string;
    poster?: {
      url?: string;
    };
    rating?: {
      kp?: number;
    };
  }>;
  watchability?: {
    items?: Array<{
      name?: string;
      logo?: {
        url?: string;
      };
      url?: string;
    }>;
  };
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "cast" | "media">(
    "about"
  );

  // Загрузка данных фильма
  useEffect(() => {
    if (!id) {
      setError("ID фильма не указан");
      setLoading(false);
      return;
    }

    const loadMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(parseInt(id));
        setMovie(movieData as Movie);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки фильма:", err);
        setError("Не удалось загрузить информацию о фильме");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  // Проверка, есть ли фильм в избранном
  useEffect(() => {
    if (!movie) return;

    const checkIsFavorite = () => {
      try {
        const favoritesStr = localStorage.getItem("favoriteMovies") || "[]";
        const favorites: Movie[] = JSON.parse(favoritesStr);
        setIsFavorite(favorites.some((fav) => fav.id === movie.id));
      } catch (error) {
        console.error("Ошибка проверки избранного:", error);
      }
    };

    checkIsFavorite();
    window.addEventListener("storage", checkIsFavorite);
    return () => window.removeEventListener("storage", checkIsFavorite);
  }, [movie]);

  const handleAddToFavorites = () => setShowModal(true);

  const handleRemoveFromFavorites = () => {
    if (!movie) return;

    try {
      const favoritesStr = localStorage.getItem("favoriteMovies") || "[]";
      const favorites: Movie[] = JSON.parse(favoritesStr);
      const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
      localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } catch (error) {
      console.error("Ошибка удаления из избранного:", error);
    }
  };

  const confirmAddToFavorites = () => {
    if (!movie) return;

    try {
      const favoritesStr = localStorage.getItem("favoriteMovies") || "[]";
      const favorites: Movie[] = JSON.parse(favoritesStr);
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      setShowModal(false);
    } catch (error) {
      console.error("Ошибка добавления в избранное:", error);
    }
  };

  const cancelAddToFavorites = () => setShowModal(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Неизвестно";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return "Неизвестно";

    // Определяем допустимые коды валют
    const validCurrencies = ["USD", "EUR", "RUB", "GBP", "JPY"];
    const currencyCode =
      currency && validCurrencies.includes(currency.toUpperCase())
        ? currency.toUpperCase()
        : "USD"; // Значение по умолчанию

    try {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(value);
    } catch (error) {
      console.error("Ошибка форматирования валюты:", error);
      return `${value} ${currency || "USD"}`; // Fallback формат
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка информации о фильме...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.notFound}>
        <h2>{error || "Фильм не найден"}</h2>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Вернуться назад
        </button>
      </div>
    );
  }

  const mainTrailer = movie.videos?.trailers?.find((t) => t.type === "TRAILER");
  const actors = movie.persons
    ?.filter((p) => p.profession === "актеры")
    .slice(0, 6);
  const directors = movie.persons
    ?.filter((p) => p.profession === "режиссеры")
    .slice(0, 2);

  return (
    <div className={styles.moviePage}>
      {/* Hero секция с бэкграундом и основной информацией */}
      <div
        className={styles.heroSection}
        style={{
          backgroundImage: movie.backdrop?.url
            ? `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.backdrop.url})`
            : "linear-gradient(to bottom, #1a1a1a, #2a2a2a)",
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.posterContainer}>
            <img
              src={movie.poster?.url || "/empty.png"}
              alt={movie.name}
              className={styles.poster}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/empty.png";
              }}
            />
          </div>

          <div className={styles.mainInfo}>
            <h1 className={styles.title}>
              {movie.name}{" "}
              {movie.alternativeName && `(${movie.alternativeName})`}
            </h1>

            <div className={styles.metaInfo}>
              <span>{movie.year}</span>
              {movie.movieLength && (
                <span>
                  {Math.floor(movie.movieLength / 60)}ч {movie.movieLength % 60}
                  м
                </span>
              )}
              {movie.ageRating && <span>{movie.ageRating}+</span>}
              {movie.countries?.[0]?.name && (
                <span>{movie.countries[0].name}</span>
              )}
            </div>

            <div className={styles.ratings}>
              {movie.rating?.kp && (
                <div className={styles.ratingBlock}>
                  <span className={styles.ratingLabel}>Кинопоиск</span>
                  <span className={styles.ratingValue}>
                    {movie.rating.kp.toFixed(1)}
                  </span>
                </div>
              )}
              {movie.rating?.imdb && (
                <div className={styles.ratingBlock}>
                  <span className={styles.ratingLabel}>IMDb</span>
                  <span className={styles.ratingValue}>
                    {movie.rating.imdb.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {isFavorite ? (
                <button
                  className={styles.removeButton}
                  onClick={handleRemoveFromFavorites}
                >
                  ★ В избранном
                </button>
              ) : (
                <button
                  className={styles.favoriteButton}
                  onClick={handleAddToFavorites}
                >
                  + В избранное
                </button>
              )}

              {mainTrailer && (
                <a
                  href={mainTrailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trailerButton}
                >
                  ▶ Трейлер
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по табам */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "about" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("about")}
        >
          О фильме
        </button>
        <button
          className={`${styles.tab} ${activeTab === "cast" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("cast")}
        >
          Актеры и создатели
        </button>
        <button
          className={`${styles.tab} ${activeTab === "media" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("media")}
        >
          Медиа
        </button>
      </div>

      {/* Контент табов */}
      <div className={styles.tabContent}>
        {activeTab === "about" && (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Описание</h2>
              <p className={styles.description}>
                {movie.description ||
                  movie.shortDescription ||
                  "Описание отсутствует"}
              </p>
              {movie.slogan && (
                <p className={styles.slogan}>«{movie.slogan}»</p>
              )}
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Год производства</span>
                <span className={styles.detailValue}>{movie.year}</span>
              </div>

              {movie.premiere?.world && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Премьера в мире</span>
                  <span className={styles.detailValue}>
                    {formatDate(movie.premiere.world)}
                  </span>
                </div>
              )}

              {movie.premiere?.russia && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Премьера в России</span>
                  <span className={styles.detailValue}>
                    {formatDate(movie.premiere.russia)}
                  </span>
                </div>
              )}

              {movie.budget?.value && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Бюджет</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      movie.budget?.value,
                      movie.budget?.currency || "USD"
                    )}{" "}
                  </span>
                </div>
              )}

              {movie.fees?.world?.value && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Сборы в мире</span>
                  <span className={styles.detailValue}>
                    {formatCurrency(
                      movie.fees?.world?.value,
                      movie.fees?.world?.currency || "USD"
                    )}
                  </span>
                </div>
              )}

              {movie.movieLength && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Время</span>
                  <span className={styles.detailValue}>
                    {Math.floor(movie.movieLength / 60)}ч{" "}
                    {movie.movieLength % 60}м
                  </span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Жанры</h2>
                <div className={styles.genresList}>
                  {movie.genres.map((genre, index) => (
                    <span key={index} className={styles.genreTag}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "cast" && (
          <div className={styles.castSection}>
            {directors && directors.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>Режиссеры</h2>
                <div className={styles.personsGrid}>
                  {directors.map((person) => (
                    <div key={person.id} className={styles.personCard}>
                      <img
                        src={person.photo || "/no-avatar.jpg"}
                        alt={person.name}
                        className={styles.personPhoto}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/no-avatar.jpg";
                        }}
                      />
                      <h3 className={styles.personName}>{person.name}</h3>
                    </div>
                  ))}
                </div>
              </>
            )}

            {actors && actors.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>Актеры</h2>
                <div className={styles.personsGrid}>
                  {actors.map((person) => (
                    <div key={person.id} className={styles.personCard}>
                      <img
                        src={person.photo || "/no-avatar.jpg"}
                        alt={person.name}
                        className={styles.personPhoto}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/no-avatar.jpg";
                        }}
                      />
                      <h3 className={styles.personName}>{person.name}</h3>
                      {person.description && (
                        <p className={styles.personRole}>
                          {person.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "media" && (
          <div className={styles.mediaSection}>
            {mainTrailer && (
              <>
                <h2 className={styles.sectionTitle}>Трейлер</h2>
                <div className={styles.videoContainer}>
                  <iframe
                    width="100%"
                    height="500"
                    src={`https://www.youtube.com/embed/${mainTrailer.url.split("v=")[1]}`}
                    title={mainTrailer.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            )}

            {movie.similarMovies && movie.similarMovies.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>Похожие фильмы</h2>
                <div className={styles.similarMovies}>
                  {movie.similarMovies.slice(0, 4).map((similar) => (
                    <div key={similar.id} className={styles.similarMovie}>
                      <img
                        src={similar.poster?.url || "/no-poster.jpg"}
                        alt={similar.name}
                        className={styles.similarPoster}
                      />
                      <h3 className={styles.similarTitle}>{similar.name}</h3>
                      {similar.rating?.kp && (
                        <span className={styles.similarRating}>
                          {similar.rating.kp.toFixed(1)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <AddToFavoritesModal
          movieTitle={movie.name}
          onConfirm={confirmAddToFavorites}
          onCancel={cancelAddToFavorites}
        />
      )}
    </div>
  );
}

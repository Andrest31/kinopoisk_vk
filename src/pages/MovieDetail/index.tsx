import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../../api/kinopoisk';
import AddToFavoritesModal from '../../components/AddModal';
import styles from './styles.module.css';

// Полный интерфейс для Movie
interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  enName?: string;
  year: number;
  rating?: {
    kp?: number;
    imdb?: number;
    filmCritics?: number;
    russianFilmCritics?: number;
    await?: number;
  };
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  genres?: Array<{ name: string }>;
  description?: string;
  shortDescription?: string;
  movieLength?: number;
  ageRating?: number;
  videos?: {
    trailers?: Array<{
      url?: string;
      name?: string;
      site?: string;
    }>;
  };
  persons?: Array<{
    id?: number;
    name?: string;
    photo?: string;
  }>;
}

// Интерфейс для преобразованных данных фильма
interface TransformedMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  genres: string[];
  description: string;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных фильма
  useEffect(() => {
    if (!id) {
      setError('ID фильма не указан');
      setLoading(false);
      return;
    }

    const loadMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(parseInt(id));
        setMovie(movieData);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки фильма:', err);
        setError('Не удалось загрузить информацию о фильме');
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
        const favoritesStr = localStorage.getItem('favoriteMovies') || '[]';
        const favorites: TransformedMovie[] = JSON.parse(favoritesStr);
        setIsFavorite(favorites.some(fav => fav.id === movie.id));
      } catch (error) {
        console.error('Ошибка проверки избранного:', error);
      }
    };

    checkIsFavorite();
    window.addEventListener('storage', checkIsFavorite);
    return () => window.removeEventListener('storage', checkIsFavorite);
  }, [movie]);

  // Преобразование данных API в нужный формат
  const transformMovieData = (movie: Movie): TransformedMovie => ({
    id: movie.id,
    title: movie.name || movie.alternativeName || movie.enName || 'Без названия',
    year: movie.year || 0,
    rating: movie.rating?.kp || 0,
    poster: movie.poster?.url || movie.poster?.previewUrl || '/no-poster.jpg',
    genres: movie.genres?.map((g: { name: string }) => g.name) || [],
    description: movie.description || movie.shortDescription || 'Описание отсутствует',
  });

  const handleAddToFavorites = () => setShowModal(true);

  const handleRemoveFromFavorites = () => {
    if (!movie) return;
    
    try {
      const favoritesStr = localStorage.getItem('favoriteMovies') || '[]';
      const favorites: TransformedMovie[] = JSON.parse(favoritesStr);
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  const confirmAddToFavorites = () => {
    if (!movie) return;
    
    try {
      const favoritesStr = localStorage.getItem('favoriteMovies') || '[]';
      const favorites: TransformedMovie[] = JSON.parse(favoritesStr);
      const updatedFavorites = [...favorites, transformMovieData(movie)];
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      setShowModal(false);
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const cancelAddToFavorites = () => setShowModal(false);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !movie) {
    return (
      <div className={styles.notFound}>
        <p>{error || 'Фильм не найден'}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  const transformedMovie = transformMovieData(movie);

  return (
    <>
      <div className={styles.detailsContainer}>
        <div className={styles.posterContainer}>
          <img 
            src={transformedMovie.poster} 
            alt={transformedMovie.title} 
            className={styles.poster}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/no-poster.jpg';
            }}
          />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>
            {transformedMovie.title} ({transformedMovie.year})
          </h1>
          
          <div className={styles.rating}>
            <span className={styles.ratingValue}>
              {transformedMovie.rating.toFixed(1)}
            </span>
            <span className={styles.ratingMax}>/10</span>
          </div>
          
          {transformedMovie.genres.length > 0 && (
            <div className={styles.genres}>
              {transformedMovie.genres.map((genre: string) => (
                <span key={genre} className={styles.genreTag}>{genre}</span>
              ))}
            </div>
          )}
          
          <p className={styles.description}>{transformedMovie.description}</p>
          
          {isFavorite ? (
            <button 
              className={styles.removeButton}
              onClick={handleRemoveFromFavorites}
            >
              Удалить из избранного
            </button>
          ) : (
            <button 
              className={styles.favoriteButton}
              onClick={handleAddToFavorites}
            >
              Добавить в избранное
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <AddToFavoritesModal
          movieTitle={transformedMovie.title}
          onConfirm={confirmAddToFavorites}
          onCancel={cancelAddToFavorites}
        />
      )}
    </>
  );
}
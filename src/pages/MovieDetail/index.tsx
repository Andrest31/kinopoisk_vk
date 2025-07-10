import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockMovies, type Movie } from '../../data/movies';
import AddToFavoritesModal from '../../components/AddModal';
import styles from './styles.module.css';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const movie = mockMovies.find(m => m.id.toString() === id);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    setIsFavorite(favorites.some((fav: Movie) => fav.id === movie?.id));
  }, [movie]);

  const handleAddToFavorites = () => {
    setShowModal(true);
  };

  const handleRemoveFromFavorites = () => {
    if (!movie) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const updatedFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    setIsFavorite(false);
  };

  const confirmAddToFavorites = () => {
    if (!movie) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const updatedFavorites = [...favorites, movie];
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    setIsFavorite(true);
    setShowModal(false);
  };

  const cancelAddToFavorites = () => {
    setShowModal(false);
  };

  if (!movie) {
    return (
      <div className={styles.notFound}>
        <p>Фильм не найден</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.detailsContainer}>
        <div className={styles.posterContainer}>
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className={styles.poster}
          />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{movie.title} ({movie.year})</h1>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>{movie.rating}</span>
            <span className={styles.ratingMax}>/10</span>
          </div>
          <div className={styles.genres}>
            {movie.genres.map(genre => (
              <span key={genre} className={styles.genreTag}>{genre}</span>
            ))}
          </div>
          <p className={styles.description}>{movie.description}</p>
          
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
          movieTitle={movie.title}
          onConfirm={confirmAddToFavorites}
          onCancel={cancelAddToFavorites}
        />
      )}
    </>
  );
}
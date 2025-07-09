// src/components/MovieCard.tsx
import React from 'react';
import type { Movie } from '../../data/movies';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-year">Год: {movie.year}</p>
        <p className="movie-rating">Рейтинг: {movie.rating}</p>
        {/* Можно добавить жанры, если захочешь, например:
        <p className="movie-genres">Жанры: {movie.genres.join(', ')}</p>
        */}
      </div>
    </div>
  );
};

export default MovieCard;
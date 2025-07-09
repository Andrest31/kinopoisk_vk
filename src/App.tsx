// src/App.tsx
import MovieCard from './components/MovieCard/MovieCard';
import { mockMovies } from './data/movies';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Фильмы</h1> {/* Более лаконичное название */}
      <div className="movie-list">
        {mockMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;
import { useSearchParams } from 'react-router-dom';
import { mockMovies } from '../data/movies';

export default function useFilteredMovies() {
  const [searchParams] = useSearchParams();
  
  const genre = searchParams.get('genre');
  const year = searchParams.get('year');
  const rating = searchParams.get('rating');

  const filteredMovies = mockMovies.filter(movie => {
    if (genre && !movie.genres.includes(genre)) return false;
    
    if (year) {
      const yearNum = parseInt(year);
      const movieYear = movie.year;
      if (
        (yearNum === 2020 && (movieYear < 2020 || movieYear > 2023)) ||
        (yearNum === 2010 && (movieYear < 2010 || movieYear > 2019)) ||
        (yearNum === 2000 && (movieYear < 2000 || movieYear > 2009)) ||
        (yearNum === 1990 && (movieYear < 1990 || movieYear > 1999))
      ) return false;
    }
    
    if (rating && movie.rating < parseFloat(rating)) return false;
    
    return true;
  });

  return filteredMovies;
}
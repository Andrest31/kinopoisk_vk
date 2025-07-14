// src/api/kinopoisk.ts
import axios from 'axios';

const API_BASE_URL = 'https://api.kinopoisk.dev/v1.4';
const API_TOKEN = '1M3478F-NN04PSZ-HVD4YYJ-EVZREKQ';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-KEY': API_TOKEN,
  },
});

// src/api/kinopoisk.ts
export interface Movie {
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
  genres?: { name: string }[];
  countries?: { name: string }[];
  description?: string;
  shortDescription?: string;
  movieLength?: number;
  ageRating?: number;
  videos?: {
    trailers?: {
      url?: string;
      name?: string;
      site?: string;
    }[];
  };
  persons?: {
    id?: number;
    name?: string;
    photo?: string;
  }[];
}

interface GetMoviesParams {
  page?: number;
  limit?: number;
  genres?: string[];
  year?: string;
  'rating.kp'?: string;
}

export const getMovies = async (params: GetMoviesParams): Promise<{ docs: Movie[] }> => {
  const queryParams = new URLSearchParams();
  
  // Обязательные параметры
  queryParams.set('page', (params.page || 1).toString());
  queryParams.set('limit', (params.limit || 50).toString());

  // Жанры
  if (params.genres && params.genres.length > 0) {
    params.genres.forEach((genre: string) => {
      queryParams.append('genres.name', genre);
    });
  }

  // Год
  if (params.year) {
    queryParams.set('year', params.year);
  }

  // Рейтинг
  if (params['rating.kp']) {
    queryParams.set('rating.kp', params['rating.kp']);
  }

  const response = await api.get(`/movie?${queryParams.toString()}`);
  return response.data;
};



export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};
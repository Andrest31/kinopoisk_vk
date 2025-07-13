// src/api/kinopoisk.ts
import axios from 'axios';

const API_BASE_URL = 'https://api.kinopoisk.dev/v1.4';
const API_TOKEN = 'FMD7AJJ-NTBMXFP-KZ74NYS-ZFY34D7';

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

export const getMovies = async (params: {
  page?: number;
  limit?: number;
  'genres.name'?: string;
  year?: string;
  'rating.kp'?: string;
}): Promise<{ docs: Movie[] }> => {
  const response = await api.get('/movie', {
    params: {
      page: params.page || 1,
      limit: params.limit || 50,
      ...params,
    },
  });
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};
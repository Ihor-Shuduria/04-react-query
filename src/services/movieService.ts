import axiosInstance from "./axiosInstance";
import type { Movie } from "../types/movie";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  const response = await axiosInstance.get<MoviesResponse>(
    "/search/movie",
    {
      params: {
        query,
        language: "uk-UA",
        page,
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );

  return response.data;
};

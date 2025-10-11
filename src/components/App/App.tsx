import { useState, useEffect } from "react";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import ReactPaginate from "react-paginate";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // --- React Query ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: !!searchQuery, // запускається лише якщо є запит
    retry: false, // щоб не дублювався запит при помилці
  });

  // --- Перевірка результатів після отримання даних ---
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  // --- Обробники ---
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}

      {data && data.results.length > 0 && (
        <>
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

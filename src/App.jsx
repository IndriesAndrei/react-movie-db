import './App.css'
import { useState } from 'react';
import Box from './components/Box';
import Loader from './components/Loader';
import Logo from './components/Logo';
import Main from './components/Main';
import MovieList from './components/MovieList';
import NavBar from './components/NavBar';
import NumResults from './components/NumResults';
import Search from './components/Search';
import WatchedMoviesList from './components/WatchedMoviesList';
import WatchedSummary from './components/WatchedSummary';
import ErrorMessage from './components/ErrorMessage';
import SelectedMovie from './components/SelectedMovie';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';

const KEY = '3c5a332b';

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  //calling our Custom Hook and destructure the returned object
  const {movies, isLoading, error} = useMovies(query);

  // custom hook and we are pssing in initial state as empty array here and we destructure state variables (watched and setWatched)
  const [watched, setWatched] = useLocalStorageState([], "watched");
  
  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter(movie => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}  />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? 
            ( <SelectedMovie 
                selectedId={selectedId} 
                onCloseMovie={handleCloseMovie} 
                onAddWatched={handleAddWatched}
                watched={watched}
              /> 
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
              </>
            )}
        </Box>
      </Main>
    </>
  );
}

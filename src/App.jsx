import './App.css'
import { useEffect, useState } from 'react';
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

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = '3c5a332b';

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function() {
    // get the values from localStorage with the saved key name
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  })

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

  useEffect(function() {
    // localStorage (key->value pairs available on the browser)
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);
  
  useEffect(function () {
    const controller = new AbortController();

    // ===== we can use fetch method to fetch all the movies ====
    // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
    //   .then((res) => res.json)
    //   .then((data) => setMovies(data.Search));

    // ==== we can use async await also ====
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});

        if (!res.ok) throw new Error("Something wen wrong while fetching movies");
        
        const data = await res.json();
        if (data.Response == 'False') throw new Error("Movie not found!");

        setMovies(data.Search);
        setError('');
      } catch (err) {
        console.error(err.message);
        if(err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if(query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    
    handleCloseMovie();
    fetchMovies();

    // cleanup function
    return function() {
      controller.abort();
    }
  }, [query]);

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

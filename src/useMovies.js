import { useState, useEffect } from "react";

const KEY = '3c5a332b';

// this is our custom hook
export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
        
        fetchMovies();
    
        // cleanup function
        return function() {
          controller.abort();
        }
      }, [query]);

      // we return movies, isLoading and error, that we will need outside our custom hook
      return {movies, isLoading, error}
}
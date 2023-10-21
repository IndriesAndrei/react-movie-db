import { useEffect, useReducer, useState } from "react";
import StarRating from './StarRating';
import Loader from "./Loader";
const KEY = '3c5a332b';

export default function SelectedMovie({selectedId, onCloseMovie, onAddWatched, watched}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');

    const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

    const {
        Title: title, 
        Year: year, 
        Poster: poster, 
        Runtime: runtime, 
        imdbRating, 
        Plot: plot, 
        Released: released, 
        Actors: actors, 
        Director: director, 
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title, 
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
        }
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    // each time this component mounts/renders
    useEffect(function() {
        async function getMovieDetails() {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [selectedId])

    useEffect(function() {
        if (!title) return;
        document.title = `Movie | ${title}`;

        // cleanup function 
        return function() {
            document.title = "React Movie App";
        }
    }, [title])

    useEffect(function() {
        function callback(e) {
            if(e.code === 'Escape') {
              onCloseMovie();
            }
        }

        document.addEventListener('keydown', callback);
        return function() {
            document.removeEventListener('keydown', callback);
        }
    }, [onCloseMovie])

    return (
        <div className="details">
            {isLoading ? <Loader /> 
            : 
            <>
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
                    <img src={poster} alt={`Poster of ${movie} movie`} />
                    <div className="details-overview">
                    <h2>{title}</h2>
                        <p>{released} &bull; {runtime}</p>
                        <p>{genre}</p>
                        <p><span>{imdbRating} IMDB rating</span></p>
                    </div>
                </header>

                <section>
                    <div className="rating">
                        {! isWatched ?  
                            <>
                                <StarRating maxRating={10} size={24} onSetRating={setUserRating} />

                                {userRating > 0 && (
                                    <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
                                )}
                            </>
                            : <p>You rated this movie {watchedUserRating}!</p> 
                        }
                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring: {actors}</p>
                    <p>Directed by: {director}</p>
                </section>
            </>
            }
        </div>
    )
}
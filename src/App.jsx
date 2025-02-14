import React from 'react'
import {useState, useEffect} from 'react';
import Search from "./components/search.jsx";
import { updateSearchCount} from "./appwrite.js";
import HashLoader from "react-spinners/HashLoader";
import MovieCard from "./components/MovieCard.jsx";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
// console.log('API Key:', API_KEY);

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isMovieLoading, setIsMovieLoading] = useState(false); // show loader to user

    const fetchMovies = async () => {
        setIsMovieLoading(true);
        setErrorMessage("");

        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            console.log(data);

            if (data.results === 'False') {
                setMovieList(data.Error || "Failed to fetch movies");
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

        } catch (error) {
            setErrorMessage(error.message);
            console.error(`Error is ${errorMessage}`);
        } finally {
            setIsMovieLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    return (
        <main>
           <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src='./hero-img.png' alt="Hero Banner" />
                    <h1> Find <span className={"text-gradient"}>
                        Movies
                    </span> You Will Enjoy Without the Hasstle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2 className={'pt-10'}>All Movies</h2>

                    {isMovieLoading ? (
                        <HashLoader />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={(movie.id)} movie={movie}/>
                            ))}
                        </ul>
                    )}
                    {errorMessage && <p>{errorMessage}</p>}

                </section>

            </div>
        </main>
    )
}
export default App

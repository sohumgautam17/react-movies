import React from 'react'
import {useState, useEffect} from 'react';
import Search from "./components/search.jsx";
import { updateSearchCount, getTrendingMovies} from "./appwrite.js";
import HashLoader from "react-spinners/HashLoader";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";


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
    const [trendingMovies, setTrendingMovies] = useState([]);

    const [ deBouncedSearchTerm, setDeBouncedSearchTerm ] = useState("");

    useDebounce(() => setDeBouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsMovieLoading(true);
        setErrorMessage("");

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();
            console.log("Fetched movies:", data);

            if (data.results === 'False') {
                setErrorMessage(data.Error || "Failed to fetch movies");
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                updateSearchCount(query, data.results[0]).catch(console.error);
            }

        } catch (error) {
            setErrorMessage(error.message);
            console.error(`Error in fetchMovies: ${error}`);
        } finally {
            setIsMovieLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        } catch (error){
            console.log(`The error is ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(deBouncedSearchTerm);
    }, [deBouncedSearchTerm])

    useEffect(() => {
        const fetchTrending = async () => {
            await loadTrendingMovies();
        };

        fetchTrending();
    }, []);
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

                { trendingMovies ? (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.id}>
                                    <p>{index +1}</p>
                                    <img src={movie.poster_url} alt="Movie cover" className="transition hover:scale-110"/>
                                </li>
                            ))}
                        </ul>
                    </section>
                ):
                    <div className="mt-6 py-4">
                        <p className="text-center text-gray-600">No trending movies available</p>
                        {/*<p className="text-center text-gray-600">Movies length: {trendingMovies.length}</p>*/}
                    </div>
                }

                <section className="all-movies">
                    <h2 className={'pt-10'}>All Movies</h2>
                    {isMovieLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <HashLoader color="#ad6fe8" size={50} />
                        </div>
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

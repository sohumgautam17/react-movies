import React from 'react'
import {useState, useEffect} from 'react';
import Search from "./components/search.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
console.log('API Key:', API_KEY);

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

    const fetchMovies = async () => {
        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw Error(response.statusText);
            }

            const data = await response.json();
            console.log(data.results);

        } catch (error) {
            setErrorMessage(error.message);
            console.log(`Error is ${errorMessage}`);

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
                    <h2>All Movies</h2>
                    {errorMessage && <p>{errorMessage}</p>}
                </section>

            </div>
        </main>
    )
}
export default App

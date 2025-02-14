import React from 'react'

const MovieCard = ({movie:
    {title, release_date, original_language, poster_path, vote_average}}
) => {
    return (
        <div className="movie-card">
            <img
                className={"cursor-pointer"}
                src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "./No-Poster.png"}
                alt={title}
            />
            <div className="mt-4">
                <h3>{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img
                            className={"cursor-pointer w-5"}
                            src={"./star.svg"}
                            alt={vote_average}
                        />
                        <p className={"ml-2"}>{vote_average ? <span>{vote_average.toFixed(1)}</span> : "N/A" }</p>
                    </div>
                    <span>○</span>

                    <p className={"lang"}>{original_language}</p>
                    <p className={"year"}>
                        {release_date.split("-")[0]}
                    </p>
                </div>

            </div>
        </div>
    )
}
export default MovieCard

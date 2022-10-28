import React, { useState } from "react"
import axios from "axios"
import { AnimeCard } from "./AnimeCard"
import { genre, bAnimeCard, anime } from "./types"

function App() {
  const [genres, setGenres] = useState<string>("")
  const [compareAnime, setCompareAnime] = useState<string>("")
  const [likeAnime, setLikeAnime] = useState<anime>()
  const [recommendations, setRecommendations] = useState<bAnimeCard[]>([])
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-gray-200",
    "bg-amber-200",
    "bg-lime-500",
    "bg-teal-300",
    "bg-violet-300",
    "bg-fuchsia-200",
    "bg-indigo-100",
    "bg-sky-200",
    "bg-emerald-100",
  ]

  const getRecommendations = async (
    genres: string,
    description: string | undefined
  ) => {
    try {
      const data = {
        genres: genres,
        description: description,
      }
      const request = await axios.post("http://127.0.0.1:8000/recommendations", data)
      setRecommendations(request.data)
    } catch (e) {
      console.log(e)
    }
  }

  const findAnime = async (
    anime: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault()
      const request = await axios.post("http://127.0.0.1:8000/anime", anime)
      setLikeAnime(request.data.data.Media)
    } catch (e) {
      console.log(e)
    }
  }

  const genreChoices: genre[] = [
    {
      label: "Action",
    },
    {
      label: "Comedy",
    },
    {
      label: "Romance",
    },
    {
      label: "Sports",
    },
    {
      label: "Slice of Life",
    },
    {
      label: "Sci-fi",
    },
    {
      label: "Drama",
    },
    {
      label: "Music",
    },
    {
      label: "Fantasy",
    },
  ]

  return (
    <div className="App flex flex-col h-screen gap-2 ">
      <form className="flex flex-col m-5">
        <label className="">
          {" "}
          Enter any Anime/Manga you like
          <input
            className="p-1 w-full border-solid border-2 border-indgo-600"
            value={compareAnime}
            onChange={(e) => setCompareAnime(e.target.value)}
            type="text"
          ></input>
        </label>
        {compareAnime !== "" ? (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="p-1 w-full border-solid border-2 border-indgo-600 hover:bg-gray-200 mt-2"
          >
            Find anime
          </button>
        ) : (
          ""
        )}
      </form>
      <div className="flex justify-center">
        {typeof likeAnime !== "undefined" ? (
          <AnimeCard
            description={likeAnime.description}
            key={likeAnime.id}
            id={likeAnime.id}
            title={likeAnime.title}
            averageScore={likeAnime.averageScore}
            coverImage={likeAnime.coverImage}
            col="bg-gray-200"
          />
        ) : (
          ""
        )}
      </div>
      <label className="m-2">
        {" "}
        Choose your favourite genre (animes ranked by TF-IDF similarity left to
        right){" "}
      </label>
      <select
        className="cursor-pointer mx-2 bg-pink-200 text-center hover:animate-pulse"
        name="genre-setter"
        onChange={(e) => setGenres(e.target.value)}
      >
        {genreChoices.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mx-2 bg-blue-500 text-center hover:animate-pulse">
        Currently selected genre: {genres}
      </div>{" "}
      <button
        onClick={() => getRecommendations(genres, likeAnime?.description)}
        className="recommend-me"
      >
        {typeof likeAnime !== "undefined" ? (
          <div className="mx-2 basis-1/2 bg-green-100 hover:animate-pulse">
            Recommend me!
          </div>
        ) : (
          ""
        )}
      </button>
      <div className="grid grid-cols-5 gap-4 mx-2">
        {typeof recommendations != "undefined"
          ? recommendations.map((anime) => (
              <AnimeCard
                key={anime.id}
                description={anime.description}
                id={anime.id}
                title={anime.title}
                averageScore={anime.averageScore}
                coverImage={anime.coverImage}
                col={colors[Math.floor(Math.random() * 11)]}
              />
            ))
          : ""}
      </div>
    </div>
  )
}

export default App

import React, { useState } from "react"
import axios from "axios"
import { AnimeCard } from "./AnimeCard"
import { genre, bAnimeCard } from "./types"

function App() {
  const [genres, setGenres] = useState<string>("")
  const [recommendations, setRecommendations] = useState<bAnimeCard[]>([])
  const colors = ["bg-red-200", "bg-blue-200", "bg-gray-200", "bg-yellow-200"]

  const getRecommendations = async (genres: string) => {
    try {
      const request = await axios.post(
        "http://127.0.0.1:5000/recommendations",
        genres
      )
      console.log("request data is:" + request.data.data.Page.media[0].title.romaji)
      setRecommendations(request.data.data.Page.media)
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
    <div className="App flex flex-col h-[40vh] gap-2 m-5">
      <select
        className="basis-1/4 cursor-pointer bg-pink-200 text-center hover:animate-pulse"
        name="genre-setter"
        onChange={(e) => setGenres(e.target.value)}
      >
        {genreChoices.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="basis-1/4 bg-blue-500 text-center hover:animate-pulse">
        Current genre: {genres}
      </div>{" "}
      <button onClick={() => getRecommendations(genres)} className="recommend-me">
        <div className=" basis-1/2 bg-green-100 hover:animate-pulse">
          Recommend me!
        </div>
      </button>
      <div className="grid grid-cols-5 gap-4">
        {typeof recommendations != "undefined"
          ? recommendations.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.title}
                popularity={anime.popularity}
                coverImage={anime.coverImage}
                col={colors[Math.floor(Math.random() * 3)]}
              />
            ))
          : ""}
      </div>
    </div>
  )
}

export default App

import React, { useState } from "react"
import axios from "axios"
import { AnimeCard } from "./AnimeCard"
import { genre, bAnimeCard, anime } from "./types"

function App() {
  const [genres, setGenres] = useState<string>("")
  const [compareAnime, setCompareAnime] = useState<string>("")
  const [likeAnime, setLikeAnime] = useState<anime>()
  const [recommendations, setRecommendations] = useState<bAnimeCard[]>([])
  const colors = ["bg-red-200", "bg-blue-200", "bg-gray-200", "bg-yellow-200"]

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
      console.log("request data is:" + request.data)
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
      console.log("request is :" + request.data.data.Media)
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
    <div className="App flex flex-col h-[40vh] gap-2 m-5">
      <form className="flex flex-col">
        <label className="">
          {" "}
          Enter any Anime/Manga you like
          <input
            className="w-full border-solid border-2 border-indgo-600"
            value={compareAnime}
            onChange={(e) => setCompareAnime(e.target.value)}
            type="text"
          ></input>
        </label>
        {compareAnime !== "" ? (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="border-solid border-2 border-indgo-600"
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
            popularity={likeAnime.popularity}
            coverImage={likeAnime.coverImage}
            col={colors[Math.floor(Math.random() * 3)]}
          />
        ) : (
          ""
        )}
      </div>
      <label>
        {" "}
        Choose your favourite genre (animes ranked by TF-IDF similarity left to
        right){" "}
      </label>
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
        Currently selected genre: {genres}
      </div>{" "}
      <button
        onClick={() => getRecommendations(genres, likeAnime?.description)}
        className="recommend-me"
      >
        {typeof likeAnime !== "undefined" ? (
          <div className=" basis-1/2 bg-green-100 hover:animate-pulse">
            Recommend me!
          </div>
        ) : (
          ""
        )}
      </button>
      <div className="grid grid-cols-5 gap-4">
        {typeof recommendations != "undefined"
          ? recommendations.map((anime) => (
              <AnimeCard
                key={anime.id}
                description={anime.description}
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

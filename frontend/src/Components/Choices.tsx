import axios from "axios"
import React, { useState } from "react"
import { BackendAnime, GenreOption, ChoicesProps } from "../types"
import AnimeCardMain from "./AnimeCardMain"

const API_BASE = process.env.REACT_APP_API_BASE || ""

const Choices: React.FC<ChoicesProps> = ({ getRecommendations }) => {
  const [genres, setGenres] = useState<string>("Action")
  const [compareAnime, setCompareAnime] = useState<string>("")
  const [likeAnime, setLikeAnime] = useState<BackendAnime | undefined>(undefined)

  const findAnime = async (
    animeName: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    if (!animeName.trim()) return

    try {
      const url = API_BASE ? `${API_BASE}/anime` : "/anime"
      const res = await axios.post(url, { search: animeName })
      setLikeAnime(res.data)
    } catch (e) {
      console.error("Failed to find anime:", e)
      setLikeAnime(undefined)
    }
  }

  const genreChoices: GenreOption[] = [
    { label: "Action" },
    { label: "Comedy" },
    { label: "Romance" },
    { label: "Sports" },
    { label: "Slice of Life" },
    { label: "Sci-fi" },
    { label: "Drama" },
    { label: "Music" },
    { label: "Fantasy" },
  ]

  const handleRecommend = () => {
    const desc = likeAnime?.description ?? ""
    getRecommendations(genres, desc)
  }

  return (
    <>
      {}
      <form className="mx-4 mt-5 mb-1">
        <input
          placeholder="Enter any Anime/Manga you like, e.g. Steins;Gate (can take up to minute to start the server due to free tier)"
          className="p-2 w-full border-solid border-2 border-indigo-600 rounded"
          value={compareAnime}
          onChange={(e) => setCompareAnime(e.target.value)}
          type="text"
        />

        {compareAnime !== "" && (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="p-1 w-full bg-violet-300 rounded hover:opacity-80 mt-2"
          >
            Find anime
          </button>
        )}
      </form>

      {}
      <div className="flex justify-center bg-gray">
        {likeAnime && (
          <AnimeCardMain
            key={likeAnime.id ?? likeAnime.title.romaji}
            id={likeAnime.id}
            title={likeAnime.title}
            description={likeAnime.description}
            averageScore={likeAnime.averageScore}
            coverImage={likeAnime.coverImage}
            siteUrl={likeAnime.siteUrl}
            genres={likeAnime.genres}
            col="bg-slate-200"
          />
        )}
      </div>

      {}
      {likeAnime && (
        <div className="mx-4">
          <select
            className="cursor-pointer p-2 rounded mt-2 bg-red-200 text-center hover:opacity-80 w-full"
            name="genre-setter"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
          >
            {genreChoices.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>

          <button onClick={handleRecommend} className="w-full mt-2">
            <div className="p-2 rounded bg-yellow-300 hover:opacity-70 text-center">
              Recommend me!
            </div>
          </button>
        </div>
      )}
    </>
  )
}

export default Choices

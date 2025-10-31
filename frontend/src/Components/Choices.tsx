// src/Components/Choices.tsx
import React, { useState } from "react"
import axios from "axios"
import AnimeCardMain from "./AnimeCardMain"
import { BackendAnime, GenreOption, ChoicesProps } from "../types"

const API_BASE = process.env.REACT_APP_API_BASE || ""

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

const sortChoices = [
  { label: "Score (high → low)", value: "SCORE_DESC" },
  { label: "Popularity", value: "POPULARITY_DESC" },
  { label: "Trending", value: "TRENDING_DESC" },
  { label: "Favourites", value: "FAVOURITES_DESC" },
]

const Choices: React.FC<ChoicesProps> = ({ getRecommendations }) => {
  const [genres, setGenres] = useState<string>("Action")
  const [sort, setSort] = useState<string>("SCORE_DESC")
  const [compareAnime, setCompareAnime] = useState<string>("")
  const [likeAnime, setLikeAnime] = useState<BackendAnime | undefined>(undefined)
  const [loadingAnime, setLoadingAnime] = useState(false)

  const findAnime = async (
    animeTitle: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event?.preventDefault()
    if (!animeTitle.trim()) return
    try {
      setLoadingAnime(true)
      const url = API_BASE ? `${API_BASE}/anime` : "/anime"
      const res = await axios.post(url, { search: animeTitle })
      setLikeAnime(res.data)
    } catch (e) {
      console.error("Failed to fetch anime:", e)
      setLikeAnime(undefined)
    } finally {
      setLoadingAnime(false)
    }
  }

  const handleRecommend = () => {
    const desc = likeAnime?.description ?? ""
    // ⬇️ send sort to parent
    getRecommendations(genres, desc, sort as any)
  }

  return (
    <>
      {/* search */}
      <form className="mx-4 mt-5 mb-1">
        <input
          placeholder="Enter any Anime/Manga you like, e.g. Steins;Gate"
          className="p-2 w-full border-solid border-2 border-indigo-600 rounded"
          value={compareAnime}
          onChange={(e) => setCompareAnime(e.target.value)}
          type="text"
        />

        {compareAnime !== "" && (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="p-1 w-full bg-violet-300 rounded hover:opacity-80 mt-2"
            disabled={loadingAnime}
          >
            {loadingAnime ? "Finding..." : "Find anime"}
          </button>
        )}
      </form>

      {/* genre + sort + recommend */}
      <div className="mx-4 flex flex-col gap-2 mb-2">
        <select
          className="cursor-pointer p-2 w-full rounded bg-red-200 text-center hover:opacity-80"
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

        {/* new: order select */}
        <select
          className="cursor-pointer p-2 w-full rounded bg-sky-200 text-center hover:opacity-80"
          name="sort-setter"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortChoices.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button onClick={handleRecommend} className="w-full">
          <div className="p-2 rounded bg-yellow-300 hover:opacity-70 text-center">
            Recommend me!
          </div>
        </button>
      </div>

      {/* preview */}
      <div className="flex justify-center bg-gray mt-3">
        {likeAnime && (
          <AnimeCardMain
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
    </>
  )
}

export default Choices

import axios from "axios"
import React, { useState } from "react"
import { anime, genre, Props } from "../types"
import AnimeCardMain from "./AnimeCardMain"

const Choices = ({ getRecommendations }: Props) => {
  const [genres, setGenres] = useState<string>("Action")
  const [compareAnime, setCompareAnime] = useState<string>("")
  const [likeAnime, setLikeAnime] = useState<anime>()

  const findAnime = async (
    anime: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault()
      const request = await axios.post("/anime", anime)
      setLikeAnime(request.data)
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
    <>
      <form className="mx-4 mt-5 mb-1">
        <input
          placeholder="Enter any Anime/Manga you like, e.g. Steins Gate"
          className="p-2 w-full border-solid border-2 border-indgo-600 rounded"
          value={compareAnime}
          onChange={(e) => setCompareAnime(e.target.value)}
          type="text"
        ></input>

        {compareAnime !== "" ? (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="p-1 w-full bg-violet-300 rounded hover:opacity-80 mt-2"
          >
            Find anime
          </button>
        ) : (
          ""
        )}
      </form>
      <div className="flex justify-center bg-gray">
        {typeof likeAnime !== "undefined" ? (
          <AnimeCardMain
            description={likeAnime.description}
            key={likeAnime.id}
            id={likeAnime.id}
            title={likeAnime.title}
            averageScore={likeAnime.averageScore}
            coverImage={likeAnime.coverImage}
            col="bg-slate-200"
            siteUrl={likeAnime.siteUrl}
          />
        ) : (
          ""
        )}
      </div>
      {typeof likeAnime !== "undefined" ? (
        <>
          <select
            className="cursor-pointer p-2 rounded mx-4 mt-1 bg-red-200 text-center hover:opacity-80"
            name="genre-setter"
            onChange={(e) => setGenres(e.target.value)}
          >
            {genreChoices.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => getRecommendations(genres, likeAnime?.description)}
            className="recommend-me"
          >
            <div className="mx-4 mb-1 p-2 rounded basis-1/2 bg-yellow-300 hover:opacity-70">
              Recommend me!
            </div>
          </button>
        </>
      ) : (
        ""
      )}
    </>
  )
}

export default Choices

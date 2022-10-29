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
      const request = await axios.post("http://127.0.0.1:8000/anime", anime)
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
      <form className="mx-5 mt-5 mb-4">
        <input
          placeholder="Enter any Anime/Manga you like"
          className="p-1 w-full border-solid border-2 border-indgo-600 rounded"
          value={compareAnime}
          onChange={(e) => setCompareAnime(e.target.value)}
          type="text"
        ></input>

        {compareAnime !== "" ? (
          <button
            onClick={(e) => findAnime(compareAnime, e)}
            className="p-1 w-full bg-green-200 border-solid border-2 rounded border-indgo-600 hover:opacity-80 mt-2"
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
            col="bg-fuchsia-200"
            siteUrl={likeAnime.siteUrl}
          />
        ) : (
          ""
        )}
      </div>
      <select
        className="cursor-pointer rounded mx-4 mt-4 bg-pink-200 text-center hover:opacity-80"
        name="genre-setter"
        onChange={(e) => setGenres(e.target.value)}
      >
        {genreChoices.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mx-4 rounded bg-blue-300 text-center hover:opacity-80">
        Currently selected genre: {genres}
      </div>{" "}
      <button
        onClick={() => getRecommendations(genres, likeAnime?.description)}
        className="recommend-me"
      >
        {typeof likeAnime !== "undefined" ? (
          <div className="mx-4 rounded basis-1/2 bg-green-100 hover:opacity-70">
            Recommend me!
          </div>
        ) : (
          ""
        )}
      </button>
    </>
  )
}

export default Choices

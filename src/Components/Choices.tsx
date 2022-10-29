import axios from "axios"
import React, { useState } from "react"
import { AnimeCard } from "./AnimeCard"
import { anime, genre, Props } from "../types"

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
    <>
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
            siteUrl={likeAnime.siteUrl}
          />
        ) : (
          ""
        )}
      </div>
      <label className="m-2">
        {" "}
        Choose your favourite genre (animes ranked by TF-IDF similarity, left to
        right){" "}
      </label>
      <select
        className="cursor-pointer mx-2 bg-pink-200 text-center hover:opacity-80"
        name="genre-setter"
        onChange={(e) => setGenres(e.target.value)}
      >
        {genreChoices.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mx-2 bg-blue-500 text-center hover:opacity-80">
        Currently selected genre: {genres}
      </div>{" "}
      <button
        onClick={() => getRecommendations(genres, likeAnime?.description)}
        className="recommend-me"
      >
        {typeof likeAnime !== "undefined" ? (
          <div className="mx-2 basis-1/2 bg-green-100 hover:opacity-70">
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

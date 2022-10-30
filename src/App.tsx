import axios from "axios"
import React, { useState } from "react"
import { AnimeCard } from "./Components/AnimeCard"
import Choices from "./Components/Choices"
import { bAnimeCard } from "./types"

function App() {
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
      const request = await axios.post("/recommendations", data)
      setRecommendations([])
      setRecommendations(request.data)
      console.log(recommendations)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="mb-3">
      <div className="App flex flex-col mb-2 gap-2">
        <Choices getRecommendations={getRecommendations} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mx-4">
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
                siteUrl={anime.siteUrl}
              />
            ))
          : ""}
      </div>
    </div>
  )
}

export default App

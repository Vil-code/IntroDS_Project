import React, { useState } from "react"
import axios from "axios"
import { AnimeCard } from "./Components/AnimeCard"
import Choices from "./Components/Choices"
import { AnimeCardData } from "./types"

const API_BASE = process.env.REACT_APP_API_BASE || ""

function App() {
  const [recommendations, setRecommendations] = useState<AnimeCardData[]>([])

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
    description: string | undefined,
    sort: string = "SCORE_DESC"
  ): Promise<void> => {
    try {
      const payload = { genres, description, sort }
      const url =
        API_BASE !== ""
          ? `${API_BASE}/recommendations`
          : "/recommendations"

      const res = await axios.post(url, payload)
      const data = Array.isArray(res.data) ? res.data : []

      const withColors: AnimeCardData[] = data.map((item) => ({
        ...item,
        col: colors[Math.floor(Math.random() * colors.length)],
      }))

      setRecommendations(withColors)
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
      setRecommendations([])
    }
  }

  const sortByScore = () => {
    setRecommendations((prev) =>
      [...prev].sort(
        (a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0)
      )
    )
  }

  const sortBySimilarity = () => {
    setRecommendations((prev) =>
      [...prev].sort(
        (a, b) => (b.similarity ?? 0) - (a.similarity ?? 0)
      )
    )
  }

  return (
    <div className="mb-3 min-h-screen flex flex-col gap-4">
      <div className="App flex flex-col gap-2 px-4 pt-4">
        <Choices getRecommendations={getRecommendations} />
      </div>

      {}
      <div className="mx-4 flex flex-col gap-2 sm:flex-row">
        <button onClick={sortByScore} className="w-full">
          <div className="p-2 rounded bg-blue-200 hover:opacity-80 text-center">
            Sort by score
          </div>
        </button>
        <button onClick={sortBySimilarity} className="w-full">
          <div className="p-2 rounded bg-violet-200 hover:opacity-80 text-center">
            Sort by similarity
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mx-4 pb-6">
        {recommendations.map((anime, index) => (
          <AnimeCard
            key={anime.id ?? `${anime.title.romaji}-${index}`}
            {...anime}
          />
        ))}
      </div>
    </div>
  )
}

export default App

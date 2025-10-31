// src/App.tsx
import React, { useState } from "react"
import axios from "axios"
import { AnimeCard } from "./Components/AnimeCard"
import Choices from "./Components/Choices"
import { AnimeCardData } from "./types"

const API_BASE = process.env.REACT_APP_API_BASE || "" // CRA-style env

function App() {
  const [recommendations, setRecommendations] = useState<AnimeCardData[]>([])

  // colors for cards
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

      // if API_BASE is empty, we call the dev proxy (/recommendations)
      const url =
        API_BASE !== ""
          ? `${API_BASE}/recommendations`
          : "/recommendations"

      const res = await axios.post(url, payload)

      // backend should return an array
      const data = Array.isArray(res.data) ? res.data : []

      // add UI-only data (like random color) here
      const withColors: AnimeCardData[] = data.map((item) => ({
        ...item,
        col: colors[Math.floor(Math.random() * colors.length)],
      }))
      
      const sorted = [...withColors].sort(
        (a, b) =>
          (b.finalScore ?? 0) - (a.finalScore ?? 0) ||
          (b.similarity ?? 0) - (a.similarity ?? 0) ||
          (b.averageScore ?? 0) - (a.averageScore ?? 0)
      )

      setRecommendations(sorted);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
      setRecommendations([])
    }
  }

  return (
    <div className="mb-3 min-h-screen flex flex-col gap-4">
      {/* top controls */}
      <div className="App flex flex-col gap-2 px-4 pt-4">
        <Choices getRecommendations={getRecommendations} />
      </div>

      {/* cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mx-4 pb-6">
        {recommendations.map((anime) => (
          <AnimeCard
            key={anime.id ?? anime.title.romaji}
            {...anime}
          />
        ))}
      </div>
    </div>
  )
}

export default App

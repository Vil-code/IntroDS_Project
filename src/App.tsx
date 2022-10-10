import React, { useState } from "react"

function App() {
  const [genres, setGenres] = useState<string>("")
  const [seenAnime, setSeenAnime] = useState<string[]>([""])

  const baseUrl: string = "https://graphql.anilist.co/"

  type genre = {
    label: string
  }

  const genreChoices: genre[] = [
    {
      label: "Shounen",
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
  ]

  return (
    <div className="App">
      <div className="bg-black">helo</div>
      <select
        className="text-gray-100"
        name="genre-setter"
        onChange={(e) => setGenres(e.target.value)}
      >
        {genreChoices.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      current genre: {genres}
    </div>
  )
}

export default App

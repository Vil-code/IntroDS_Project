// src/types.ts

// what the backend returns from /recommendations and /anime
export type BackendAnime = {
  id: number | null
  title: { romaji: string }
  description: string
  averageScore: number
  genres: string[] | string
  coverImage: { large: string | null }
  siteUrl: string | null
  similarity?: number
  finalScore?: number   // 👈 add this
}

// extra props that the UI adds (like color)
export type UIProps = {
  col: string
}

// final card type used by <AnimeCard />
export type AnimeCardData = BackendAnime & UIProps

// for your <Choices /> component
export type GenreOption = {
  label: string
}

// prop type you had earlier
export type ChoicesProps = {
  getRecommendations(
    genres: string,
    description: string | undefined,
    sort?: string
  ): Promise<void>
}


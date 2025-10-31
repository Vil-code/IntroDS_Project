// src/types.ts


export type BackendAnime = {
  id: number | null
  title: {
    romaji: string
  }
  description: string
  averageScore: number
  genres: string[] | string
  coverImage: {
    large: string | null
  }
  siteUrl: string | null
  similarity?: number
}


export type UIProps = {
  col: string
}


export type AnimeCardData = BackendAnime & UIProps


export type GenreOption = {
  label: string
}


export type ChoicesProps = {
  getRecommendations(
    genres: string,
    description: string | undefined
  ): Promise<void>
}

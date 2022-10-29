type genre = {
  label: string
}

type anime = {
  id: number
  title: {
    romaji: string
  }
  averageScore: number
  coverImage: {
    large: string
  }
  description: string
}

type card = {
  col: string
}

type Props = {
  getRecommendations(
    // eslint-disable-next-line no-unused-vars
    genres: string,

    // eslint-disable-next-line no-unused-vars
    description: string | undefined
  ): Promise<void>
}

type bAnimeCard = anime & card

export type { genre, anime, bAnimeCard, Props }

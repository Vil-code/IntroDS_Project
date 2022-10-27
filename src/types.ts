type genre = {
  label: string
}

type anime = {
  id: number
  title: {
    romaji: string
  }
  popularity: number
  coverImage: {
    large: string
  }
  description: string
}

type card = {
  col: string
}

type bAnimeCard = anime & card

export type { genre, anime, bAnimeCard }

import React from "react"
import { bAnimeCard } from "./types"
import classNames from "classnames"

export const AnimeCard = ({ title, popularity, coverImage, col }: bAnimeCard) => {
  return (
    <div className={classNames("flex flex-col text-center", col)}>
      <div className="p-1">
        <div className="truncate"> {title.romaji}</div>
        <div> Popularity: {popularity} </div>
      </div>
      <img className="h-full" src={coverImage.large}></img>
    </div>
  )
}

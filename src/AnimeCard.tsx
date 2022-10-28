import React from "react"
import { bAnimeCard } from "./types"
import classNames from "classnames"

export const AnimeCard = ({ title, averageScore, coverImage, col }: bAnimeCard) => {
  return (
    <div className={classNames("flex flex-col text-center", col)}>
      <div className="p-1">
        <div className="truncate"> {title.romaji}</div>
        <div> Score: {averageScore} </div>
      </div>
      <img className="h-full truncate" src={coverImage.large}></img>
    </div>
  )
}

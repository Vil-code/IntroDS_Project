import React from "react"
import { bAnimeCard } from "../types"
import classNames from "classnames"

export const AnimeCard = ({
  title,
  averageScore,
  coverImage,
  col,
  siteUrl,
}: bAnimeCard) => {
  return (
    <div className="opacity-100 hover:opacity-80">
      <a href={siteUrl} target="blank">
        <div className={classNames("flex flex-col text-center h-full rounded", col)}>
          <div className="p-2">
            <div className="truncate">{title.romaji}</div>
            <div> Score: {averageScore} </div>
          </div>
          <img className="h-full truncate rounded-b-lg" src={coverImage.large}></img>
        </div>
      </a>
    </div>
  )
}

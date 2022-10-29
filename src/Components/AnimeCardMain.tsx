import React from "react"
import { bAnimeCard } from "../types"
import classNames from "classnames"

export const AnimeCardMain = ({
  title,
  averageScore,
  description,
  coverImage,
  col,
  siteUrl,
}: bAnimeCard) => {
  return (
    <div className="opacity-100 flex justify-center gap-2">
      <a className="ml-4 basis-1/4 hover:opacity-80" href={siteUrl} target="blank">
        <div className={classNames("flex flex-col text-center h-full rounded", col)}>
          <div className="p-2">
            <div className="truncate">{title.romaji}</div>
            <div> Score: {averageScore} </div>
          </div>
          <img className="h-full truncate rounded-b-lg" src={coverImage.large}></img>
        </div>
      </a>
      <div className={classNames("basis-3/4 p-4 mr-4 rounded overflow-auto", col)}>
        {description}
      </div>
    </div>
  )
}

export default AnimeCardMain

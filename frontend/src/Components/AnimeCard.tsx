import React from "react"
import classNames from "classnames"
import { AnimeCardData } from "../types"

export const AnimeCard: React.FC<AnimeCardData> = ({
  title,
  averageScore,
  similarity,
  coverImage,
  col,
  siteUrl,
}) => {
  const titleText =
    typeof title === "string" ? title : title?.romaji ?? "Untitled"
  const imageSrc =
    typeof coverImage === "string"
      ? coverImage
      : coverImage?.large ?? null
  const simPercent =
    typeof similarity === "number" ? (similarity * 100).toFixed(1) : null

  return (
    <div className="opacity-100 hover:opacity-80 h-full">
      <a
        href={siteUrl ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="block h-full"
      >
        <div
          className={classNames(
            "flex flex-col text-center h-full rounded shadow-sm",
            col
          )}
        >
          <div className="p-2">
            <div className="truncate font-medium" title={titleText}>
              {titleText}
            </div>
            <div className="text-sm">
              Score: {averageScore ?? 0}
              {simPercent && (
                <span className="text-sm ml-1">
                  • Similarity: {simPercent}%
                </span>
              )}
            </div>
          </div>
          {imageSrc ? (
            <img
              className="w-full object-cover rounded-b-lg max-h-64"
              src={imageSrc}
              alt={titleText}
            />
          ) : (
            <div className="h-40 flex items-center justify-center bg-white/30 rounded-b-lg text-xs">
              No image
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

export default AnimeCard

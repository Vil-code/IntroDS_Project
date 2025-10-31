// src/Components/AnimeCard.tsx
import React from "react"
import classNames from "classnames"
import { AnimeCardData } from "../types"

type Props = AnimeCardData

export const AnimeCard: React.FC<Props> = ({
  title,
  averageScore,
  coverImage,
  col,
  siteUrl,
  description,
  id,
}) => {
  // backend guarantees { title: { romaji: string } }, but be defensive:
  const titleText =
    typeof title === "string" ? title : title?.romaji ?? "Untitled"

  // backend sends { coverImage: { large: string } }, but be defensive:
  const imageSrc =
    typeof coverImage === "string"
      ? coverImage
      : coverImage?.large ?? null

  // short description for tooltip / alt
  const shortDesc =
    description?.length > 120
      ? description.slice(0, 117) + "..."
      : description ?? ""

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
            <div className="text-sm">Score: {averageScore ?? 0}</div>
          </div>

          {imageSrc ? (
            <img
              className="w-full object-cover rounded-b-lg max-h-64"
              src={imageSrc}
              alt={shortDesc || titleText}
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

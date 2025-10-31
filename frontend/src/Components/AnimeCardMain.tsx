import React from "react"
import classNames from "classnames"
import { AnimeCardData } from "../types"

export const AnimeCardMain: React.FC<AnimeCardData> = ({
  title,
  averageScore,
  description,
  coverImage,
  col,
  siteUrl,
}) => {
  // Handle both possible shapes safely
  const titleText =
    typeof title === "string" ? title : title?.romaji ?? "Untitled"

  const imageSrc =
    typeof coverImage === "string"
      ? coverImage
      : coverImage?.large ?? null

  return (
    <div className="opacity-100 flex justify-center gap-2 flex-wrap md:flex-nowrap">
      {/* Left side: image and title */}
      <a
        className="ml-4 basis-1/4 hover:opacity-80 flex-shrink-0"
        href={siteUrl ?? "#"}
        target="_blank"
        rel="noreferrer"
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
              className="w-full object-cover rounded-b-lg max-h-96"
              src={imageSrc}
              alt={titleText}
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-white/30 rounded-b-lg text-xs">
              No image
            </div>
          )}
        </div>
      </a>

      {/* Right side: description */}
      <div
        className={classNames(
          "basis-full md:basis-3/4 p-4 mr-4 rounded overflow-auto leading-relaxed text-sm",
          col
        )}
      >
        {description ? (
          <p
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: description.replace(/<[^>]*>?/gm, ""), // strip HTML tags just in case
            }}
          />
        ) : (
          <p className="italic text-gray-600">No description available.</p>
        )}
      </div>
    </div>
  )
}

export default AnimeCardMain

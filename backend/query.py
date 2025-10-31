import os
import re
from typing import Any, Dict, List, Optional

import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__, static_folder="./build", static_url_path="")
CORS(app)

ANILIST_URL = "https://graphql.anilist.co"


def clean_description(text: Optional[str]) -> str:
    if not text:
        return ""
    text = re.sub(r"<br\s*/?>", " ", text)
    text = re.sub(r"</?i>", "", text)
    text = text.replace("&rdquo;", "").replace("&ldquo;", "")
    return text.strip()


def fetch_anilist_page(genre: str, page: int, per_page: int = 50, sort: str = "SCORE_DESC") -> List[Dict[str, Any]]:
    query = """
    query ($page: Int, $perPage: Int, $genre_in: [String], $sort: [MediaSort]) {
      Page (page: $page, perPage: $perPage) {
        media (genre_in: $genre_in, isAdult: false, sort: $sort) {
          id
          title { romaji }
          genres
          description
          averageScore
          popularity
          coverImage { large }
          siteUrl
        }
      }
    }
    """
    variables = {
        "page": page,
        "perPage": per_page,
        "genre_in": [genre],
        "sort": [sort],
    }

    resp = requests.post(ANILIST_URL, json={"query": query, "variables": variables})
    resp.raise_for_status()
    data = resp.json()
    return data.get("data", {}).get("Page", {}).get("media", [])


def build_dataframe(media_list: List[Dict[str, Any]]) -> pd.DataFrame:
    rows = []
    for item in media_list:
        rows.append(
            {
                "id": item.get("id"),
                "title": item.get("title", {}).get("romaji", ""),
                "description": clean_description(item.get("description")),
                "averageScore": item.get("averageScore", 0),
                "popularity": item.get("popularity", 0),
                "genres": item.get("genres", []),
                "coverImage": item.get("coverImage", {}).get("large"),
                "siteUrl": item.get("siteUrl"),
            }
        )
    return pd.DataFrame(rows)


def add_similarity(input_description: str, df: pd.DataFrame) -> pd.DataFrame:
    if not input_description.strip():
        df["similarity"] = 0.0
        return df

    query_row = {
        "id": None,
        "title": "query-object",
        "description": clean_description(input_description),
        "averageScore": 0,
        "popularity": 0,
        "genres": [],
        "coverImage": None,
        "siteUrl": None,
    }

    df_all = pd.concat([pd.DataFrame([query_row]), df], ignore_index=True)
    df_all["description"] = df_all["description"].fillna("")

    vectorizer = TfidfVectorizer(min_df=1, stop_words="english")
    tfidf = vectorizer.fit_transform(df_all["description"])
    sim_matrix = (tfidf * tfidf.T).toarray()

    df["similarity"] = sim_matrix[1:, 0]
    return df


@app.route("/recommendations", methods=["POST"])
def recommendations():
    data = request.get_json(force=True) or {}
    description = data.get("description", "") or ""
    genre = data.get("genres", "") or ""
    sort = data.get("sort") or "SCORE_DESC"

    if not genre:
        return jsonify({"error": "genres field is required"}), 400

    pages_to_fetch = [1, 2, 3, 4]
    media_all: List[Dict[str, Any]] = []
    for p in pages_to_fetch:
        media_all.extend(fetch_anilist_page(genre, p, per_page=50, sort=sort))

    seen = set()
    unique_media = []
    for m in media_all:
        mid = m.get("id")
        if mid in seen:
            continue
        seen.add(mid)
        unique_media.append(m)

    df = build_dataframe(unique_media)
    df = add_similarity(description, df)

    df = df.head(100)

    results: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        results.append(
            {
                "id": int(row["id"]) if pd.notna(row["id"]) else None,
                "title": {"romaji": row["title"]},
                "description": row["description"],
                "averageScore": int(row["averageScore"]) if pd.notna(row["averageScore"]) else 0,
                "genres": row["genres"],
                "coverImage": {"large": row["coverImage"]} if row["coverImage"] else {"large": None},
                "siteUrl": row["siteUrl"],
                "similarity": float(row["similarity"]),
                "popularity": int(row["popularity"]) if pd.notna(row["popularity"]) else 0,
            }
        )

    return jsonify(results)


@app.route("/anime", methods=["POST"])
def anime():
    if request.is_json:
        data = request.get_json(force=True) or {}
        search = data.get("search", "").strip()
    else:
        search = request.get_data(as_text=True).strip()

    if not search:
        return jsonify({"error": "empty search"}), 400

    query = """
    query ($search: String) {
      Media (search: $search, isAdult: false) {
        id
        title { romaji }
        description
        averageScore
        popularity
        coverImage { large }
        siteUrl
        genres
      }
    }
    """
    variables = {"search": search}

    resp = requests.post(ANILIST_URL, json={"query": query, "variables": variables})
    resp.raise_for_status()
    data = resp.json()
    media = data.get("data", {}).get("Media")

    if not media:
        return jsonify({"error": "not found"}), 404

    description = clean_description(media.get("description"))

    return jsonify(
        {
            "id": media.get("id"),
            "title": {"romaji": media.get("title", {}).get("romaji")},
            "description": description,
            "averageScore": media.get("averageScore") or 0,
            "genres": media.get("genres") or [],
            "coverImage": {"large": media.get("coverImage", {}).get("large")},
            "siteUrl": media.get("siteUrl"),
        }
    )


@app.route("/test")
def test():
    return "testing flask!"


@app.route("/")
def index():
    index_path = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, "index.html")
    return "Frontend build not found", 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port)

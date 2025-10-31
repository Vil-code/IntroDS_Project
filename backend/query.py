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


def fetch_anilist_page(
    genre: str,
    page: int,
    per_page: int = 50,
    sort: str = "SCORE_DESC",
) -> List[Dict[str, Any]]:
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


def recommend_from_description(
    input_description: str,
    df: pd.DataFrame,
) -> pd.DataFrame:
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

    df_all["similarity"] = sim_matrix[:, 0]
    return df_all.iloc[1:, :]  # return all, we’ll sort later


@app.route("/recommendations", methods=["POST"])
def recommendations():
    data = request.get_json(force=True) or {}
    description = data.get("description", "") or ""
    genre = data.get("genres", "") or ""
    sort = data.get("sort") or "SCORE_DESC"

    if not genre:
        return jsonify({"error": "genres field is required"}), 400

    # 1. fetch several pages deterministically
    pages_to_fetch = [1, 2, 3, 4]  # increase if you want more coverage
    media_all: List[Dict[str, Any]] = []
    for p in pages_to_fetch:
        media_all.extend(fetch_anilist_page(genre, p, per_page=50, sort=sort))

    # 2. dedupe by id (AniList can repeat across pages depending on query)
    seen = set()
    unique_media = []
    for m in media_all:
        mid = m.get("id")
        if mid in seen:
            continue
        seen.add(mid)
        unique_media.append(m)

    df = build_dataframe(unique_media)

    # 3. TF-IDF to get similarity
    df_recs = recommend_from_description(description, df)

    # 4. ranking-heavy blend
    df_recs["avg_score_norm"] = df_recs["averageScore"].fillna(0) / 100.0
    max_pop = df_recs["popularity"].max() or 1
    df_recs["pop_norm"] = df_recs["popularity"].fillna(0) / max_pop

    sort_upper = sort.upper()
    if sort_upper == "SCORE_DESC":
        w_sim, w_score, w_pop = 0.25, 0.6, 0.15
    elif sort_upper == "POPULARITY_DESC":
        w_sim, w_score, w_pop = 0.25, 0.25, 0.5
    elif sort_upper == "TRENDING_DESC":
        w_sim, w_score, w_pop = 0.3, 0.2, 0.5
    elif sort_upper == "FAVOURITES_DESC":
        w_sim, w_score, w_pop = 0.35, 0.35, 0.3
    else:
        w_sim, w_score, w_pop = 0.4, 0.4, 0.2

    df_recs["final_score"] = (
        df_recs["similarity"] * w_sim
        + df_recs["avg_score_norm"] * w_score
        + df_recs["pop_norm"] * w_pop
    )

    df_recs = df_recs.sort_values(by="final_score", ascending=False).head(24)

    results: List[Dict[str, Any]] = []
    for _, row in df_recs.iterrows():
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
                "finalScore": float(row["final_score"]),
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
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

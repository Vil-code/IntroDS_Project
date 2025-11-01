# 🎬 Anime Recommendation Web App

**A full-stack anime recommendation platform built with Flask, React, and the AniList GraphQL API.**

[**Live Demo**] https://intro-ds-project.vercel.app/

Note that since I use the free version of both Vercel and Render, it can take up to a minute for the server to wake up after user has searched for a series.

## 🚀 Overview

This project provides personalized anime recommendations based on user input and genre preferences.

Users can:
- Search for any anime they like
- View its description and score
- Select a genre to refine recommendations
- Receive similar anime ranked by **semantic similarity**
- Sort results by either **score** or **similarity**

## 🧠 How It Works

- **Backend (Flask / Python)**
  - Queries the AniList GraphQL API for anime data.
  - Uses **TF-IDF vectorization** from `scikit-learn` to compute description similarity.
  - Returns ranked recommendations as JSON.
  - Deployed on **Render** using Gunicorn.

- **Frontend (React / TypeScript / Tailwind CSS)**
  - Built with React + TypeScript.
  - Users can search, choose genres, and view ranked anime cards.
  - Supports client-side sorting (score/similarity).
  - Deployed on **Vercel** with auto-deployment from GitHub.

- **Data Source**
  - [AniList GraphQL API](https://anilist.co/graphiql)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (TypeScript), Tailwind CSS, Axios |
| **Backend** | Flask, Python, pandas, scikit-learn, Gunicorn |
| **API** | AniList GraphQL API |
| **Deployment** | Render (backend), Vercel (frontend) |
| **Version Control** | Git & GitHub |

## 🧩 Features

✅ Search anime by title  
✅ Fetch data from AniList GraphQL API  
✅ Compute anime similarity with TF-IDF  
✅ Filter by genres  
✅ Sort results by score or similarity  
✅ Responsive design (mobile-friendly)  
✅ Deployed full-stack setup (Render + Vercel)  
✅ CI/CD auto-redeploy on push  

## 🖥️ Project Structure

```
IntroDS_Project/
├── backend/
│   ├── query.py              # Flask API with GraphQL + TF-IDF recommendation logic
│   ├── requirements.txt
│   └── ...
├── src/                      # React frontend
│   ├── Components/
│   ├── App.tsx
│   └── ...
├── public/
├── package.json
└── README.md
```

## 🔧 Setup (Local)

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python query.py
```
Server will start at `http://localhost:5000`.

**Frontend**
```bash
cd frontend
yarn install
yarn start
```
Frontend runs at `http://localhost:3000`.

To proxy requests to Flask during development, add to `package.json`:
```json
"proxy": "http://localhost:5050"
```


## 🧮 Example Workflow

1. User searches for “Steins;Gate”.
2. Flask queries AniList for anime metadata.
3. TF-IDF computes cosine similarity between Steins;Gate and other anime.
4. Top recommendations are returned as JSON.
5. React displays them as anime cards.
6. User can sort results by similarity or score.

## 👤 Author

**Vilcode**  
🔗 [GitHub](https://github.com/Vil-code)

## 📝 License

MIT License © 2025

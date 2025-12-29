# NBA Player Analytics Dashboard

A full-stack web application to search, view, and compare NBA player statistics across multiple seasons. This project includes a **Python FastAPI backend** and a **React frontend**.

---

## Features

- Search individual NBA players and view detailed statistics.
- Compare multiple players side by side.
- Dynamic season selection to explore stats from previous NBA seasons.
- Interactive charts to visualize player performance.
- Responsive and user-friendly interface.

---

## Project Structure

```text
NBA STATS APP/
├── app.py                # FastAPI backend entry point
├── services/             # Python service modules
│   ├── NBALoader.py      # Fetches NBA player game logs
│   └── analytics.py      # Analytics functions for player stats
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/        # React pages (Home, PlayerStats, ComparePlayers)
│   │   ├── App.js
│   │   └── index.js
│   ├── public/           # Public assets (index.html, logos, favicon)
│   ├── package.json
│   └── package-lock.json
├── package.json          # Backend dependencies (if any)
├── package-lock.json
└── .gitignore
```
# ===============================
# Installation & Setup
# ===============================

# ----- Backend (FastAPI) -----

# 1. Ensure Python 3.9+ is installed
python --version

# 2. (Optional but recommended) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate    # macOS/Linux
# venv\Scripts\activate     # Windows

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server

# Option A (recommended, if uvicorn is on PATH)
uvicorn app:app --reload

# Option B (if uvicorn is not found)
python -m uvicorn app:app --reload

# Backend will be available at:
# http://127.0.0.1:8000


# ----- Frontend (React) -----

# 5. Open a new terminal and navigate to the frontend folder
cd frontend

# 6. Load Node Version Manager (if applicable)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 7. Install frontend dependencies
npm install

# 8. Start the React development server
npm start

# Frontend will be available at:
# http://localhost:3000

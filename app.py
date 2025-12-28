from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from services.NBALoader import fetch_player_stats
from services.analytics import get_player, playerStats, compare_players
from nba_api.stats.static import players as nba_static_players

# Initialize FastAPI app
app = FastAPI()

# Enable CORS so frontend (React) can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/players")
def api_players(query: str = ""):
    """
    Fetch a list of NBA players for autocomplete/search.

    Args:
        query (str, optional): A search string to filter players by name. Defaults to "".

    Returns:
        dict: A dictionary containing up to 50 player full names matching the query.
    """
    # Get all players from nba_api
    all_players = nba_static_players.get_players()  # list of dicts with 'full_name'
    
    # Filter by search query if provided
    if query:
        all_players = [p for p in all_players if query.lower() in p['full_name'].lower()]
    
    # Return only names, limited to top 50 matches
    return {"players": [p['full_name'] for p in all_players][:50]}

@app.get("/api/player/{player_name}")
def api_player(player_name: str, season: str = '2025-26'):
    
    """
    Fetch detailed game stats and summary for a single NBA player.

    Args:
        player_name (str): Full name of the player.
        season (str, optional): NBA season in 'YYYY-YY' format. Defaults to '2025-26'.

    Returns:
        dict: Player summary stats and game-by-game data. Returns an error if player not found.
    """
    # Fetch stats for this player dynamically
    df = fetch_player_stats([player_name], season)
    if df.empty:
        return {"error": "Player not found"}
    
    return playerStats(df, player_name)  # Process stats into summary + games

@app.get("/api/compare")
def api_compare(players: str = Query(...), season: str = '2025-26'):
    
    """
    Compare multiple NBA players' statistics for a specific season.

    Args:
        players (str): Comma-separated list of player full names.
        season (str, optional): NBA season in 'YYYY-YY' format. Defaults to '2025-26'.

    Returns:
        dict: Comparison dictionary containing stats for each requested player.
    """
    player_names = [p.strip() for p in players.split(",")]  # Split comma-separated player names into a list
    df = fetch_player_stats(player_names, season)
    return compare_players(df, player_names)
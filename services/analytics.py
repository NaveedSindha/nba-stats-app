import pandas as pd
from nba_api.stats.static import players as nba_players

def get_player(df):
    """
    Extract a list of unique player names from the DataFrame.

    Args:
        df (pd.DataFrame): DataFrame containing player stats with a 'player_name' column.

    Returns:
        list: Unique player names in the DataFrame.
    """
    return df['player_name'].unique().tolist()


def playerStats(df, player_name):
    """
    Generate a summary of a player's statistics and return detailed game-by-game data.

    Args:
        df (pd.DataFrame): DataFrame containing player stats where each row is one game.
        player_name (str): Full name of the player to generate stats for.

    Returns:
        dict: Dictionary containing:
            - 'summary': Aggregated statistics for the player.
            - 'games': List of dictionaries, each representing a game's stats.
    """
        # Find the player's NBA ID using nba_api
    player_list = nba_players.find_players_by_full_name(player_name)
    player_id = player_list[0]["id"] if player_list else None
    
    # Filter the DataFrame to only include rows for this player
    player_df = df[df["player_name"] == player_name] #each row is one game

    # Return early if the player has no recorded games
    if player_df.empty:
        return {
            "summary": {
                "player_name": player_name,
                "games_played": 0
            }
        }

    games = len(player_df) # number of rows is number of games played

    # Aggregate totals for shooting and scoring
    total_points = player_df["points"].sum()
    total_fga = player_df["fga"].sum()
    total_fgm = player_df["fgm"].sum()
    total_fg3a = player_df["fg3a"].sum()
    total_fg3m = player_df["fg3m"].sum()
    total_fta = player_df["fta"].sum()
    total_ftm = player_df["ftm"].sum()
    
     # Calculate shooting percentages; avoid division by zero
    fg_pct = (total_fgm / total_fga) * 100 if total_fga else 0
    fg3_pct = (total_fg3m / total_fg3a) * 100 if total_fg3a else 0
    ft_pct = (total_ftm / total_fta) * 100 if total_fta else 0

    # TRUE SHOOTING %
    ts_pct = (total_points / (2 * (total_fga + 0.44 * total_fta))) * 100 if (total_fga + total_fta) else 0

    # Compile the summary stats
    summary = {
        "player_id": player_id,
        "player_name": player_name,
        "games_played": games,

        "avg_points": round(player_df["points"].mean(), 1),
        "avg_assists": round(player_df["assists"].mean(), 1),
        "avg_rebounds": round(player_df["rebounds"].mean(), 1),

        "fg_pct": round(fg_pct, 1),
        "fg3_pct": round(fg3_pct, 1),
        "ft_pct": round(ft_pct, 1),
        "ts_pct": round(ts_pct, 1),

        "plus_minus": round(player_df["plus_minus"].mean(), 1),
    }

    return {
        "summary": summary,
        "games": player_df.to_dict(orient="records")
    }


def compare_players(df, player_names):
    """
    Compare multiple players by generating their individual statistics.

    Args:
        df (pd.DataFrame): DataFrame containing stats for all players.
        player_names (list): List of player names to compare.

    Returns:
        dict: Dictionary mapping each player name to their stats summary and games.
    """
    
    comparison = {}
    for player in player_names:
        comparison[player] = playerStats(df, player)
    return comparison

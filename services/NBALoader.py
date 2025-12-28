from nba_api.stats.static import players
from nba_api.stats.endpoints import playergamelog
import pandas as pd

def fetch_player_stats(player_names, season='2025-26'):
    
    """
    Fetch game-by-game statistics for a list of NBA players for a specific season.

    Args:
        player_names (list): List of player full names to fetch stats for.
        season (str, optional): NBA season in 'YYYY-YY' format. Defaults to '2025-26'.

    Returns:
        pd.DataFrame: DataFrame containing game logs for all requested players.
                      Columns include date, points, assists, rebounds, shooting stats, plus-minus, player name, and player ID.
                      Returns an empty DataFrame if no players are found.
    """
    all_games = []

    for name in player_names:
         # Find the player in NBA static database
        player_list = players.find_players_by_full_name(name)
        if not player_list:
            continue

        player_id = player_list[0]['id']
        # Fetch player's game logs for the specified season
        gamelog = playergamelog.PlayerGameLog(player_id=player_id, season=season)
        games_df = gamelog.get_data_frames()[0]

        # keep these columns only
        games_df = games_df[
            [
                'GAME_DATE', 'PTS', 'AST', 'REB',
                'FGA', 'FGM',
                'FG3A', 'FG3M',
                'FTA', 'FTM',
                'PLUS_MINUS'
            ]
        ]
          # Add player name and ID for reference
        games_df['player_name'] = name
        games_df['player_id'] = player_id

        all_games.append(games_df)

    if not all_games:
        return pd.DataFrame()
    
    # Combine all player game logs into a single DataFrame
    final_df = pd.concat(all_games, ignore_index=True)
    
    # Rename columns for easier use
    final_df.rename(columns={
        'GAME_DATE': 'date',
        'PTS': 'points',
        'AST': 'assists',
        'REB': 'rebounds',
        'FGA': 'fga',
        'FGM': 'fgm',
        'FG3A': 'fg3a',
        'FG3M': 'fg3m',
        'FTA': 'fta',
        'FTM': 'ftm',
        'PLUS_MINUS': 'plus_minus'
    }, inplace=True)

    # Convert date column to datetime object for easier manipulation
    final_df['date'] = pd.to_datetime(final_df['date'])
    return final_df
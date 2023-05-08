export interface PlayerData {
    username: string;
    rating: number;
    place: number;
}

export interface Player {
    username: string;
    user_id: string;
}

export interface Match {
    user_id: string;
    game_id: string;
    game_type: string;
    game_server: string;
    gauntlet_ticket_id: number | null;
    is_scored: boolean;
    is_winner: boolean;
    is_draw: boolean;
    is_player_1: boolean;
    faction_id: number;
    general_id: number;
    faction_xp: number;
    faction_xp_earned: number;
    opponent_id: string;
    opponent_faction_id: number;
    opponent_general_id: number;
    opponent_username: string;
    game_version: string;
    rewards: string | null;
    reward_ids: string | null;
    rank_before: number;
    rank_stars_before: number;
    rank_delta: number;
    rank_stars_delta: number;
    rank_win_streak: number;
    is_daily_win: boolean;
    play_count_reward_progress: number;
    win_count_reward_progress: number;
    has_maxed_play_count_rewards: boolean;
    has_maxed_win_count_rewards: boolean;
    created_at: number;
    updated_at: number;
    ended_at: number;
    status: string;
    gold_tip_amount: number | null;
    rift_ticket_id: null;
    rift_points: null;
    rift_points_earned: null;
    rift_rating_after: null;
    rift_rating_earned: null;
    digest: string;
}

export interface User {
  UserId: number;
  PlayedCards: string[];
  LogTID: string;
  LogExtra: string;
  IsReady: number;
  HandCards: string[];
  Bet: number;
}

export interface Score {
  TeamB: string;
  TeamA: string;
  Rounds: string[];
  Final: string;
  Current: string;
}

export interface GameState {
  Users: User[];
  Suit: number;
  State: number;
  SeedInit: number;
  Seed: number;
  Score: Score;
  PrevTurn: number;
  Penalty: number;
  Dealer: number;
  CurrentTurn: number;
  CurrentRound: number;
  CurrentGameRound: number;
  Bidder: number;
  Bid: number;
}

export interface PlayedCard {
  card: string;
  playedBy: number;
}

export interface GameLog {
  timestamp: number;
  action: string;
  player: string;
  details?: string;
}

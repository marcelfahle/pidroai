import type { User } from "./game-state";

export type PlayerType = "human" | "ai";

export interface PlayerInfo {
  id: number;
  name: string;
  avatar: string;
  type: PlayerType;
}

export interface AIConfig {
  provider: "anthropic" | "openai";
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIPlayer extends PlayerInfo {
  type: "ai";
  config: AIConfig;
}

export interface HumanPlayer extends PlayerInfo {
  type: "human";
}

export type Player = HumanPlayer | AIPlayer;

export interface GameStateForAI {
  phase: "bidding" | "playing";
  visibleCards: {
    hand: string[];
    playedCards: string[];
    discardedCards: string[];
  };
  currentBid: number | null;
  trumpSuit: string | null;
  currentTrick: string[];
  scores: { team1: number; team2: number };
  position: "north" | "south" | "east" | "west";
  team: 1 | 2;
  isDealer: boolean;
}

export type Move = {
  type: "bid" | "play";
  value: number | string;
};

export interface ExtendedUser extends User {
  player: Player;
}

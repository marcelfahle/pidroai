"use client";

import { useState, useEffect } from "react";
import { PlayerHand } from "@/components/player-hand";
import { DebugPanel } from "@/components/debug-panel";
import type { GameState, PlayedCard, GameLog } from "@/types/game-state";
import type {
  Player,
  ExtendedUser,
  GameStateForAI,
  Move,
} from "@/types/player";
import { getAIMove } from "@/app/actions/ai";

const initialPlayers: Player[] = [
  { id: 0, name: "North", avatar: "/avatars/avatar1.png", type: "human" },
  {
    id: 1,
    name: "East",
    avatar: "/avatars/avatar2.png",
    type: "ai",
    config: { provider: "anthropic" },
  },
  { id: 2, name: "South", avatar: "/avatars/avatar3.png", type: "human" },
  {
    id: 3,
    name: "West",
    avatar: "/avatars/avatar4.png",
    type: "ai",
    config: { provider: "openai" },
  },
];

const initialGameState: GameState = {
  Users: [
    {
      UserId: 2,
      PlayedCards: ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
      LogTID: "TID_Passed",
      LogExtra: "",
      IsReady: 0,
      HandCards: ["sA", "d10", "d5", "s9", "s3", "s2", "0", "0", "0"],
      Bet: 0,
    },
    {
      UserId: 3,
      PlayedCards: ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
      LogTID: "TID_Passed",
      LogExtra: "",
      IsReady: 0,
      HandCards: ["s7", "c5", "s5", "c3", "c4", "s8", "0", "0", "0"],
      Bet: 0,
    },
    {
      UserId: 0,
      PlayedCards: ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
      LogTID: "TID_Bet",
      LogExtra: " 6",
      IsReady: 0,
      HandCards: ["sK", "sQ", "sJ", "dA", "s10", "s4", "0", "0", "0"],
      Bet: 6,
    },
    {
      UserId: 1,
      PlayedCards: ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
      LogTID: "TID_Passed",
      LogExtra: "",
      IsReady: 0,
      HandCards: ["s6", "d5", "h3", "h4", "hJ", "dJ", "0", "0", "0"],
      Bet: 0,
    },
  ],
  Suit: 2,
  State: 6,
  SeedInit: 559750073,
  Seed: 1689401669,
  Score: {
    TeamB: "3,1",
    TeamA: "2,0",
    Rounds: ["0,14", "-7,11", "12,2", "2,12", "13,-7", "2,12", "13,1", "13,1"],
    Final: "48,46",
    Current: "0,0",
  },
  PrevTurn: 0,
  Penalty: 0,
  Dealer: 2,
  CurrentTurn: 0,
  CurrentRound: 0,
  CurrentGameRound: 25,
  Bidder: 0,
  Bid: 6,
};

const POSITIONS = ["top", "right", "bottom", "left"] as const;

export default function GameTable() {
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    Users: initialGameState.Users.map((user, index) => ({
      ...user,
      player: initialPlayers[index],
    })) as ExtendedUser[],
  });
  const [playedCards, setPlayedCards] = useState<PlayedCard[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);

  const addLog = (action: string, playerId: number, details?: string) => {
    const player = (gameState.Users[playerId] as ExtendedUser).player;
    setLogs((prev) => [
      {
        timestamp: Date.now(),
        action,
        player: player.name,
        details,
      },
      ...prev,
    ]);
  };

  const handlePlayCard = (playerId: number) => async (card: string) => {
    const player = (gameState.Users[playerId] as ExtendedUser).player;
    let move: Move;

    if (player.type === "ai") {
      const gameStateForAI: GameStateForAI = {
        phase: "playing",
        visibleCards: {
          hand: gameState.Users[playerId].HandCards,
          playedCards: playedCards.map((pc) => pc.card),
          discardedCards: [],
        },
        currentBid: gameState.Bid,
        trumpSuit: ["h", "d", "c", "s"][gameState.Suit],
        currentTrick: playedCards.map((pc) => pc.card),
        scores: {
          team1: parseInt(gameState.Score.TeamA.split(",")[0]),
          team2: parseInt(gameState.Score.TeamB.split(",")[0]),
        },
        position: ["north", "east", "south", "west"][playerId] as
          | "north"
          | "east"
          | "south"
          | "west",
        team: playerId % 2 === 0 ? 1 : 2,
        isDealer: gameState.Dealer === playerId,
      };
      const legalMoves = gameState.Users[playerId].HandCards.filter(
        (c) => c !== "0"
      );
      move = await getAIMove(
        player.config.provider,
        gameStateForAI,
        legalMoves
      );
      card = move.value as string;
      addLog("plays", playerId, `AI chose ${card}`);
    } else {
      addLog("plays", playerId, card);
    }

    setGameState((prev) => ({
      ...prev,
      Users: prev.Users.map((user, i) => {
        if (i === playerId) {
          return {
            ...user,
            HandCards: user.HandCards.filter((c) => c !== card),
          };
        }
        return user;
      }),
      CurrentTurn: (playerId + 1) % 4,
    }));

    setPlayedCards((prev) => [...prev, { card, playedBy: playerId }]);
  };

  useEffect(() => {
    const currentPlayer = gameState.Users[
      gameState.CurrentTurn
    ] as ExtendedUser;
    if (currentPlayer.player.type === "ai") {
      handlePlayCard(gameState.CurrentTurn)(currentPlayer.HandCards[0]);
    }
  }, [gameState.CurrentTurn]);

  const suitSymbols = ["♥️", "♦️", "♣️", "♠️"];
  const suitColors = [
    "text-red-500",
    "text-red-500",
    "text-gray-900",
    "text-gray-900",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="relative flex-1 bg-gradient-to-br from-[#155280] to-[#01ABFA] rounded-xl h-[600px] lg:h-[800px]">
        <div className="flex flex-col h-full">
          <div id="player-north" className="flex justify-center">
            <PlayerHand
              key={0}
              player={(gameState.Users[0] as ExtendedUser).player}
              position={POSITIONS[0]}
              cards={gameState.Users[0].HandCards}
              playedCards={playedCards.filter((c) => c.playedBy === 0)}
              bet={gameState.Users[0].Bet}
              isDealer={gameState.Dealer === 0}
              isTurn={gameState.CurrentTurn === 0}
              onPlayCard={handlePlayCard(0)}
              disabled={playedCards.length >= 24}
              legalMoves={
                gameState.CurrentTurn === 0
                  ? gameState.Users[0].HandCards.filter((c) => c !== "0")
                  : []
              }
            />
          </div>

          <div className="flex flex-1">
            <div id="player-east" className="flex-0">
              <PlayerHand
                key={3}
                player={(gameState.Users[3] as ExtendedUser).player}
                position={POSITIONS[3]}
                cards={gameState.Users[3].HandCards}
                playedCards={playedCards.filter((c) => c.playedBy === 3)}
                bet={gameState.Users[3].Bet}
                isDealer={gameState.Dealer === 3}
                isTurn={gameState.CurrentTurn === 3}
                onPlayCard={handlePlayCard(3)}
                disabled={playedCards.length >= 24}
                legalMoves={
                  gameState.CurrentTurn === 3
                    ? gameState.Users[3].HandCards.filter((c) => c !== "0")
                    : []
                }
              />
            </div>

            <div id="stage" className="flex-1 flex items-center justify-center">
              <div className={`text-6xl ${suitColors[gameState.Suit]}`}>
                {suitSymbols[gameState.Suit]}
              </div>
            </div>

            <div id="player-west" className="flex-0">
              <PlayerHand
                key={1}
                player={(gameState.Users[1] as ExtendedUser).player}
                position={POSITIONS[1]}
                cards={gameState.Users[1].HandCards}
                playedCards={playedCards.filter((c) => c.playedBy === 1)}
                bet={gameState.Users[1].Bet}
                isDealer={gameState.Dealer === 1}
                isTurn={gameState.CurrentTurn === 1}
                onPlayCard={handlePlayCard(1)}
                disabled={playedCards.length >= 24}
                legalMoves={
                  gameState.CurrentTurn === 1
                    ? gameState.Users[1].HandCards.filter((c) => c !== "0")
                    : []
                }
              />
            </div>
          </div>

          <div id="player-south" className="flex justify-center">
            <PlayerHand
              key={2}
              player={(gameState.Users[2] as ExtendedUser).player}
              position={POSITIONS[2]}
              cards={gameState.Users[2].HandCards}
              playedCards={playedCards.filter((c) => c.playedBy === 2)}
              bet={gameState.Users[2].Bet}
              isDealer={gameState.Dealer === 2}
              isTurn={gameState.CurrentTurn === 2}
              onPlayCard={handlePlayCard(2)}
              disabled={playedCards.length >= 24}
              legalMoves={
                gameState.CurrentTurn === 2
                  ? gameState.Users[2].HandCards.filter((c) => c !== "0")
                  : []
              }
            />
          </div>
        </div>
      </div>

      <div className="lg:w-96 w-full">
        <DebugPanel gameState={gameState} logs={logs} />
      </div>
    </div>
  );
}

import type { GameState, GameLog } from "@/types/game-state";

interface DebugPanelProps {
  gameState: GameState;
  logs?: GameLog[];
}

function formatGameState(state: GameState) {
  const trumpSuits = ["♥️", "♦️", "♣️", "♠️"];
  const players = state.Users.map((user, i) => ({
    name: (user as any).player?.name || `Player ${i}`,
    cards: user.HandCards.filter((c) => c !== "0"),
    bet: user.Bet,
  }));

  return {
    trump: trumpSuits[state.Suit],
    currentTurn: players[state.CurrentTurn].name,
    dealer: players[state.Dealer].name,
    bid: state.Bid ? `${state.Bid} by ${players[state.Bidder].name}` : "No bid",
    score: {
      teamA: state.Score.TeamA,
      teamB: state.Score.TeamB,
    },
    players: players.map((p) => ({
      name: p.name,
      cards: p.cards.length,
      bet: p.bet,
    })),
  };
}

export function DebugPanel({ gameState, logs = [] }: DebugPanelProps) {
  return (
    <div className="w-96 bg-gray-900 text-gray-200 p-4 rounded-xl space-y-4 font-mono text-sm">
      {/* Game Logs */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase tracking-wider text-gray-400">
          Game Logs
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-xs">
              <span className="text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>{" "}
              <span className="text-blue-400">{log.player}</span>{" "}
              <span className="text-gray-300">{log.action}</span>
              {log.details && (
                <span className="text-gray-500"> ({log.details})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game State */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
          Game State
        </h3>
        <div className="space-y-2 text-xs">
          <div>
            Trump:{" "}
            <span className="text-yellow-400">
              {formatGameState(gameState).trump}
            </span>
          </div>
          <div>
            Turn:{" "}
            <span className="text-blue-400">
              {formatGameState(gameState).currentTurn}
            </span>
          </div>
          <div>
            Dealer:{" "}
            <span className="text-green-400">
              {formatGameState(gameState).dealer}
            </span>
          </div>
          <div>
            Bid:{" "}
            <span className="text-purple-400">
              {formatGameState(gameState).bid}
            </span>
          </div>
          <div>
            Score:{" "}
            <span className="text-orange-400">
              Team A {formatGameState(gameState).score.teamA} - Team B{" "}
              {formatGameState(gameState).score.teamB}
            </span>
          </div>
          <div className="mt-2">Players:</div>
          {formatGameState(gameState).players.map((p, i) => (
            <div key={i} className="pl-2">
              <span className="text-blue-400">{p.name}</span>: {p.cards} cards
              {p.bet > 0 && (
                <span className="text-purple-400"> (Bet: {p.bet})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

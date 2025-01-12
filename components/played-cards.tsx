import { PlayingCard } from "./playing-card";
import type { PlayedCard } from "../types/game-state";

interface PlayedCardsProps {
  cards: PlayedCard[];
}

export function PlayedCards({ cards }: PlayedCardsProps) {
  // Group cards by position
  const cardsByPosition = {
    0: cards.filter((c) => c.playedBy === 0), // North
    1: cards.filter((c) => c.playedBy === 1), // East
    2: cards.filter((c) => c.playedBy === 2), // South
    3: cards.filter((c) => c.playedBy === 3), // West
  };

  return (
    <div className="w-72 h-72 grid grid-cols-3 grid-rows-3 gap-2">
      {/* North */}
      <div className="col-start-2 h-full flex justify-center">
        <div className="relative h-full flex items-end">
          {cardsByPosition[0].map((card, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                right: `${(cardsByPosition[0].length - i - 1) * 8}px`,
                zIndex: i,
              }}
            >
              <PlayingCard card={card.card} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* East */}
      <div className="col-start-3 row-start-2 w-full flex items-center">
        <div className="relative w-full flex justify-start">
          {cardsByPosition[1].map((card, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${i * 8}px`,
                zIndex: i,
              }}
            >
              <PlayingCard card={card.card} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* South */}
      <div className="col-start-2 row-start-3 h-full flex justify-center">
        <div className="relative h-full flex items-start">
          {cardsByPosition[2].map((card, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                right: `${(cardsByPosition[2].length - i - 1) * 8}px`,
                zIndex: i,
              }}
            >
              <PlayingCard card={card.card} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* West */}
      <div className="col-start-1 row-start-2 w-full flex items-center">
        <div className="relative w-full flex justify-end">
          {cardsByPosition[3].map((card, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                right: `${i * 8}px`,
                zIndex: i,
              }}
            >
              <PlayingCard card={card.card} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* Center - could be used for round scores later */}
      <div className="col-start-2 row-start-2 flex justify-center items-center text-white/50">
        {/* Reserved for future round scores */}
      </div>
    </div>
  );
}

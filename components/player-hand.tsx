import { PlayingCard } from "./playing-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Player } from "../types/player";
import type { PlayedCard } from "../types/game-state";

function AIProviderIcon({ provider }: { provider: "anthropic" | "openai" }) {
  if (provider === "anthropic") {
    return (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 19.5h20L12 2zm0 4l7.5 13H4.5L12 6z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

interface PlayerHandProps {
  player: Player;
  cards: string[];
  playedCards?: PlayedCard[];
  position: "top" | "right" | "bottom" | "left";
  bet?: number;
  isDealer?: boolean;
  isTurn?: boolean;
  onPlayCard?: (card: string) => void;
  disabled?: boolean;
  legalMoves?: string[];
}

export function PlayerHand({
  player,
  cards,
  playedCards = [],
  position,
  bet,
  isDealer,
  isTurn,
  onPlayCard,
  disabled,
  legalMoves = [],
}: PlayerHandProps) {
  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2",
    right: "right-4 top-1/2 -translate-y-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2",
    left: "left-4 top-1/2 -translate-y-1/2",
  };

  const containerClasses = {
    top: "flex-col",
    right: "flex-row-reverse",
    bottom: "flex-col-reverse",
    left: "flex-row",
  };

  const cardsClasses = {
    top: "flex-row h-16",
    right: "flex-col w-16",
    bottom: "flex-row h-16",
    left: "flex-col w-16",
  };

  const rotateDirection = {
    top: null,
    right: "left",
    bottom: null,
    left: "right",
  } as const;

  const isCardPlayable = (card: string) => {
    if (disabled || !isTurn) return false;
    return legalMoves.includes(card);
  };

  return (
    <>
      <div className={`flex ${containerClasses[position]} gap-6`}>
        {/* Hand cards */}
        <div className={`flex gap-2 ${cardsClasses[position]}`}>
          {cards
            .filter((c) => c !== "0")
            .map((card, i) => (
              <PlayingCard
                key={i}
                card={card}
                size="sm"
                rotate={rotateDirection[position]}
                onClick={
                  onPlayCard && isCardPlayable(card)
                    ? () => onPlayCard(card)
                    : undefined
                }
                disabled={!isCardPlayable(card)}
              />
            ))}
        </div>

        {/* Player info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>
              {player.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-white">
            <div className="font-bold">{player.name}</div>
            <div className="text-sm flex items-center">
              {player.type === "ai" && (
                <span className="text-blue-300 flex items-center">
                  {player.config?.provider && (
                    <AIProviderIcon provider={player.config.provider} />
                  )}
                </span>
              )}
              {bet !== undefined && (
                <span className="ml-2 text-yellow-400">Bet: {bet}</span>
              )}
              {isDealer && (
                <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  D
                </span>
              )}
              {isTurn && (
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Turn
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Played cards */}
        <div
          className={`relative flex ${cardsClasses[position]} justify-center w-full`}
        >
          {playedCards.map((card, i) => (
            <div
              key={i}
              className=""
              style={{
                left: `${i * 16}px`,
                zIndex: i,
              }}
            >
              <PlayingCard
                card={card.card}
                size="sm"
                rotate={rotateDirection[position]}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

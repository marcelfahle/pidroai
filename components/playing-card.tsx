import { cn } from "@/lib/utils";

interface PlayingCardProps {
  card: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  rotate?: "left" | "right" | null;
}

const suitSymbols: Record<string, string> = {
  h: "♥️",
  d: "♦️",
  c: "♣️",
  s: "♠️",
};

const suitColors: Record<string, string> = {
  h: "text-red-500",
  d: "text-red-500",
  c: "text-gray-900",
  s: "text-gray-900",
};

export function PlayingCard({
  card,
  size = "md",
  onClick,
  disabled,
  rotate = null,
}: PlayingCardProps) {
  if (card === "0") return null;

  const suit = card[0];
  const value = card.slice(1);
  const suitSymbol = suitSymbols[suit];
  const color = suitColors[suit];

  const sizeClasses = {
    sm: "w-10 h-14",
    md: "w-14 h-20",
    lg: "w-16 h-24",
  };

  const valueSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const rotateClasses = {
    left: "-rotate-90",
    right: "rotate-90",
    none: "",
  } as const;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative bg-white rounded-lg shadow-md p-1.5 flex",
        sizeClasses[size],
        rotateClasses[rotate || "none"],
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 transition-transform cursor-pointer"
      )}
    >
      <div className={cn("flex flex-col", color)}>
        <span className={cn("font-bold leading-none", valueSizes[size])}>
          {value}
        </span>
        <span className={valueSizes[size]}>{suitSymbol}</span>
      </div>
    </button>
  );
}

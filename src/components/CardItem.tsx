import { memo } from "react";
import type { CardItemProps } from "../types/api";

const CardItem: React.FC<CardItemProps> = memo(
  ({ card, onCardClick, className = "" }) => {
    if (!card || !card.name) return null;

    const getImageUrl = (): string | null => {
      if (!card.images) return null;
      return card.images.large || card.images.small || null;
    };

    const getColorClasses = (color: string): string => {
      const map: Record<string, string> = {
        Red: "bg-red-500",
        Blue: "bg-blue-500",
        Green: "bg-green-500",
        Yellow: "bg-yellow-400 text-gray-900",
        Purple: "bg-purple-500",
        Black: "bg-gray-800",
      };
      return map[color] || "bg-gray-400";
    };

    const formatNumber = (
      value: number | string | null | undefined,
    ): string => {
      if (value == null || value === "-") return "-";
      const num = typeof value === "string" ? parseInt(value, 10) : value;
      if (isNaN(num)) return String(value);
      return num.toLocaleString("id-ID");
    };

    const safeRender = (value: unknown): string => {
      if (value == null) return "";
      if (typeof value === "string" || typeof value === "number")
        return String(value);
      return "";
    };

    const imageUrl = getImageUrl();

    return (
      <article
        className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 cursor-pointer ${className}`}
        onClick={() => onCardClick?.(card)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onCardClick?.(card)}
        aria-label={`View details for ${card.name}`}
      >
        <div className="relative aspect-3/4 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl || ""}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("placehold.co")) {
                  target.src =
                    "https://placehold.co/300x400/1a1a1a/ffffff?text=OPTCG";
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {card.rarity && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              {safeRender(card.rarity)}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 group-hover:text-optcg-red transition-colors">
            {safeRender(card.name)}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {card.color && (
              <span
                className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getColorClasses(safeRender(card.color))}`}
              >
                {safeRender(card.color)}
              </span>
            )}
            {card.type && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {safeRender(card.type)}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-gray-600">
            {card.cost != null && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Cost:</span>
                <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {formatNumber(card.cost)}
                </span>
              </div>
            )}
            {card.power != null && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Power:</span>
                <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {formatNumber(card.power)}
                </span>
              </div>
            )}
            {card.counter && card.counter !== "-" && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Counter:</span>
                <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {formatNumber(card.counter)}
                </span>
              </div>
            )}
            {card.set?.name && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Set:</span>
                <span
                  className="font-semibold text-gray-800 truncate max-w-30"
                  title={safeRender(card.set.name)}
                >
                  {safeRender(card.set.name)}
                </span>
              </div>
            )}
          </div>

          {(card.family || card.attribute?.name) && (
            <div className="pt-2 border-t flex flex-wrap gap-1.5">
              {card.family && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {safeRender(card.family)}
                </span>
              )}
              {card.attribute?.name && (
                <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                  {safeRender(card.attribute.name)}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    );
  },
);

CardItem.displayName = "CardItem";
export default CardItem;

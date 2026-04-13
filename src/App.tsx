import { useState, useCallback } from "react";
import CardList from "./components/CardList";
import type { OPTCGCard } from "./types/api";

function App() {
  const [selectedCard, setSelectedCard] = useState<OPTCGCard | null>(null);

  const handleCardClick = useCallback((card: OPTCGCard) => {
    setSelectedCard(card);
  }, []);

  const safeRender = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    return "";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex flex-col">
      <header className="bg-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                🏴‍☠️
              </span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  One Piece TCG Web
                </h1>
                <p className="text-red-100 text-xs md:text-sm">
                  Tempatnya para nakama mencari kartu One Piece TCG favorit
                  mereka!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-linear-to-r from-yellow-400 via-red-500 to-purple-600"></div>
      </header>

      <main className="flex-1">
        <CardList onCardClick={handleCardClick} />
      </main>

      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCard.name}
                </h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-3/4 bg-gray-100 rounded-xl overflow-hidden">
                  {selectedCard && (
                    <div
                      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                      onClick={() => setSelectedCard(null)}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="card-detail-title"
                    >
                      <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h2
                              id="card-detail-title"
                              className="text-2xl font-bold text-gray-900"
                            >
                              {String(selectedCard.name || "Unknown Card")}
                            </h2>
                            <button
                              onClick={() => setSelectedCard(null)}
                              className="p-2 hover:bg-gray-100 rounded-full transition"
                              aria-label="Close detail"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="aspect-3/4 bg-gray-100 rounded-xl overflow-hidden">
                              {selectedCard.images?.large ? (
                                <img
                                  src={selectedCard.images.large} 
                                  alt={selectedCard.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    if (
                                      selectedCard.images?.small &&
                                      target.src !== selectedCard.images.small
                                    ) {
                                      target.src = selectedCard.images.small;
                                    } else if (
                                      !target.src.includes("placehold.co")
                                    ) {
                                      target.src =
                                        "https://placehold.co/300x400/1a1a1a/ffffff?text=No+Image";
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
                            </div>

                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {selectedCard.color && (
                                  <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
                                    {String(selectedCard.color)}
                                  </span>
                                )}
                                {selectedCard.rarity && (
                                  <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold rounded-full">
                                    {String(selectedCard.rarity)}
                                  </span>
                                )}
                                {selectedCard.type && (
                                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                                    {String(selectedCard.type)}
                                  </span>
                                )}
                              </div>

                              <dl className="space-y-2 text-sm">
                                {selectedCard.cost != null && (
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Cost:</dt>
                                    <dd className="font-semibold">
                                      {Number(selectedCard.cost).toLocaleString(
                                        "id-ID",
                                      )}
                                    </dd>
                                  </div>
                                )}
                                {selectedCard.power != null && (
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Power:</dt>
                                    <dd className="font-semibold">
                                      {Number(
                                        selectedCard.power,
                                      ).toLocaleString("id-ID")}
                                    </dd>
                                  </div>
                                )}
                                {selectedCard.counter &&
                                  selectedCard.counter !== "-" && (
                                    <div className="flex justify-between">
                                      <dt className="text-gray-500">
                                        Counter:
                                      </dt>
                                      <dd className="font-semibold">
                                        {typeof selectedCard.counter ===
                                        "string"
                                          ? selectedCard.counter
                                          : Number(
                                              selectedCard.counter,
                                            ).toLocaleString("id-ID")}
                                      </dd>
                                    </div>
                                  )}
                                {selectedCard.set?.name && (
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Set:</dt>
                                    <dd className="font-semibold">
                                      {String(selectedCard.set.name)}
                                    </dd>
                                  </div>
                                )}
                                {selectedCard.family && (
                                  <div className="flex justify-between">
                                    <dt className="text-gray-500">Family:</dt>
                                    <dd className="font-semibold">
                                      {String(selectedCard.family)}
                                    </dd>
                                  </div>
                                )}
                              </dl>

                              {(selectedCard.ability ||
                                selectedCard.effect) && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    Ability:
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed">
                                    {String(
                                      selectedCard.ability ||
                                        selectedCard.effect ||
                                        "",
                                    )}
                                  </p>
                                </div>
                              )}

                              {selectedCard.attribute?.image && (
                                <div className="pt-2 border-t">
                                  <span className="text-xs text-gray-500">
                                    Attribute:
                                  </span>
                                  <div className="flex items-center gap-2 mt-1">
                                    {selectedCard.attribute.name && (
                                      <span className="text-sm">
                                        {String(selectedCard.attribute.name)}
                                      </span>
                                    )}
                                    <img
                                      src={String(selectedCard.attribute.image)}
                                      alt={
                                        selectedCard.attribute.name ||
                                        "Attribute"
                                      }
                                      className="w-6 h-6 object-contain"
                                      onError={(e) =>
                                        (e.currentTarget.style.display = "none")
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.color && (
                      <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
                        {selectedCard.color}
                      </span>
                    )}
                    {selectedCard.rarity && (
                      <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold rounded-full">
                        {selectedCard.rarity}
                      </span>
                    )}
                    {selectedCard.type && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        {selectedCard.type}
                      </span>
                    )}
                  </div>
                  <dl className="space-y-2 text-sm">
                    {selectedCard.cost != null && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Cost:</dt>
                        <dd className="font-semibold">{selectedCard.cost}</dd>
                      </div>
                    )}
                    {selectedCard.power != null && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Power:</dt>
                        <dd className="font-semibold">
                          {selectedCard.power.toLocaleString("id-ID")}
                        </dd>
                      </div>
                    )}
                    {selectedCard.set?.name && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Set:</dt>
                        <dd className="font-semibold">
                          {selectedCard.set.name}
                        </dd>
                      </div>
                    )}
                    {selectedCard.family && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Family:</dt>
                        <dd className="font-semibold">
                          {safeRender(selectedCard.family)}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {(selectedCard.ability || selectedCard.effect) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Ability:
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedCard.ability || selectedCard.effect}
                      </p>
                    </div>
                  )}
                  {selectedCard.effect && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Effect:
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedCard.effect}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-400 py-6 mt-12 text-center text-sm">
        <p>
          Built with ❤️ By Surya Nata Ardhana | Data from{" "}
          <a
            href="https://apitcg.com"
            className="text-optcg-red hover:underline"
          >
            ApiTCG
          </a>
        </p>
        <p className="mt-1">{new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;

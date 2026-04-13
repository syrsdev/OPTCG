import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "../services/api";
import CardItem from "./CardItem";
import Pagination from "./Pagination";
import type { CardFilterParams, OPTCGCard, PaginationMeta } from "../types/api";

interface CardListProps {
  onCardClick?: (card: OPTCGCard) => void;
}

const CardList: React.FC<CardListProps> = ({ onCardClick }) => {
  const [cards, setCards] = useState<OPTCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CardFilterParams>({});
  const abortRef = useRef<AbortController | null>(null);

  const loadCards = useCallback(
    async (
      searchTerm: string,
      filterParams: CardFilterParams,
      page: number,
    ) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const params: CardFilterParams = {
          ...(searchTerm && { name: searchTerm }),
          ...filterParams,
          page,
          limit: 20,
        };

        const result = await apiService.fetchCards(
          params,
          abortRef.current.signal,
        );
        setCards(result.cards);
        setPagination(result.pagination);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Gagal memuat data. Periksa API Key atau koneksi internet.");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadCards(search, filters, pagination.currentPage);
    return () => abortRef.current?.abort();
  }, [loadCards, search, filters, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (key: keyof CardFilterParams, value: string) => {
    const newFilters = { ...filters, [key]: value === "" ? undefined : value };
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const resetAll = () => {
    setSearch("");
    setFilters({});
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (loading && cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-optcg-red border-t-transparent" />
        <p className="mt-3 text-gray-600">Memuat kartu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={() => loadCards(search, filters, pagination.currentPage)}
          className="mt-2 text-sm font-medium text-red-600 hover:underline"
        >
          Coba lagi →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari nama kartu (Luffy, Zoro...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optcg-red focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-optcg-red hover:bg-optcg-dark text-white font-medium rounded-lg transition-colors"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <select
            value={filters.color || ""}
            onChange={(e) => handleFilterChange("color", e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-optcg-red"
          >
            <option value="">Semua Warna</option>
            {["Red", "Blue", "Green", "Yellow", "Purple", "Black"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filters.rarity || ""}
            onChange={(e) => handleFilterChange("rarity", e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-optcg-red"
          >
            <option value="">Semua Rarity</option>
            {["C", "U", "R", "SR", "UR", "SEC"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-optcg-red"
          >
            <option value="">Semua Tipe</option>
            {["Character", "Event", "Stage", "Leader"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p className="mb-2 text-gray-600">
        Menampilkan{" "}
        <span className="font-semibold text-optcg-red">{cards.length}</span>{" "}
        dari{" "}
        <span className="font-semibold">
          {pagination.totalItems > 0 ? pagination.totalItems : "..."}
        </span>{" "}
        kartu{" "}
        {pagination.totalPages > 1 &&
          `(Halaman ${pagination.currentPage}/${pagination.totalPages})`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <CardItem
            key={
              card.id || card.code || `card-${pagination.currentPage}-${index}`
            }
            card={card}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      {cards.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-gray-900">
            Tidak ada kartu ditemukan
          </p>
          <p className="text-gray-500 mt-1">
            Coba ubah kata kunci atau filter pencarian
          </p>
        </div>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default CardList;

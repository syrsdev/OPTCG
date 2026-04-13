export interface OPTCGCardImage {
  small?: string;
  large?: string;
}

export interface OPTCGCardAttribute {
  name?: string;
  image?: string;
}

export interface OPTCGCardSet {
  name?: string;
  code?: string;
}

export interface OPTCGCard {
  id: string;
  code?: string;
  name: string;
  type: string;
  rarity: string;
  color: string;
  cost?: number | null;
  power?: number | null;
  counter?: string | number | null;

  images?: OPTCGCardImage | null;
  attribute?: OPTCGCardAttribute | null;
  set?: OPTCGCardSet | null;

  family?: string;
  ability?: string;
  trigger?: string;
  effect?: string;
  flavor?: string;
  notes?: unknown[];

  [key: string]: unknown;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchCardsResult {
  cards: OPTCGCard[];
  pagination: PaginationMeta;
}

export interface ApiTCGResponse<T> {
  data?: T[];
  cards?: T[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface CardFilterParams {
  name?: string;
  color?: string;
  rarity?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface CardItemProps {
  card: OPTCGCard;
  onCardClick?: (card: OPTCGCard) => void;
  className?: string;
}

export const isValidCard = (item: unknown): item is OPTCGCard => {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    typeof (item as OPTCGCard).name === "string" &&
    "id" in item
  );
};

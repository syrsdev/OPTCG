import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import type {
  ApiTCGResponse,
  CardFilterParams,
  OPTCGCard,
  FetchCardsResult,
  PaginationMeta,
} from "../types/api";

const IMAGE_PROXY = "https://images.weserv.nl/?url=";

const proxyImageUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;
  return `${IMAGE_PROXY}${encodeURIComponent(url)}`;
};

class ApiTCGService {
  private api: AxiosInstance;

  constructor() {
    const isProduction = import.meta.env.PROD;
    const baseURL = isProduction
      ? "https://api.codetabs.com/v1/proxy?quest=https://apitcg.com/api/one-piece"
      : import.meta.env.VITE_API_BASE_URL;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (import.meta.env.DEV) {
      headers["x-api-key"] = import.meta.env.VITE_API_TCG_KEY;
    }

    this.api = axios.create({
      baseURL,
      headers,
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (import.meta.env.DEV) {
          console.log(
            `🔍 Request: ${config.method?.toUpperCase()} ${config.url}`,
          );
        }
        return config;
      },
      (error: AxiosError) => {
        if (error.name !== "CanceledError") {
          console.error("❌ Request Error:", error.message);
        }
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.name !== "CanceledError") {
          console.error("❌ API Error:", error.response?.data || error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  public async fetchCards(
    params: CardFilterParams = {},
    signal?: AbortSignal,
  ): Promise<FetchCardsResult> {
    try {
      const cleanParams = Object.entries(params).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value != null && value !== "") {
            acc[key] = String(value);
          }
          return acc;
        },
        {},
      );

      const defaultLimit = 20;
      const page = params.page || 1;

      const isProduction = import.meta.env.PROD;
      const requestParams = {
        ...cleanParams,
        page,
        limit: defaultLimit,
        ...(isProduction && { api_key: import.meta.env.VITE_API_TCG_KEY }),
      };

      const response = await this.api.get<ApiTCGResponse<unknown>>("/cards", {
        params: requestParams,
        signal,
      });

      const rawData = response.data?.data || response.data?.cards || [];

      if (!Array.isArray(rawData)) {
        return {
          cards: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: defaultLimit,
          },
        };
      }

      const cards = rawData
        .filter(
          (item): item is Record<string, unknown> =>
            item !== null && typeof item === "object" && "name" in item,
        )
        .map((item) => this.mapToCard(item))
        .filter(
          (card): card is OPTCGCard => card.name != null && card.name !== "",
        );

      const total = Number(response.data?.total) || 0;
      const limit = Number(response.data?.limit) || defaultLimit;
      const totalPages =
        total > 0 ? Math.ceil(total / limit) : cards.length > 0 ? page : 1;

      const pagination: PaginationMeta = {
        currentPage: page,
        totalPages: Math.max(totalPages, 1),
        totalItems: total,
        itemsPerPage: limit,
      };

      return { cards, pagination };
    } catch (error: any) {
      if (axios.isCancel(error) || error?.name === "CanceledError") {
        return {
          cards: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 20,
          },
        };
      }
      console.error("fetchCards error:", error);
      throw error;
    }
  }

  private mapToCard(item: Record<string, unknown>): OPTCGCard {
    const rawImages =
      item.images && typeof item.images === "object"
        ? (item.images as Record<string, unknown>)
        : undefined;

    const rawAttribute =
      item.attribute && typeof item.attribute === "object"
        ? (item.attribute as Record<string, unknown>)
        : undefined;

    const rawSet =
      item.set && typeof item.set === "object"
        ? (item.set as Record<string, unknown>)
        : undefined;

    return {
      id: String(item.id || item.code || ""),
      code: item.code as string | undefined,
      name: String(item.name || "Unknown"),
      type: String(item.type || ""),
      rarity: String(item.rarity || ""),
      color: String(item.color || ""),
      cost: item.cost != null ? Number(item.cost) : null,
      power: item.power != null ? Number(item.power) : null,
      counter:
        typeof item.counter === "string" || typeof item.counter === "number"
          ? item.counter
          : undefined,
      images: rawImages
        ? {
            small: proxyImageUrl(rawImages.small as string),
            large: proxyImageUrl(rawImages.large as string),
          }
        : undefined,
      attribute: rawAttribute
        ? {
            name: rawAttribute.name as string | undefined,
            image: proxyImageUrl(rawAttribute.image as string),
          }
        : undefined,
      set: rawSet
        ? {
            name: rawSet.name as string | undefined,
            code: rawSet.code as string | undefined,
          }
        : undefined,
      family: item.family as string | undefined,
      ability: item.ability as string | undefined,
      trigger: item.trigger as string | undefined,
      effect: item.effect as string | undefined,
      flavor: item.flavor as string | undefined,
      notes: Array.isArray(item.notes) ? item.notes : [],
    };
  }
}

export const apiService = new ApiTCGService();
export default apiService;

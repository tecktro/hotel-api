/**
 * Competitor price data interface
 */
export interface ICompetitorPrice {
  competitor_name: string;
  gross_amount: number;
  net_amount: number;
}

/**
 * Hotel data from external API
 */
export interface IHotelApiData {
  hotel: {
    rooms: IRoom[];
  };
  prices: Record<string, ISnapshot[][]>;
}

/**
 * Room interface
 */
export interface IRoom {
  room_id: string;
  room_name: string;
  room_type: string;
  prices?: Record<string, any>;
}

/**
 * Price snapshot interface
 */
export interface ISnapshot {
  [key: string]: any;
}

/**
 * Resolved metrics interface
 */
export interface IResolvedMetrics {
  room_id: string;
  room_name: string;
  date: string;
  metrics: {
    best_price: ICompetitorPrice | null;
    average_price: ICompetitorPrice | null;
    worst_price: ICompetitorPrice | null;
  };
}

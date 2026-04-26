/**
 * Competitor price entry for insights
 */
export interface ICompetitorPriceEntry {
  competitor_name: string;
  currency: number;
  taxes: number;
  amount: number;
  date: string;
}

/**
 * Room insight data
 */
export interface IRoomInsight {
  room_id: string;
  room_name: string;
  room_type: string;
  prices: ICompetitorPriceEntry[];
  last_updated_at: string;
}

/**
 * Insights response
 */
export interface IInsightsResponse {
  room: IRoomInsight | null;
}

/**
 * Date range interface
 */
export interface IDateRange {
  startDate: string;
  endDate: string;
}

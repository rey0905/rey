export type StockStatus = 'holding' | 'watching';
export type ReviewType = 'sell_early' | 'correct_sell' | 'none';

export interface Stock {
  id: string;
  name: string; // 股票名称
  code: string; // 代码
  sector: string; // 行业领域
  
  // Logic
  buyLogic: string; // 买入/看好理由
  sellLogic: string; // 抛售/撤退逻辑
  
  // Status
  isPotential: boolean; // 是否在潜力池
  status: StockStatus; // 主线中的状态：已买入 or 观察中

  // Portfolio Data
  buyPrice?: string;
  quantity?: string;
  buyDate?: string;

  // Review Data
  soldPrice?: string;
  currentPrice?: string; // For comparison in review
  reviewReason?: string; // 当时卖出的理由
  reviewType: ReviewType;
  
  createdAt: number;
}

export interface SectorGroup {
  name: string;
  stocks: Stock[];
}
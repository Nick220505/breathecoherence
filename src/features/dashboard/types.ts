export interface SalesOverviewData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
}

export interface ProductStockData {
  id: string;
  name: string;
  stock: number;
}

export interface RecentActivityData {
  id: string;
  type: 'order' | 'user';
  description: string;
  createdAt: string;
  status?: string;
  amount?: number;
}

export interface TotalStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface DashboardAnalyticsData {
  salesOverview: SalesOverviewData[];
  orderStatus: OrderStatusData[];
  productStock: ProductStockData[];
  recentActivity: RecentActivityData[];
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

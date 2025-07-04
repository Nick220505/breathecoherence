'use server';

import { createServerAction } from 'zsa';

import { dashboardService } from '@/features/dashboard/service';
import type {
  DashboardAnalyticsData,
  OrderStatusData,
  ProductStockData,
  RecentActivityData,
  SalesOverviewData,
} from '@/features/dashboard/types';

export const getSalesOverviewData = createServerAction().handler(
  async (): Promise<SalesOverviewData[]> => {
    return dashboardService.getSalesOverviewData();
  },
);

export const getOrderStatusData = createServerAction().handler(
  async (): Promise<OrderStatusData[]> => {
    return dashboardService.getOrderStatusData();
  },
);

export const getProductStockData = createServerAction().handler(
  async (): Promise<ProductStockData[]> => {
    return dashboardService.getProductStockData();
  },
);

export const getRecentActivityData = createServerAction().handler(
  async (): Promise<RecentActivityData[]> => {
    return dashboardService.getRecentActivityData();
  },
);

export const getDashboardAnalytics = createServerAction().handler(
  async (): Promise<DashboardAnalyticsData> => {
    return dashboardService.getDashboardAnalytics();
  },
);

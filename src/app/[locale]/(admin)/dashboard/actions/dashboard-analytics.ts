'use server';

import { dashboardService } from '@/features/dashboard/service';
import { actionClient, actionClientWithLocale } from '@/lib/safe-action';
import type {
  DashboardAnalyticsData,
  OrderStatusData,
  ProductStockData,
  RecentActivityData,
  SalesOverviewData,
} from '@/features/dashboard/types';

export const getSalesOverviewData = actionClient.action(
  async (): Promise<SalesOverviewData[]> => {
    return dashboardService.getSalesOverviewData();
  },
);

export const getOrderStatusData = actionClient.action(
  async (): Promise<OrderStatusData[]> => {
    return dashboardService.getOrderStatusData();
  },
);

export const getProductStockData = actionClientWithLocale.action(
  async ({ ctx: { locale } }): Promise<ProductStockData[]> => {
    return dashboardService.getProductStockData(locale);
  },
);

export const getRecentActivityData = actionClient.action(
  async (): Promise<RecentActivityData[]> => {
    return dashboardService.getRecentActivityData();
  },
);

export const getDashboardAnalytics = actionClientWithLocale.action(
  async ({ ctx: { locale } }): Promise<DashboardAnalyticsData> => {
    return dashboardService.getDashboardAnalytics(locale);
  },
);

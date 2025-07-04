'use server';

import { createServerAction } from 'zsa';

import { dashboardService } from '@/features/dashboard/service';
import { withLocaleProcedure } from '@/lib/zsa';
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

export const getProductStockData = withLocaleProcedure
  .createServerAction()
  .handler(async ({ ctx: { locale } }): Promise<ProductStockData[]> => {
    return dashboardService.getProductStockData(locale);
  });

export const getRecentActivityData = createServerAction().handler(
  async (): Promise<RecentActivityData[]> => {
    return dashboardService.getRecentActivityData();
  },
);

export const getDashboardAnalytics = withLocaleProcedure
  .createServerAction()
  .handler(async ({ ctx: { locale } }): Promise<DashboardAnalyticsData> => {
    return dashboardService.getDashboardAnalytics(locale);
  });

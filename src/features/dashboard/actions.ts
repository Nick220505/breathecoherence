'use server';

import { actionClient, actionClientWithLocale } from '@/lib/safe-action';

import { dashboardService } from './service';

export const getSalesOverviewData = actionClient.action(() =>
  dashboardService.getSalesOverviewData(),
);

export const getOrderStatusData = actionClient.action(() =>
  dashboardService.getOrderStatusData(),
);

export const getProductStockData = actionClientWithLocale.action(
  ({ ctx: { locale } }) => dashboardService.getProductStockData(locale),
);

export const getRecentActivityData = actionClient.action(() =>
  dashboardService.getRecentActivityData(),
);

import { orderService } from '@/features/order/service';
import { productService } from '@/features/product/service';
import { userService } from '@/features/user/service';
import type { Locale } from '@/i18n/routing';
import type {
  DashboardAnalyticsData,
  OrderStatusData,
  ProductStockData,
  RecentActivityData,
  SalesOverviewData,
  TotalStats,
} from './types';

export const dashboardService = {
  async getSalesOverviewData(): Promise<SalesOverviewData[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await orderService.getOrdersInDateRange(
      sevenDaysAgo,
      new Date(),
    );

    const salesByDay = new Map<string, { revenue: number; orders: number }>();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDay.set(dateStr, { revenue: 0, orders: 0 });
    }

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDay.get(dateStr);
      if (existing) {
        existing.revenue += order.total;
        existing.orders += 1;
      }
    });

    return Array.from(salesByDay.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  async getOrderStatusData(): Promise<OrderStatusData[]> {
    const orders = await orderService.getAll();

    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  },

  async getProductStockData(locale: Locale): Promise<ProductStockData[]> {
    const products = await productService.getAll(locale);

    return products
      .map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
      }))
      .sort((a, b) => a.stock - b.stock);
  },

  async getRecentActivityData(): Promise<RecentActivityData[]> {
    const [recentOrders, recentUsers] = await Promise.all([
      orderService.getRecentOrders(5),
      userService.getAll(5),
    ]);

    const activities: RecentActivityData[] = [];

    recentOrders.forEach((order) => {
      activities.push({
        id: order.id,
        type: 'order',
        description: `Order from ${order.user.email}`,
        createdAt: order.createdAt.toISOString(),
        status: order.status,
        amount: order.total,
      });
    });

    recentUsers.forEach((user) => {
      activities.push({
        id: user.id,
        type: 'user',
        description: `New user: ${user.email}`,
        createdAt: user.createdAt.toISOString(),
      });
    });

    return activities
      .toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  },

  async getDashboardAnalytics(locale: Locale): Promise<DashboardAnalyticsData> {
    const [
      salesOverview,
      orderStatus,
      productStock,
      recentActivity,
      totalStats,
    ] = await Promise.all([
      this.getSalesOverviewData(),
      this.getOrderStatusData(),
      this.getProductStockData(locale),
      this.getRecentActivityData(),
      this.getTotalStats(),
    ]);

    return {
      salesOverview,
      orderStatus,
      productStock,
      recentActivity,
      ...totalStats,
    };
  },

  async getTotalStats(): Promise<TotalStats> {
    const [orders, productCount, userCount] = await Promise.all([
      orderService.getAll(),
      productService.getCount(),
      userService.getCount(),
    ]);

    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      totalOrders: orders.length,
      totalProducts: productCount,
      totalUsers: userCount,
    };
  },
};

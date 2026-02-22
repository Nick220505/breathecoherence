import { Activity, ShoppingCart, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getRecentActivityData } from '../actions/dashboard-analytics';

export async function RecentActivityChart() {
  const t = await getTranslations('RecentActivityChart');
  const { data: activityData, serverError } = await getRecentActivityData();

  if (serverError || !activityData) {
    throw new Error(t('error.loadActivityData'));
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'user':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">{t('status.pending')}</Badge>;
      case 'PAID':
        return <Badge variant="default">{t('status.paid')}</Badge>;
      case 'SHIPPED':
        return <Badge variant="outline">{t('status.shipped')}</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return t('timeAgo.justNow');
    } else if (diffInHours < 24) {
      return t('timeAgo.hoursAgo', { hours: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return t('timeAgo.daysAgo', { days: diffInDays });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('title')}</CardTitle>
        <Activity className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">{t('noActivity')}</p>
            </div>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {activityData.map((activity, index) => (
                <div
                  key={`${activity.type}-${activity.id}-${index}`}
                  className="bg-muted/50 flex items-start space-x-3 rounded-lg p-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.type === 'order'
                          ? t('newOrder')
                          : t('newUser')}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatTimeAgo(activity.createdAt)}
                      </p>
                    </div>

                    <p className="text-muted-foreground truncate text-sm">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {activity.status && (
                        <div>{getStatusBadge(activity.status)}</div>
                      )}
                      {activity.amount && (
                        <p className="text-sm font-medium">
                          ${activity.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Statistic } from '@/types';

interface StatCardProps {
  stat: Statistic;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            
            {stat.change !== undefined && (
              <p className={cn(
                "text-xs font-medium mt-1",
                stat.change > 0 ? "text-green-500" : stat.change < 0 ? "text-red-500" : "text-gray-500"
              )}>
                {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
                <span className="text-gray-400 mr-1">مقارنة بالأسبوع الماضي</span>
              </p>
            )}
          </div>
          
          {stat.icon && (
            <div className="p-2 bg-primary-light rounded-full">
              {stat.icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

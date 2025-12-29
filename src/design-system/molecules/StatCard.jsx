import React from 'react';
import { Card, CardContent } from '../atoms/Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';

/**
 * StatCard Component
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.subValue] - e.g. "Total Inventory volume"
 * @param {'up'|'down'|'neutral'} [props.trend]
 * @param {string} [props.trendValue] - e.g. "12%"
 * @param {string} [props.className]
 */
const StatCard = ({ label, value, subValue, trend, trendValue, className }) => {
  return (
    <Card className={clsx("hover:shadow-md transition-shadow duration-200 border-border/60", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{value}</h2>
            {trend && (
              <div className={clsx(
                "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                trend === 'up' && "text-emerald-700 bg-emerald-50",
                trend === 'down' && "text-rose-700 bg-rose-50",
                trend === 'neutral' && "text-slate-700 bg-slate-50"
              )}>
                {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
                {trend === 'down' && <ArrowDownRight className="mr-1 h-3 w-3" />}
                {trend === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
                {trendValue}
              </div>
            )}
          </div>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-2">{subValue}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

import { FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

interface RatingsTrendChartProps {
  data: { rating: number; date: number; month: string }[];
  className?: string;
}

const RatingsTrendChart: FC<RatingsTrendChartProps> = ({ data, className }) => {
  const chartConfig = {
    rating: {
      label: 'Rating',
      color: 'hsl(45 93% 47%)', // yellow-500 equivalent for ratings
    },
  };

  return (
    <div className={`mt-4 ${className}`}>
      {data && data.length > 0 ? (
        <div className="h-24 rounded-md bg-white/5 border border-white/10 p-2">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(234 179 8)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgb(234 179 8)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: 'rgba(255, 255, 255, 0.6)' }}
                interval={0}
                height={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: 'rgba(255, 255, 255, 0.6)' }}
                domain={[0, 5]}
                tickFormatter={(value) => `${value}★`}
                width={20}
              />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="rgb(234 179 8)"
                strokeWidth={2}
                fill="url(#ratingGradient)"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: 'rgb(234 179 8)',
                  stroke: 'rgb(255 255 255)',
                  strokeWidth: 2,
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${Number(value).toFixed(1)}★`, 'Rating']}
                    labelFormatter={(label) => `${label}`}
                    className="bg-black/90 border-white/20 text-white"
                  />
                }
              />
            </AreaChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="mt-4 h-24 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
          <div className="text-white/60 text-xs">No rating trend yet</div>
        </div>
      )}
    </div>
  );
};

export default RatingsTrendChart;

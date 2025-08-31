import { FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

interface PriceTrendChartProps {
  data: { price: number; date: number; month: string }[];
  className?: string;
}

const PriceTrendChart: FC<PriceTrendChartProps> = ({ data, className }) => {
  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(158 64% 52%)', // emerald-400 equivalent
    },
  };

  return (
    <div className={`mt-4 ${className}`}>
      {data && data.length > 0 ? (
        <div className="h-24 rounded-md bg-white/5 border border-white/10 p-2">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(52 211 153)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgb(52 211 153)" stopOpacity={0.1} />
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
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={20}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="rgb(52 211 153)"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: 'rgb(52 211 153)',
                  stroke: 'rgb(255 255 255)',
                  strokeWidth: 2,
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
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
          <div className="text-white/60 text-xs">No price trend yet</div>
        </div>
      )}
    </div>
  );
};

export default PriceTrendChart;

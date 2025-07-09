'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { Progress } from '@/lib/types';

interface GoalProgressChartProps {
  progress: Progress[];
}

export function GoalProgressChart({ progress }: GoalProgressChartProps) {
  // Transform progress data for the chart
  const chartData = progress
    .slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.recordedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: entry.value,
      unit: entry.unit,
      note: entry.note,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  // Calculate min and max for better Y-axis scaling
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1 || 10;
  const yAxisMin = Math.max(0, minValue - padding);
  const yAxisMax = maxValue + padding;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: '#6b7280' }}
            domain={[yAxisMin, yAxisMax]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#111827', fontWeight: 600 }}
            formatter={(value: number, name: string, props: any) => {
              const unit = props.payload.unit;
              return [`${value} ${unit}`, 'Progress'];
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProgress)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
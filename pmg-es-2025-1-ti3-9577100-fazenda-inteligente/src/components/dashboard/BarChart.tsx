
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  fill?: string;
  className?: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  dataKey,
  xAxisKey = 'name',
  fill = '#40916C',
  className,
  height = 300
}) => {
  const { theme } = useTheme();
  
  const textColor = theme === 'dark' ? '#E9EDC9' : '#2D6A4F';
  const gridColor = theme === 'dark' ? 'rgba(233, 237, 201, 0.1)' : 'rgba(45, 106, 79, 0.1)';

  return (
    <Card className={cn("cattle-card", className)}>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1E3A29' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#40916C' : '#D4A373',
                  color: textColor
                }}
              />
              <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;

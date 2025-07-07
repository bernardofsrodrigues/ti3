
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface PieChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  className?: string;
  height?: number;
}

const COLORS = ['#2D6A4F', '#40916C', '#D4A373', '#E9EDC9', '#95D5B2', '#74C69D', '#52B788'];

const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  className,
  height = 300
}) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#E9EDC9' : '#2D6A4F';

  return (
    <Card className={cn("cattle-card", className)}>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1E3A29' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#40916C' : '#D4A373',
                  color: textColor
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;

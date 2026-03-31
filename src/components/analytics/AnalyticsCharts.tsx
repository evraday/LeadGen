'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  primary: '#004AAD',
  green: '#38A169',
  orange: '#ED8936',
  purple: '#805AD5',
  red: '#E53E3E',
  gray: '#718096',
};

interface MessageActivityChartProps {
  data: { date: string; sent: number; opened: number; replied: number }[];
}

export function MessageActivityChart({ data }: MessageActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#CBD5E0" />
        <YAxis tick={{ fontSize: 12 }} stroke="#CBD5E0" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="sent"
          stroke={COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Sent"
        />
        <Line
          type="monotone"
          dataKey="opened"
          stroke={COLORS.green}
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Opened"
        />
        <Line
          type="monotone"
          dataKey="replied"
          stroke={COLORS.orange}
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Replied"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ConversionFunnelChartProps {
  data: { stage: string; count: number }[];
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} stroke="#CBD5E0" />
        <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} stroke="#CBD5E0" width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Count">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface LeadsBySourceChartProps {
  data: { source: string; count: number }[];
}

export function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  const sourceColors: Record<string, string> = {
    linkedin: '#0077B5',
    twitter: '#1DA1F2',
    google: '#EA4335',
    instagram: '#E1306C',
    manual: '#718096',
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="count"
          nameKey="source"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={sourceColors[entry.source] || Object.values(COLORS)[index % Object.values(COLORS).length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Legend
          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface LeadStatusChartProps {
  data: { status: string; count: number }[];
}

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const statusColors: Record<string, string> = {
    new: '#4299E1',
    contacted: '#ECC94B',
    replied: '#805AD5',
    qualified: '#ED8936',
    converted: '#38A169',
    unqualified: '#718096',
    do_not_contact: '#E53E3E',
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 10 }}
          stroke="#CBD5E0"
          angle={-20}
          textAnchor="end"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#CBD5E0" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Leads">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={statusColors[entry.status] || COLORS.gray} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

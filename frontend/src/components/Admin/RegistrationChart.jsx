import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", users: 35 },
  { month: "Feb", users: 62 },
  { month: "Mar", users: 48 },
  { month: "Apr", users: 95 },
  { month: "May", users: 120 },
  { month: "Jun", users: 180 },
  { month: "Jul", users: 240 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1e2d] border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-gray-400 text-xs font-semibold uppercase">{label}</p>
        <p className="text-white font-bold text-base mt-1">
          Registrations: <span className="text-[#3b82f6]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function RegistrationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="users"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
          barSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
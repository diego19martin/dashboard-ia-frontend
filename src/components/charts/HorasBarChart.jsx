import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-slate-600/50 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-200 font-medium">{payload[0].payload.area}</p>
      <p className="text-brand-400">{payload[0].value} hs/mes ahorradas</p>
    </div>
  );
};

export default function HorasBarChart({ data }) {
  if (!data?.length) return null;

  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5">Cobertura por Área</h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="area"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
            <Bar dataKey="horas" radius={[0, 6, 6, 0]} maxBarSize={24} fill="url(#brandGradient)">
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1B6B9E" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#1B6B9E" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

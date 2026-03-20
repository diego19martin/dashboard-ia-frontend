import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TIPO_IA_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-slate-600/50 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-200 font-medium">{payload[0].payload.tipo}</p>
      <p className="text-slate-400">{payload[0].value} proyectos</p>
    </div>
  );
};

export default function TipoIABarChart({ data }) {
  if (!data?.length) return null;

  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5">Tipos de IA Utilizados</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis
              type="number"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="tipo"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {data.map((entry) => (
                <Cell key={entry.tipo} fill={TIPO_IA_COLORS[entry.tipo] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

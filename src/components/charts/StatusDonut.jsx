import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ESTADO_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { estado, count } = payload[0].payload;
  return (
    <div className="bg-[#1e293b] border border-slate-600/50 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-200 font-medium">{estado}</p>
      <p className="text-slate-400">{count} proyectos</p>
    </div>
  );
};

const CenterLabel = ({ total }) => (
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
    <tspan x="50%" dy="-8" fill="#f1f5f9" fontSize="28" fontWeight="800">{total}</tspan>
    <tspan x="50%" dy="22" fill="#94a3b8" fontSize="11">proyectos</tspan>
  </text>
);

export default function StatusDonut({ data, total }) {
  if (!data?.length) return null;

  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5">Estado del Portfolio</h3>
      <div className="flex items-center gap-6">
        <div className="w-52 h-52 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="estado"
                strokeWidth={0}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.estado}
                    fill={ESTADO_COLORS[entry.estado] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <CenterLabel total={total} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2.5 flex-1">
          {data.map((item) => (
            <div key={item.estado} className="flex items-center gap-3 text-sm">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: ESTADO_COLORS[item.estado] || '#6b7280' }}
              />
              <span className="text-slate-400 flex-1">{item.estado}</span>
              <span className="text-slate-200 font-bold text-lg">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

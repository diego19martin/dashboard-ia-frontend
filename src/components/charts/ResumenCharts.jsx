import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, Label,
} from 'recharts';
import { ESTADO_COLORS, TIPO_IA_COLORS } from '../../utils/constants';

const TODAS_LAS_AREAS = [
  'Operaciones', 'VIP', 'Comercial', 'Marketing', 'Sistemas',
  'Atención al cliente', 'Gastronomía', 'Limpieza', 'Bunker Comercial',
  'RRHH', 'Finanzas', 'Seguridad', 'Valet Parking', 'Tesorería', 'Auditoría',
];

const ESTADO_PRIORITY = ['En producción', 'En desarrollo', 'En evaluación', 'Pipeline'];

const COBERTURA_COLORS = {
  'En producción': '#22c55e',
  'En desarrollo': '#3b82f6',
  'En evaluación': '#f59e0b',
  'Pipeline': '#94a3b8',
  'Sin proyecto': '#374151',
};

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-xl p-5">
      <h4 className="text-sm font-bold text-slate-100 mb-1">{title}</h4>
      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function CustomTooltipBar({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      <p className="text-slate-100 font-bold">{payload[0].value} hs/mes</p>
    </div>
  );
}

function CustomTooltipPie({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-300 font-medium">{payload[0].name}</p>
      <p className="text-slate-100 font-bold">{payload[0].value}</p>
    </div>
  );
}

function CenterLabel({ viewBox, total }) {
  const { cx, cy } = viewBox || {};
  if (!cx || !cy) return null;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-4" className="fill-slate-100 text-2xl font-extrabold">{total}</tspan>
      <tspan x={cx} dy="18" className="fill-slate-500 text-[10px]">total</tspan>
    </text>
  );
}

function renderLegend(payload) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry) => (
        <span key={entry.value} className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export default function ResumenCharts({ proyectos }) {
  if (!proyectos?.length) return null;

  // --- Gráfico 1: Cobertura por área ---
  const coberturaData = TODAS_LAS_AREAS.map((area) => {
    const proys = proyectos.filter((p) => p.area === area);
    if (!proys.length) return { area, nivel: 'Sin proyecto', order: 5 };
    for (let i = 0; i < ESTADO_PRIORITY.length; i++) {
      if (proys.some((p) => p.estado_ejecutivo === ESTADO_PRIORITY[i])) {
        return { area, nivel: ESTADO_PRIORITY[i], order: i };
      }
    }
    return { area, nivel: 'Sin proyecto', order: 5 };
  })
    .sort((a, b) => a.order - b.order)
    .map((d) => ({ name: d.area, value: 1, color: COBERTURA_COLORS[d.nivel], nivel: d.nivel }));

  const areasConProduccion = coberturaData.filter((d) => d.nivel === 'En producción').length;
  const pctCobertura = Math.round((areasConProduccion / 15) * 100);

  // --- Gráfico 2: Horas liberadas por área ---
  const horasMap = {};
  proyectos.filter((p) => p.estado_ejecutivo === 'En producción').forEach((p) => {
    const ahorro = p.horas_antes - p.horas_despues;
    if (ahorro > 0) horasMap[p.area] = (horasMap[p.area] || 0) + ahorro;
  });
  const horasData = Object.entries(horasMap)
    .map(([area, horas]) => ({ name: area, horas }))
    .sort((a, b) => b.horas - a.horas);

  // --- Gráfico 3: Tipos de IA ---
  const tipoMap = {};
  proyectos.forEach((p) => {
    if (p.tipo_ia) tipoMap[p.tipo_ia] = (tipoMap[p.tipo_ia] || 0) + 1;
  });
  const tiposData = Object.entries(tipoMap)
    .map(([tipo, count]) => ({ name: tipo, value: count, color: TIPO_IA_COLORS[tipo] || '#6b7280' }))
    .sort((a, b) => b.value - a.value);
  const totalTipos = tiposData.reduce((s, d) => s + d.value, 0);

  // --- Gráfico 4: Estado del portfolio ---
  const estadoMap = {};
  proyectos.forEach((p) => {
    estadoMap[p.estado_ejecutivo] = (estadoMap[p.estado_ejecutivo] || 0) + 1;
  });
  const estadoData = ESTADO_PRIORITY
    .filter((e) => estadoMap[e])
    .map((e) => ({ name: e, value: estadoMap[e], color: ESTADO_COLORS[e] }));
  const totalEstado = estadoData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <span className="text-brand-400">📈</span> Indicadores Visuales
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfico 4: Estado del Portfolio */}
        <ChartCard title="Estado del Portfolio">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={estadoData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                animationDuration={800}
              >
                {estadoData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <Label content={<CenterLabel total={totalEstado} />} position="center" />
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend content={({ payload }) => renderLegend(payload)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico 1: Cobertura por área */}
        <ChartCard
          title="Cobertura de IA por Área"
          subtitle={`${areasConProduccion} de 15 áreas con IA en producción (${pctCobertura}%)`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coberturaData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" barSize={14} radius={[0, 4, 4, 0]} animationDuration={800}>
                {coberturaData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico 2: Horas liberadas */}
        {horasData.length > 0 && (
          <ChartCard title="Horas Liberadas por Área (mensual)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={horasData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltipBar />} />
                <Bar dataKey="horas" barSize={16} radius={[0, 4, 4, 0]} animationDuration={800}>
                  {horasData.map((_, i) => (
                    <Cell key={i} fill="#1B6B9E" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Gráfico 3: Tipos de IA */}
        <ChartCard title="Tipos de IA en el Portfolio">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={tiposData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                animationDuration={800}
              >
                {tiposData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <Label content={<CenterLabel total={totalTipos} />} position="center" />
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend content={({ payload }) => renderLegend(payload)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, Clock, Cpu } from 'lucide-react';
import { formatNumber, calcReduccion } from '../../utils/calculations';

/* ─── Area card (level 2) ──────────────────────────────────────────── */
function AreaCard({ area, proyectosArea }) {
  const [expanded, setExpanded] = useState(false);

  const horasAhorradas = proyectosArea.reduce(
    (s, p) => s + (p.horas_antes - p.horas_despues), 0,
  );

  return (
    <div className="flex flex-col items-center">
      {/* Vertical connector from horizontal line to card */}
      <div className="w-px h-6 bg-brand-500/30" />

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-[#111827] border border-[#1e293b]/60 rounded-2xl overflow-hidden
                   hover:border-brand-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5
                   transition-all duration-200 text-left"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-100">{area}</h3>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>
                <span className="text-green-400 font-semibold">{proyectosArea.length}</span>{' '}
                proyecto{proyectosArea.length !== 1 ? 's' : ''} en producción
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              <span>
                <span className="text-brand-400 font-semibold">{formatNumber(horasAhorradas)}</span> hs/mes liberadas
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded project list */}
      {expanded && (
        <div className="w-full mt-1 bg-[#111827] border border-[#1e293b]/60 rounded-xl overflow-hidden">
          {proyectosArea.map((p) => {
            const redHoras = calcReduccion(p.horas_antes, p.horas_despues);
            return (
              <div
                key={p.id}
                className="px-4 py-3 border-b border-[#1e293b]/40 last:border-b-0"
              >
                <p className="text-sm text-slate-200 font-medium">{p.proceso}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400">
                  {p.tipo_ia && (
                    <span className="text-purple-400">{p.tipo_ia}</span>
                  )}
                  <span>
                    {formatNumber(p.horas_antes)} → {formatNumber(p.horas_despues)} hs/mes
                    <span className="text-green-400 ml-1">(-{redHoras}%)</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function AdoptionMap({ stats, proyectos }) {
  if (!stats) return null;

  const {
    procesosEnProduccion,
    horasAhorradas,
    areasAlcanzadas,
    totalAreasOrg,
  } = stats;

  // Filter only production projects, group by area
  const prodProyectos = proyectos.filter((p) => p.estado_ejecutivo === 'En producción');
  const areaMap = {};
  prodProyectos.forEach((p) => {
    if (!areaMap[p.area]) areaMap[p.area] = [];
    areaMap[p.area].push(p);
  });
  const areasConProd = Object.entries(areaMap).sort(
    (a, b) => {
      const horasA = a[1].reduce((s, p) => s + (p.horas_antes - p.horas_despues), 0);
      const horasB = b[1].reduce((s, p) => s + (p.horas_antes - p.horas_despues), 0);
      return horasB - horasA;
    },
  );

  // Areas without any production project
  const TODAS_LAS_AREAS = [
    'Operaciones', 'VIP', 'Comercial', 'Marketing', 'Sistemas',
    'Atención al cliente', 'Gastronomía', 'Limpieza', 'Bunker Comercial',
    'RRHH', 'Finanzas', 'Seguridad', 'Valet Parking', 'Tesorería', 'Auditoría',
  ];
  const areasSinProd = TODAS_LAS_AREAS.filter((a) => !areaMap[a]);

  return (
    <div className="space-y-8">
      {/* ── Level 1: Root card ──────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#0f1a2e] to-[#111827]
                        border border-brand-500/30 rounded-2xl p-6 shadow-lg shadow-brand-500/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Hipódromo Argentino de Palermo</h2>
              <p className="text-xs text-slate-400">Mapa de adopción de IA en producción</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <KpiMini label="En producción" value={procesosEnProduccion} color="text-green-400" />
            <KpiMini label="Horas liberadas/mes" value={formatNumber(horasAhorradas)} color="text-brand-400" />
            <KpiMini
              label="Áreas alcanzadas"
              value={`${areasAlcanzadas}/${totalAreasOrg}`}
              color="text-purple-400"
            />
          </div>
        </div>

        {/* Vertical connector from root to horizontal line */}
        {areasConProd.length > 0 && (
          <div className="w-px h-8 bg-brand-500/30" />
        )}
      </div>

      {/* ── Horizontal connector line ──────────────────────────────── */}
      {areasConProd.length > 0 && (
        <div className="relative">
          {/* Horizontal line spanning above all area cards */}
          <div className="absolute top-0 left-[calc(50%/var(--cols)*0.5)] right-[calc(50%/var(--cols)*0.5)]
                          h-px bg-brand-500/30"
               style={{ left: `${100 / areasConProd.length / 2}%`, right: `${100 / areasConProd.length / 2}%` }}
          />

          {/* ── Level 2: Area cards ────────────────────────────────── */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(areasConProd.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {areasConProd.map(([area, proys]) => (
              <AreaCard key={area} area={area} proyectosArea={proys} />
            ))}
          </div>
        </div>
      )}

      {/* ── Areas without production projects ──────────────────────── */}
      {areasSinProd.length > 0 && (
        <div className="bg-[#111827]/60 border border-dashed border-slate-700/40 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
            Áreas sin IA en producción — Oportunidad de incorporar IA
          </p>
          <div className="flex flex-wrap gap-2">
            {areasSinProd.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 bg-slate-800/50 text-slate-500 text-xs rounded-lg border border-slate-700/30"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Tiny KPI pill for root card ──────────────────────────────────── */
function KpiMini({ label, value, color }) {
  return (
    <div className="bg-slate-800/40 rounded-xl px-3 py-2.5 text-center">
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

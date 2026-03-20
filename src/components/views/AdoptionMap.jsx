import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ESTADO_COLORS } from '../../utils/constants';
import AreaIAHeatmap from '../charts/AreaIAHeatmap';
import StatusBadge from '../ui/StatusBadge';
import { formatNumber } from '../../utils/calculations';

const NIVEL_ICON = {
  'En producción': { dot: 'bg-green-500', label: 'Producción' },
  'En desarrollo': { dot: 'bg-blue-500', label: 'Desarrollo' },
  'En evaluación': { dot: 'bg-amber-500', label: 'Evaluación' },
  'Pipeline': { dot: 'bg-gray-500', label: 'Pipeline' },
  'Sin proyecto': { dot: 'bg-slate-700', label: 'Sin proyecto' },
};

const NIVEL_BORDER = {
  'En producción': 'border-l-4 border-l-green-500',
  'En desarrollo': 'border-l-2 border-l-blue-500',
  'En evaluación': 'border-l-2 border-l-amber-500',
  'Pipeline': 'border-l-2 border-l-gray-600',
  'Sin proyecto': '',
};

function AreaCard({ areaSummary, proyectos }) {
  const [expanded, setExpanded] = useState(false);
  const info = NIVEL_ICON[areaSummary.nivel] || NIVEL_ICON['Sin proyecto'];
  const borderClass = NIVEL_BORDER[areaSummary.nivel] || '';
  const proyectosArea = proyectos.filter((p) => p.area === areaSummary.area);
  const isEmpty = areaSummary.nivel === 'Sin proyecto';

  return (
    <div
      className={`bg-[#111827] rounded-2xl overflow-hidden transition-all duration-200 ${
        isEmpty
          ? 'border border-dashed border-slate-700/40 opacity-60 hover:opacity-80'
          : `border border-[#1e293b]/60 ${borderClass} hover:border-brand-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5`
      }`}
    >
      <button
        onClick={() => !isEmpty && setExpanded(!expanded)}
        className={`w-full p-5 text-left flex items-center justify-between ${isEmpty ? 'cursor-default' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${info.dot} flex-shrink-0`} />
          <div>
            <h3 className={`text-sm font-bold ${isEmpty ? 'text-slate-500' : 'text-slate-100'}`}>
              {areaSummary.area}
            </h3>
            {isEmpty ? (
              <p className="text-xs text-slate-600 mt-0.5">Oportunidad de incorporar IA</p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">
                {areaSummary.totalProyectos} proyecto{areaSummary.totalProyectos !== 1 ? 's' : ''}
                {areaSummary.horasAhorradas > 0 && (
                  <span className="text-green-400 ml-2">
                    {formatNumber(areaSummary.horasAhorradas)} hs/mes ahorradas
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        {!isEmpty && (
          expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )
        )}
      </button>

      {expanded && proyectosArea.length > 0 && (
        <div className="border-t border-[#1e293b]/60 px-5 pb-5">
          <div className="space-y-2 mt-3">
            {proyectosArea.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ESTADO_COLORS[p.estado_ejecutivo] || '#6b7280' }}
                  />
                  <span className="text-slate-300 truncate">{p.proceso}</span>
                </div>
                <StatusBadge estado={p.estado_ejecutivo} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdoptionMap({ stats, proyectos }) {
  if (!stats) return null;

  const { areasSummary, areasAlcanzadas, totalAreasOrg, areasConDesarrollo, areasSinProyectos, heatmapData } = stats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areasSummary.map((a) => (
          <AreaCard key={a.area} areaSummary={a} proyectos={proyectos} />
        ))}
      </div>

      <AreaIAHeatmap data={heatmapData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-5 text-center">
          <p className="text-3xl font-extrabold text-green-400">{areasAlcanzadas}</p>
          <p className="text-xs text-slate-400 mt-1">de {totalAreasOrg} áreas con IA en producción</p>
        </div>
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-5 text-center">
          <p className="text-3xl font-extrabold text-blue-400">{areasConDesarrollo}</p>
          <p className="text-xs text-slate-400 mt-1">áreas con proyectos en desarrollo</p>
        </div>
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-5 text-center">
          <p className="text-3xl font-extrabold text-slate-500">{areasSinProyectos}</p>
          <p className="text-xs text-slate-400 mt-1">áreas sin ningún proyecto aún</p>
        </div>
      </div>
    </div>
  );
}

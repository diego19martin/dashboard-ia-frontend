import { Clock, TrendingUp } from 'lucide-react';
import { ESTADO_COLORS, TIPO_IA_BG } from '../../utils/constants';
import { formatNumber } from '../../utils/calculations';

function PipelineCard({ proyecto, compact = false }) {
  const tipoIaBg = TIPO_IA_BG[proyecto.tipo_ia] || 'bg-slate-500/15 text-slate-400';
  const ahorro = proyecto.horas_antes - proyecto.horas_despues;

  if (compact) {
    return (
      <div className="bg-slate-800/30 border border-[#1e293b]/40 rounded-xl p-4 hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-slate-200 leading-tight">{proyecto.proceso}</h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${tipoIaBg}`}>
            {proyecto.tipo_ia}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2">{proyecto.area}</p>
        <div className="flex gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {ahorro} hs/mes potencial
          </span>
          {proyecto.roi_estimado > 0 && (
            <span className="flex items-center gap-1 text-purple-400">
              <TrendingUp className="w-3 h-3" />
              {proyecto.roi_estimado}% ROI
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-xl p-5 hover:border-brand-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-100">{proyecto.proceso}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{proyecto.area}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${tipoIaBg}`}>
          {proyecto.tipo_ia}
        </span>
      </div>
      {proyecto.descripcion && (
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{proyecto.descripcion}</p>
      )}
      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {ahorro} hs/mes potencial
        </span>
        {proyecto.roi_estimado > 0 && (
          <span className="flex items-center gap-1 text-purple-400">
            <TrendingUp className="w-3 h-3" />
            {proyecto.roi_estimado}% ROI
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, count, proyectos, compact = false }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <span className="text-sm text-slate-500">({count})</span>
      </div>
      <div className={`${compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}`}>
        {proyectos.map((p) => (
          <PipelineCard key={p.id} proyecto={p} compact={compact} />
        ))}
      </div>
    </div>
  );
}

export default function PipelineView({ proyectos, stats }) {
  if (!stats) return null;

  const enDesarrollo = proyectos.filter((p) => p.estado_ejecutivo === 'En desarrollo');
  const enEvaluacion = proyectos.filter((p) => p.estado_ejecutivo === 'En evaluación');
  const pipeline = proyectos.filter((p) => p.estado_ejecutivo === 'Pipeline');

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-sm text-slate-400 mb-1">Impacto potencial si se implementa todo el pipeline</p>
            <p className="text-4xl font-extrabold text-brand-400">
              {formatNumber(stats.pipeline.impactoPotencialHoras)} hs/mes
            </p>
            <p className="text-xs text-slate-500 mt-1">horas adicionales que se liberarían</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">ROI promedio estimado del pipeline</p>
            <p className="text-4xl font-extrabold text-purple-400">
              {stats.pipeline.roiPromedio}%
            </p>
            <p className="text-xs text-slate-500 mt-1">retorno sobre inversión promedio</p>
          </div>
        </div>
      </div>

      {enDesarrollo.length > 0 && (
        <Section
          title="En Desarrollo"
          color={ESTADO_COLORS['En desarrollo']}
          count={enDesarrollo.length}
          proyectos={enDesarrollo}
        />
      )}

      {enEvaluacion.length > 0 && (
        <Section
          title="En Evaluación"
          color={ESTADO_COLORS['En evaluación']}
          count={enEvaluacion.length}
          proyectos={enEvaluacion}
        />
      )}

      {pipeline.length > 0 && (
        <Section
          title="Pipeline"
          color={ESTADO_COLORS['Pipeline']}
          count={pipeline.length}
          proyectos={pipeline}
        />
      )}
    </div>
  );
}

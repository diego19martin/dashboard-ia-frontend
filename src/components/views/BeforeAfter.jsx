import { Users, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { TIPO_IA_BG } from '../../utils/constants';
import { calcReduccion, formatNumber } from '../../utils/calculations';

function ImpactBar({ label, value, color }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}%</span>
      </div>
      <div className="w-full bg-slate-700/40 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${color === 'text-green-400' ? 'bg-green-500' : color === 'text-blue-400' ? 'bg-blue-500' : 'bg-purple-500'}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ proyecto, index, isTop }) {
  const reduccionHoras = calcReduccion(proyecto.horas_antes, proyecto.horas_despues);
  const reduccionErrores = calcReduccion(proyecto.errores_antes, proyecto.errores_despues);
  const horasAhorradas = proyecto.horas_antes - proyecto.horas_despues;
  const tipoIaBg = TIPO_IA_BG[proyecto.tipo_ia] || 'bg-slate-500/15 text-slate-400';

  return (
    <div
      className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)} bg-[#111827] border rounded-2xl p-6 hover:border-brand-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 ${
        isTop ? 'border-brand-500/40' : 'border-[#1e293b]/60'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-100">{proyecto.proceso}</h3>
            {isTop && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 uppercase tracking-wider">
                Top impacto
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{proyecto.area}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-green-400">{horasAhorradas} hs/mes liberadas</span>
          <StatusBadge estado={proyecto.estado_ejecutivo} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoIaBg}`}>
          {proyecto.tipo_ia}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 text-slate-400">
          <Users className="w-3 h-3" />
          {proyecto.personas_impactadas} personas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 mb-5">
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Antes</h4>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">{proyecto.antes_resumen}</p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {proyecto.horas_antes} hs/mes
            </span>
            {proyecto.errores_antes > 0 && (
              <span className="flex items-center gap-1 text-slate-400">
                <AlertTriangle className="w-3 h-3" />
                {proyecto.errores_antes} errores/mes
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center px-2">
          <div className="flex flex-col items-center text-green-400">
            <ArrowRight className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">-{reduccionHoras}%</span>
          </div>
        </div>

        <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
          <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Después</h4>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">{proyecto.despues_resumen}</p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {proyecto.horas_despues} hs/mes
            </span>
            {proyecto.errores_despues > 0 && (
              <span className="flex items-center gap-1 text-slate-400">
                <AlertTriangle className="w-3 h-3" />
                {proyecto.errores_despues} errores/mes
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <ImpactBar label="Reducción de horas" value={reduccionHoras} color="text-green-400" />
        <ImpactBar label="Reducción de errores" value={reduccionErrores} color="text-blue-400" />
        <ImpactBar label="ROI" value={Math.min(proyecto.roi_estimado, 100)} color="text-purple-400" />
      </div>
      {proyecto.roi_estimado > 100 && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-purple-400 font-medium">{proyecto.roi_estimado}% ROI</span>
        </div>
      )}
    </div>
  );
}

export default function BeforeAfter({ proyectos }) {
  const enProduccion = proyectos.filter((p) => p.estado_ejecutivo === 'En producción');

  if (!enProduccion.length) {
    return (
      <div className="text-center text-slate-400 py-20">
        No hay proyectos en producción aún.
      </div>
    );
  }

  const sorted = [...enProduccion].sort(
    (a, b) => (b.horas_antes - b.horas_despues) - (a.horas_antes - a.horas_despues)
  );

  const totalHorasAntes = enProduccion.reduce((s, p) => s + p.horas_antes, 0);
  const totalHorasDespues = enProduccion.reduce((s, p) => s + p.horas_despues, 0);
  const totalHorasAhorradas = totalHorasAntes - totalHorasDespues;
  const totalErroresAntes = enProduccion.reduce((s, p) => s + p.errores_antes, 0);
  const totalErroresDespues = enProduccion.reduce((s, p) => s + p.errores_despues, 0);
  const reduccionErroresTotal = calcReduccion(totalErroresAntes, totalErroresDespues);

  const fechasProduccion = enProduccion
    .map((p) => p.fecha_produccion)
    .filter(Boolean)
    .map((f) => new Date(f))
    .filter((d) => !isNaN(d.getTime()));
  const mesesOperacion = fechasProduccion.length > 0
    ? Math.max(1, Math.round((Date.now() - Math.min(...fechasProduccion)) / (1000 * 60 * 60 * 24 * 30)))
    : null;

  return (
    <div className="space-y-6">
      {sorted.map((p, i) => (
        <ProjectCard key={p.id} proyecto={p} index={i} isTop={i === 0} />
      ))}

      <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-6 text-center">
        <p className="text-slate-200 text-base">
          En total, los proyectos en producción liberaron{' '}
          <span className="text-brand-400 font-bold">{formatNumber(totalHorasAhorradas)} horas/mes</span>
          {' '}y redujeron{' '}
          <span className="text-green-400 font-bold">{reduccionErroresTotal}%</span>
          {' '}los errores operativos.
        </p>
        {mesesOperacion && (
          <p className="text-sm text-slate-500 mt-2">
            Estos resultados representan el impacto de los primeros {mesesOperacion} meses de operación del equipo.
          </p>
        )}
      </div>
    </div>
  );
}

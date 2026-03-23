import { CheckCircle2, Building2, Clock, ShieldCheck, UserCheck, Users } from 'lucide-react';
import KpiCard from '../ui/KpiCard';
import StatusDonut from '../charts/StatusDonut';
import HorasBarChart from '../charts/HorasBarChart';
import TipoIABarChart from '../charts/TipoIABarChart';
import { formatNumber } from '../../utils/calculations';

export default function ExecutiveSummary({ stats }) {
  if (!stats) return null;

  const pipelineCount = (stats.porEstado['En desarrollo'] || 0) +
    (stats.porEstado['En evaluación'] || 0) +
    (stats.porEstado['Pipeline'] || 0);

  return (
    <div className="space-y-6">
      <div className="bg-brand-500/5 border border-brand-500/15 rounded-2xl p-6">
        <p className="text-slate-200 text-base leading-relaxed">
          Hoy{' '}
          <span className="text-brand-400 font-bold">{stats.procesosEnProduccion} procesos</span>
          {' '}ya operan con IA en{' '}
          <span className="text-brand-400 font-bold">{stats.areasAlcanzadas} áreas</span>,
          liberando{' '}
          <span className="text-green-400 font-bold">{formatNumber(stats.horasAhorradas)} horas/mes</span>
          {stats.fteEquivalente > 0 && (
            <> (equivalente a <span className="text-green-400 font-bold">{stats.fteEquivalente} recursos</span>)</>
          )}.
          {' '}Hay{' '}
          <span className="text-slate-100 font-bold">{pipelineCount} iniciativas</span>
          {' '}adicionales en el pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KpiCard
          titulo="En Producción"
          valor={stats.procesosEnProduccion}
          subtexto="generando impacto"
          icono={CheckCircle2}
          color="green"
          index={0}
        />
        <KpiCard
          titulo="Áreas Alcanzadas"
          valor={stats.areasAlcanzadas}
          subtexto={`de ${stats.totalAreasOrg} áreas`}
          icono={Building2}
          color="blue"
          index={1}
        >
          <div className="mt-2 w-full bg-slate-700/40 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(stats.areasAlcanzadas / stats.totalAreasOrg) * 100}%` }}
            />
          </div>
        </KpiCard>
        <KpiCard
          titulo="Horas Ahorradas"
          valor={stats.horasAhorradas}
          subtexto="horas/mes liberadas"
          icono={Clock}
          color="brand"
          index={2}
        />
        <KpiCard
          titulo="Recursos Liberados"
          valor={stats.fteEquivalente}
          subtexto="personas equivalentes"
          icono={UserCheck}
          color="green"
          index={3}
        />
        <KpiCard
          titulo="Personas Impactadas"
          valor={stats.totalPersonasImpactadas}
          subtexto="colaboradores beneficiados"
          icono={Users}
          color="amber"
          index={4}
        />
        <KpiCard
          titulo="Reducción Errores"
          valor={stats.erroresReducidos}
          suffix="%"
          subtexto="menos errores operativos"
          icono={ShieldCheck}
          color="blue"
          index={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDonut data={stats.distribucionEstados} total={stats.totalProyectos} />
        <HorasBarChart data={stats.horasPorArea} />
      </div>

      <TipoIABarChart data={stats.distribucionTipoIA} />
    </div>
  );
}

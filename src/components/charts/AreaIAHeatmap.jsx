import { TIPO_IA_COLORS } from '../../utils/constants';

const TIPO_IA_ABBREV = {
  'Clasificación': 'Clasif.',
  'Resumen automático': 'Resumen',
  'Alertas': 'Alertas',
  'Insights': 'Insights',
  'Asistente IA': 'Asist. IA',
  'Predicción': 'Predicción',
  'Detección anomalías': 'Det. Anom.',
};

export default function AreaIAHeatmap({ data }) {
  if (!data?.areas?.length || !data?.tiposIA?.length) return null;

  const maxVal = Math.max(
    ...data.data.flatMap((row) => data.tiposIA.map((t) => row[t] || 0)),
    1
  );

  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5">Áreas vs Tipo IA</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-slate-400 font-medium pb-3 pr-3 min-w-[110px]">Área</th>
              {data.tiposIA.map((tipo) => (
                <th key={tipo} className="text-center text-slate-400 font-medium pb-3 px-1">
                  <span className="block max-w-[70px] mx-auto" title={tipo}>
                    {TIPO_IA_ABBREV[tipo] || tipo}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.map((row) => (
              <tr key={row.area}>
                <td className="text-slate-300 pr-3 py-1.5 font-medium">{row.area}</td>
                {data.tiposIA.map((tipo) => {
                  const val = row[tipo] || 0;
                  return (
                    <td key={tipo} className="px-1 py-1.5 text-center">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto text-xs font-bold transition-transform hover:scale-110"
                        style={{
                          backgroundColor: val
                            ? `${TIPO_IA_COLORS[tipo] || '#6b7280'}${Math.round((0.15 + (val / maxVal) * 0.55) * 255).toString(16).padStart(2, '0')}`
                            : 'rgba(30,41,59,0.3)',
                          color: val ? '#fff' : 'transparent',
                        }}
                      >
                        {val || ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

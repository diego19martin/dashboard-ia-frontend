import { useCountUp } from '../../hooks/useCountUp';

export default function KpiCard({ titulo, valor, subtexto, icono: Icon, color = 'brand', index = 0, children, suffix = '' }) {
  const numericVal = typeof valor === 'number' ? valor : parseFloat(String(valor).replace(/[^0-9.-]/g, ''));
  const animated = useCountUp(isNaN(numericVal) ? 0 : numericVal);
  const isNumeric = !isNaN(numericVal) && numericVal !== 0;

  const displayVal = isNumeric
    ? `${animated % 1 !== 0 ? animated.toFixed(1) : Math.round(animated)}${suffix}`
    : valor;

  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/15',
    green: 'text-green-400 bg-green-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
    amber: 'text-amber-400 bg-amber-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
  };

  const iconStyle = colorMap[color] || colorMap.brand;

  return (
    <div
      className={`opacity-0 animate-fade-in-up stagger-${index + 1} bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-5 hover:border-brand-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconStyle} flex items-center justify-center`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {titulo}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-slate-50">{displayVal}</p>
      {subtexto && (
        <p className="text-sm text-slate-400 mt-1">{subtexto}</p>
      )}
      {children}
    </div>
  );
}

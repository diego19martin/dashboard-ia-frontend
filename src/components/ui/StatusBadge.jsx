import { ESTADO_BG } from '../../utils/constants';

export default function StatusBadge({ estado }) {
  const classes = ESTADO_BG[estado] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {estado}
    </span>
  );
}

import { useState, useEffect } from 'react';
import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { timeAgo } from '../../utils/calculations';

export default function Header({ proyectos, filtroArea, setFiltroArea, lastUpdated, onRefresh }) {
  const areasUnicas = [...new Set(proyectos.map((p) => p.area))].sort();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="border-b border-slate-800/60 bg-[#0d1321]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight">
              Panel de Adopción IA
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Equipo Especialista de Automatización e IA — Hipódromo Argentino de Palermo
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <button
                onClick={onRefresh}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {timeAgo(lastUpdated)}
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              title="Modo presentación"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <select
              value={filtroArea}
              onChange={(e) => setFiltroArea(e.target.value)}
              className="bg-[#111827] border border-slate-700/60 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">Todas las áreas</option>
              {areasUnicas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

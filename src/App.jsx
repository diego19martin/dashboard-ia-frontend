import { useState, useEffect } from 'react';
import { useProyectos } from './hooks/useProyectos';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import SkeletonLoader from './components/ui/SkeletonLoader';
import ErrorMessage from './components/ui/ErrorMessage';
import ExecutiveSummary from './components/views/ExecutiveSummary';
import BeforeAfter from './components/views/BeforeAfter';
import AdoptionMap from './components/views/AdoptionMap';
import PipelineView from './components/views/PipelineView';
import ResumenIAView from './components/views/ResumenIAView';

const TAB_IDS = ['resumen', 'impacto', 'mapa', 'pipeline', 'resumen-ia'];

export default function App() {
  const [activeTab, setActiveTab] = useState('resumen');
  const {
    proyectos,
    todosProyectos,
    stats,
    loading,
    error,
    lastUpdated,
    filtroArea,
    setFiltroArea,
    refetch,
  } = useProyectos();

  useEffect(() => {
    const handler = (e) => {
      if (e.key >= '1' && e.key <= '5') {
        setActiveTab(TAB_IDS[parseInt(e.key) - 1]);
      }
      const idx = TAB_IDS.indexOf(activeTab);
      if (e.key === 'ArrowRight' && idx < TAB_IDS.length - 1) {
        setActiveTab(TAB_IDS[idx + 1]);
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        setActiveTab(TAB_IDS[idx - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab]);

  const renderView = () => {
    switch (activeTab) {
      case 'resumen':
        return <ExecutiveSummary stats={stats} />;
      case 'impacto':
        return <BeforeAfter proyectos={proyectos} />;
      case 'mapa':
        return <AdoptionMap stats={stats} proyectos={proyectos} />;
      case 'pipeline':
        return <PipelineView proyectos={proyectos} stats={stats} />;
      case 'resumen-ia':
        return <ResumenIAView stats={stats} proyectos={proyectos} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Header
        proyectos={todosProyectos}
        filtroArea={filtroArea}
        setFiltroArea={setFiltroArea}
        lastUpdated={lastUpdated}
        onRefresh={refetch}
      />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          renderView()
        )}
      </main>

      <footer className="max-w-[1440px] mx-auto px-6 pb-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Fuente: Google Sheets · Actualización automática cada 5 minutos</span>
          {lastUpdated && (
            <span>Última actualización: {lastUpdated.toLocaleString('es-AR')}</span>
          )}
        </div>
      </footer>
    </div>
  );
}

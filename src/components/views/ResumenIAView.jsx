import { useState, useEffect } from 'react';
import { Sparkles, Copy, FileText, RefreshCw, CheckCircle2, Clock, Building2, AlertCircle, Bot, AlertTriangle } from 'lucide-react';
import { generarResumenIA, descargarPDF, getResumenIAStatus } from '../../services/api';
import { formatNumber } from '../../utils/calculations';
import ResumenCharts from '../charts/ResumenCharts';

function MiniKpi({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#111827] border border-[#1e293b]/60 rounded-xl p-4 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function parseMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (const line of lines) {
    if (!line.trim()) {
      elements.push(<div key={key++} className="h-3" />);
      continue;
    }

    // Section headers with emojis: **📊 ESTADO ACTUAL**
    const sectionMatch = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (sectionMatch) {
      const content = sectionMatch[1].trim();
      if (/^[\p{Emoji}\s]*[A-ZÁÉÍÓÚÑÜ\s]+$/u.test(content) || /^\p{Emoji}/u.test(content)) {
        elements.push(
          <h3 key={key++} className="text-lg font-bold text-brand-400 mt-6 mb-2">
            {content}
          </h3>
        );
        continue;
      }
    }

    // Numbered section titles
    const numberedMatch = line.match(/^\*?\*?(\d+)\.\s+(.+?)\*?\*?\s*$/);
    if (numberedMatch) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-brand-400 mt-6 mb-2">
          {numberedMatch[1]}. {numberedMatch[2].replace(/\*\*/g, '')}
        </h3>
      );
      continue;
    }

    const titleMatch = line.match(/^#+\s+(.+)$/) || line.match(/^\*\*TÍTULO\*\*:?\s*(.+)/) || line.match(/^#\s*\*\*(.+)\*\*/);
    if (titleMatch) {
      elements.push(
        <h2 key={key++} className="text-xl font-extrabold text-slate-100 mt-4 mb-1">
          {titleMatch[1].replace(/\*\*/g, '')}
        </h2>
      );
      continue;
    }

    const subtitleMatch = line.match(/^\*\*SUBTÍTULO\*\*:?\s*(.+)/);
    if (subtitleMatch) {
      elements.push(
        <p key={key++} className="text-sm text-slate-400 mb-4">
          {subtitleMatch[1].replace(/\*\*/g, '')}
        </p>
      );
      continue;
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const spans = parts.map((part, i) => {
      const boldMatch = part.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) {
        return <strong key={i} className="text-slate-100 font-bold">{boldMatch[1]}</strong>;
      }
      return <span key={i}>{part}</span>;
    });

    elements.push(
      <p key={key++} className="text-slate-300 leading-relaxed mb-3">
        {spans}
      </p>
    );
  }

  return elements;
}

export default function ResumenIAView({ stats, proyectos }) {
  const [resumen, setResumen] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [proyectosProduccion, setProyectosProduccion] = useState([]);
  const [proyectosDesarrollo, setProyectosDesarrollo] = useState([]);
  const [proyectosPipeline, setProyectosPipeline] = useState([]);
  const [generadoEn, setGeneradoEn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [datosActualizados, setDatosActualizados] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [pdfDisponible, setPdfDisponible] = useState(false);

  // Check cache status on mount
  useEffect(() => {
    let cancelled = false;
    async function checkStatus() {
      try {
        const status = await getResumenIAStatus();
        if (cancelled) return;

        if (status.disponible) {
          // State B or C — load cached resumen
          const data = await generarResumenIA(false);
          if (cancelled) return;
          setResumen(data.resumen);
          setMetricas(data.metricas);
          setProyectosProduccion(data.proyectosProduccion || []);
          setProyectosDesarrollo(data.proyectosDesarrollo || []);
          setProyectosPipeline(data.proyectosPipeline || []);
          setGeneradoEn(data.generadoEn);
          setDatosActualizados(status.datosActualizados);
          setPdfDisponible(status.pdfDisponible);
        }
        // State A — no cache, show initial screen
      } catch {
        // Silently fall to state A
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    }
    checkStatus();
    return () => { cancelled = true; };
  }, []);

  const applyData = (data) => {
    setResumen(data.resumen);
    setMetricas(data.metricas);
    setProyectosProduccion(data.proyectosProduccion || []);
    setProyectosDesarrollo(data.proyectosDesarrollo || []);
    setProyectosPipeline(data.proyectosPipeline || []);
    setGeneradoEn(data.generadoEn);
    setDatosActualizados(false);
    setPdfDisponible(false);
  };

  const handleGenerar = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generarResumenIA(force);
      applyData(data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo generar el resumen. Verificá la conexión e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const plainText = resumen.replace(/\*\*/g, '');
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const blob = await descargarPDF(resumen, metricas, proyectosProduccion, proyectosDesarrollo, proyectosPipeline);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Informe_IA_HAPSA_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setPdfDisponible(true);
    } catch {
      setError('No se pudo generar el PDF. Intentá de nuevo.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Loading: checking cache status
  if (checkingStatus) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/15 mb-6">
            <Bot className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
          <p className="text-slate-400">Verificando estado del informe...</p>
        </div>
      </div>
    );
  }

  // Loading: generating report
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/15 mb-6">
            <Sparkles className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-3">Analizando datos y generando informe ejecutivo...</h2>
          <p className="text-sm text-slate-400 mb-8">Esto puede tomar unos segundos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {['Proyectos', 'Métricas', 'Impacto', 'Conclusiones'].map((step, i) => (
              <div key={step} className={`bg-slate-800/40 rounded-xl p-3 ${i <= 1 ? 'animate-pulse' : 'opacity-40'}`}>
                <div className="h-2 bg-brand-500/20 rounded-full mb-2" />
                <p className="text-xs text-slate-500">{step}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-4 bg-slate-800/30 rounded animate-pulse" style={{ width: `${100 - n * 15}%`, marginInline: 'auto' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // State A: no cached report
  if (!resumen) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-500/15 mb-6">
            <Bot className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mb-3">Resumen Ejecutivo con IA</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Generá un informe ejecutivo automático basado en los datos actuales del portfolio de proyectos. El informe incluye el estado de la adopción de IA, los casos de éxito, el pipeline y una conclusión para el directorio.
          </p>
          {error && (
            <div className="flex items-center gap-2 justify-center text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <button
            onClick={() => handleGenerar(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors text-base shadow-lg shadow-brand-500/20"
          >
            <Bot className="w-5 h-5" />
            Generar Informe con IA
          </button>
        </div>

        {proyectos?.length > 0 && (
          <div className="mt-10">
            <ResumenCharts proyectos={proyectos} />
          </div>
        )}
      </div>
    );
  }

  // State B/C: report available
  const fechaGenerado = new Date(generadoEn);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* State C: stale data banner */}
      {datosActualizados && (
        <div className="flex items-center justify-between gap-4 bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-300">
              Los datos del Sheet se actualizaron desde la última generación. Se recomienda regenerar el informe.
            </p>
          </div>
          <button
            onClick={() => handleGenerar(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-yellow-100 bg-yellow-600/30 border border-yellow-500/40 rounded-lg hover:bg-yellow-600/50 transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar con datos actualizados
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Informe de Adopción de Automatización e IA</h2>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-sm text-slate-500">
              Generado el {fechaGenerado.toLocaleDateString('es-AR')} a las {fechaGenerado.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {!datosActualizados ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 border border-green-700/50 text-green-300">
                <CheckCircle2 className="w-3 h-3" />
                Cache vigente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/30 border border-yellow-700/50 text-yellow-300">
                <AlertTriangle className="w-3 h-3" />
                Datos desactualizados
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 border border-blue-700/50 text-blue-300">
              <Bot className="w-3 h-3" />
              Generado con Inteligencia Artificial
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar texto'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-700/60 transition-colors disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            {downloadingPDF ? 'Generando...' : 'Descargar PDF'}
          </button>
          <button
            onClick={() => handleGenerar(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-400 bg-brand-500/10 border border-brand-500/30 rounded-lg hover:bg-brand-500/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Forzar regeneración
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {metricas && (
        <div className="grid grid-cols-3 gap-3">
          <MiniKpi icon={CheckCircle2} label="En producción" value={metricas.procesosEnProduccion} color="text-green-400" />
          <MiniKpi icon={Clock} label="Horas liberadas/mes" value={formatNumber(metricas.horasAhorradas)} color="text-brand-400" />
          <MiniKpi icon={Building2} label="Áreas alcanzadas" value={`${metricas.areasAlcanzadas}/15`} color="text-blue-400" />
        </div>
      )}

      <div className="bg-[#111827] border border-[#1e293b]/60 rounded-2xl p-8 md:p-10">
        <div className="prose-custom max-w-none">
          {parseMarkdown(resumen)}
        </div>
      </div>

      {proyectos?.length > 0 && <ResumenCharts proyectos={proyectos} />}
    </div>
  );
}

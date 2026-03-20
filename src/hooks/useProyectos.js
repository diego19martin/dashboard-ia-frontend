import { useState, useEffect, useCallback } from 'react';
import { getProyectos, getStats } from '../services/api';
import { REFRESH_INTERVAL } from '../utils/constants';

export function useProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filtroArea, setFiltroArea] = useState('');

  const fetchAll = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const [proyRes, statsRes] = await Promise.all([
        getProyectos(),
        getStats(),
      ]);

      setProyectos(proyRes.data || []);
      setStats(statsRes);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(true);
    const interval = setInterval(() => fetchAll(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const proyectosFiltrados = filtroArea
    ? proyectos.filter((p) => p.area === filtroArea)
    : proyectos;

  return {
    proyectos: proyectosFiltrados,
    todosProyectos: proyectos,
    stats,
    loading,
    error,
    lastUpdated,
    filtroArea,
    setFiltroArea,
    refetch: () => fetchAll(true),
  };
}

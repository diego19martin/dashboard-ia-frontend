import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export async function getProyectos() {
  const { data } = await api.get('/proyectos');
  return data;
}

export async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

export async function getResumenIAStatus() {
  const { data } = await api.get('/resumen-ia/status');
  return data;
}

export async function generarResumenIA(force = false) {
  const { data } = await api.post(`/resumen-ia${force ? '?force=true' : ''}`, {}, { timeout: 45000 });
  return data;
}

export async function descargarPDF(resumen, metricas, proyectosProduccion, proyectosDesarrollo, proyectosPipeline) {
  const response = await api.post('/resumen-pdf', {
    resumen,
    metricas,
    proyectosProduccion,
    proyectosDesarrollo,
    proyectosPipeline,
  }, {
    responseType: 'blob',
    timeout: 30000,
  });
  return response.data;
}

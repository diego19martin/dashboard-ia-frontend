export function formatNumber(num) {
  if (num >= 1000) {
    return num.toLocaleString('es-AR');
  }
  return String(num);
}

export function calcReduccion(antes, despues) {
  if (antes === 0) return 0;
  return Math.round(((antes - despues) / antes) * 100);
}

export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Justo ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export type TypeLocalStyle = {
  color: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
  label: string;
};

export function getTypeLocalStyle(typeLocal: string | null): TypeLocalStyle {
  const type = typeLocal?.toLowerCase() || "";
  if (type.includes('maison')) {
    return { color: '#16a34a', bgColor: '#f0fdf4', borderColor: '#bbf7d0', barColor: '#22c55e', label: 'Maison' };
  }
  if (type.includes('appartement')) {
    return { color: '#4f46e5', bgColor: '#eef2ff', borderColor: '#c7d2fe', barColor: '#6366f1', label: 'Appartement' };
  }
  if (type.includes('dépendance') || type.includes('dependance')) {
    return { color: '#64748b', bgColor: '#f8fafc', borderColor: '#e2e8f0', barColor: '#94a3b8', label: 'Dépendance' };
  }
  if (type.includes('commercial') || type.includes('industriel')) {
    return { color: '#d97706', bgColor: '#fffbeb', borderColor: '#fde68a', barColor: '#f59e0b', label: 'Commercial' };
  }
  return { color: '#0284c7', bgColor: '#f0f9ff', borderColor: '#bae6fd', barColor: '#38bdf8', label: 'Autre' };
}

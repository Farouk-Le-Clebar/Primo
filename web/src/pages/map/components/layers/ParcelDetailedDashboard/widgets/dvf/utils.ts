import { Home, Building, CarFront, Store, Euro } from "lucide-react";

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

export function getTypeLocalStyle(typeLocal: string | null) {
  const type = typeLocal?.toLowerCase() || "";

  if (type.includes('maison')) {
    return { icon: Home, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", bar: "bg-emerald-500" };
  }
  if (type.includes('appartement')) {
    return { icon: Building, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", bar: "bg-indigo-500" };
  }
  if (type.includes('dépendance') || type.includes('dependance')) {
    return { icon: CarFront, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", bar: "bg-slate-400" };
  }
  if (type.includes('commercial') || type.includes('industriel')) {
    return { icon: Store, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", bar: "bg-amber-500" };
  }
  return { icon: Euro, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100", bar: "bg-sky-400" };
}
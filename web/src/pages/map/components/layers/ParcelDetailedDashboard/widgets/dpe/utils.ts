
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

export function getDpeColorStyle(etiquette: string | null) {
  const note = etiquette?.toUpperCase() || "";

  switch (note) {
    case 'A': return "bg-[#00A06D] text-white";
    case 'B': return "bg-[#52B153] text-white";
    case 'C': return "bg-[#A5CC74] text-[#111111]";
    case 'D': return "bg-[#F4E70F] text-[#111111]";
    case 'E': return "bg-[#F0B50F] text-[#111111]";
    case 'F': return "bg-[#EB8235] text-white";
    case 'G': return "bg-[#D7221F] text-white";
    default: return "bg-gray-200 text-gray-500";
  }
}
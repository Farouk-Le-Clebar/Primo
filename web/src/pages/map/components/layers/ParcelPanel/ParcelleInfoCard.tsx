interface ParcelProperties {
  id: string;
  commune: string;
  section: string;
  numero: string;
  contenance: number;
  prefixe?: string;
  updated?: string;
  created?: string;
}

export const ParcelInfoCard = ({ properties }: { properties: ParcelProperties }) => {
  if (!properties) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/C";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatContenance = (surfaceM2: number) => {
    const ares = Math.floor(surfaceM2 / 100);
    const centiares = Math.floor(surfaceM2 % 100);
    
    let result = "";
    if (ares > 0) result += `${ares.toString().padStart(2, '0')} a `;
    result += `${centiares.toString().padStart(2, '0')} ca`;
    
    return result;
  };

  const InfoRow = ({ label, value, isLast = false }: { label: string, value: string | React.ReactNode, isLast?: boolean }) => (
    <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}>
      <span className="text-sm font-medium text-[#878D96]">{label}</span>
      <span className="text-sm font-medium text-[#111111] text-right">{value}</span>
    </div>
  );

  return (
    <div className="">
      <div className="flex flex-col pl-1">
        <InfoRow 
          label="Identifiant" 
          value={<span className="font-inter text-[13px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{properties.id}</span>} 
        />
        <InfoRow 
          label="Commune (INSEE)" 
          value={properties.commune} 
        />
        <InfoRow 
          label="Section & Numéro" 
          value={`${properties.section} - ${properties.numero} ${properties.prefixe && properties.prefixe !== "000" ? `(Préfixe ${properties.prefixe})` : ""}`} 
        />
        <InfoRow 
          label="Surface cadastrale" 
          value={`${properties.contenance.toLocaleString('fr-FR')} m²`} 
        />
        <InfoRow 
          label="Contenance" 
          value={formatContenance(properties.contenance)} 
        />
        {properties.created && (
          <InfoRow 
            label="Date de création" 
            value={formatDate(properties.created)} 
          />
        )}
        <InfoRow 
          label="Date de mise à jour" 
          value={formatDate(properties.updated)} 
          isLast={true}
        />
      </div>
    </div>
  );
};
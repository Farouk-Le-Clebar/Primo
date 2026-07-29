import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Card
} from '@tremor/react';

export default function UserConnectionsTable({ stats }: { stats: any[] }) {
  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden dark:bg-[#111111]/40">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">Date</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">Adresse IP</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">Localisation</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">Navigateur</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">OS</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">Appareil</TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold text-right">Langue</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow
                key={stat.id || index}
                className="even:bg-gray-50 even:dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {new Date(stat.connectedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {stat.ipAddress || 'Inconnue'}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {stat.city && stat.country ? `${stat.city}, ${stat.country}` : (stat.country || 'Inconnue')}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {stat.browser || 'Inconnu'}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {stat.os || 'Inconnu'}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300 capitalize">
                  {stat.deviceType || 'desktop'}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300 text-right">
                  {stat.language || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
            
            {stats.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-[#999999] italic">
                  Aucun historique de connexion trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
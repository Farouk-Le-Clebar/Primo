import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConnexionFixe } from './connectivite.types';

const ARCEP_URL =
  'https://data.arcep.fr/fixe/maconnexioninternet/statistiques/last/commune';
const TIMEOUT_MS = 30000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CITY_WITH_DISTRICTS: { prefix: RegExp; code: string }[] = [
  { prefix: /^751\d\d$/, code: '75056' },
  { prefix: /^6938\d$/, code: '69123' },
  { prefix: /^132\d\d$/, code: '13055' },
];

type CsvRow = Record<string, string>;
type CommuneTables = {
  techno: Map<string, CsvRow>;
  debit: Map<string, CsvRow>;
};

const share = (
  row: CsvRow | undefined,
  column: string,
  total: number,
): number =>
  total > 0 ? Math.round((Number(row?.[column] ?? 0) / total) * 1000) / 10 : 0;

function parseCsv(content: string): Map<string, CsvRow> {
  const [header, ...lines] = content.trim().split(/\r?\n/);
  const columns = header.split(';');
  const rows = new Map<string, CsvRow>();
  for (const line of lines) {
    const values = line.split(';');
    const row = Object.fromEntries(
      columns.map((column, index) => [column, values[index] ?? '']),
    );
    rows.set(row.code_insee, row);
  }
  return rows;
}

@Injectable()
export class FibreService {
  private tables: Promise<CommuneTables> | null = null;
  private loadedAt = 0;

  async findByCommune(codeInsee: string): Promise<ConnexionFixe | null> {
    const { techno, debit } = await this.loadTables();
    const code =
      CITY_WITH_DISTRICTS.find(({ prefix }) => prefix.test(codeInsee))?.code ??
      codeInsee;
    const row = techno.get(code);
    if (!row) return null;
    const locaux = Number(row.nbr);
    const speeds = debit.get(code);

    return {
      commune: row.nom_com,
      locaux,
      partFibre: share(row, 'elig_ftth', locaux),
      partCable: share(row, 'elig_coax', locaux),
      partCuivre: share(row, 'elig_cu', locaux),
      part4gFixe: share(row, 'elig_4gf', locaux),
      partSatellite: share(row, 'elig_sat', locaux),
      partTresHautDebit: share(speeds, 'elig_thd30', locaux),
      partGigabit: share(speeds, 'elig_thd1g', locaux),
      miseAJour: row.date,
    };
  }

  private loadTables(): Promise<CommuneTables> {
    if (!this.tables || Date.now() - this.loadedAt > CACHE_TTL_MS) {
      this.loadedAt = Date.now();
      this.tables = Promise.all([
        this.download('commune_techno.csv'),
        this.download('commune_debit.csv'),
      ])
        .then(([techno, debit]) => ({ techno, debit }))
        .catch((error: unknown) => {
          this.tables = null;
          throw error;
        });
    }
    return this.tables;
  }

  private async download(file: string): Promise<Map<string, CsvRow>> {
    const { data } = await axios.get<string>(`${ARCEP_URL}/${file}`, {
      responseType: 'text',
      timeout: TIMEOUT_MS,
    });
    return parseCsv(data);
  }
}

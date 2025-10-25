import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

interface GeoJSONFeature {
  type: string;
  features?: any[];
  geometry?: any;
  properties?: any;
}

@Injectable()
export class GeoService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'departements');
  private cache: Map<string, any> = new Map();

  private readonly DEPARTEMENT_CODES = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '2A',
    '2B',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
  ];

  async getAllDepartements(): Promise<GeoJSONFeature> {
    const cacheKey = 'all-departements';

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const allFeatures: any[] = [];

    for (const code of this.DEPARTEMENT_CODES) {
      try {
        const filePath = path.join(
          this.dataPath,
          code,
          `departement-${code}.geojson`,
        );
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (data.type === 'Feature') {
          allFeatures.push(data);
        } else if (data.type === 'FeatureCollection') {
          allFeatures.push(...data.features);
        }
      } catch (err) {
        console.warn(`Failed to fetch departement ${code}:`, err);
      }
    }

    const result = {
      type: 'FeatureCollection',
      features: allFeatures,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  async getDepartement(code: string): Promise<GeoJSONFeature> {
    const cacheKey = `dept-${code}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.DEPARTEMENT_CODES.includes(code)) {
      throw new Error(`Department ${code} not found`);
    }

    const filePath = path.join(
      this.dataPath,
      code,
      `departement-${code}.geojson`,
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    this.cache.set(cacheKey, data);
    return data;
  }

  async getCommunes(departementCode: string): Promise<GeoJSONFeature> {
    const cacheKey = `communes-${departementCode}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.DEPARTEMENT_CODES.includes(departementCode)) {
      throw new Error(`Département ${departementCode} non trouvé`);
    }

    const filePath = path.join(
      this.dataPath,
      departementCode,
      `communes-${departementCode}.geojson`,
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    this.cache.set(cacheKey, data);
    return data;
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LatLon } from './geo';
import { QualiteAir } from './pollution.types';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const TIMEOUT_MS = 10000;

type AirQualityResponse = {
  current?: {
    time?: string;
    european_aqi?: number | null;
    pm10?: number | null;
    pm2_5?: number | null;
    nitrogen_dioxide?: number | null;
    ozone?: number | null;
  };
};

@Injectable()
export class QualiteAirService {
  async findCurrent(origin: LatLon): Promise<QualiteAir> {
    const { data } = await axios.get<AirQualityResponse>(AIR_QUALITY_URL, {
      params: {
        latitude: origin.latitude,
        longitude: origin.longitude,
        current: 'european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone',
        timezone: 'Europe/Paris',
      },
      timeout: TIMEOUT_MS,
    });
    const current = data.current ?? {};

    return {
      indiceEuropeen: current.european_aqi ?? null,
      pm10: current.pm10 ?? null,
      pm25: current.pm2_5 ?? null,
      dioxydeAzote: current.nitrogen_dioxide ?? null,
      ozone: current.ozone ?? null,
      mesureLe: current.time ?? null,
    };
  }
}

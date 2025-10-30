export interface RegionBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface RegionConfig {
  id: string;
  name: string;
  bounds: RegionBounds;
  dataPath: string;
  osmFile: string;
  configFile: string;
  polyFile?: string;
  port: number;
  containerName: string;
}

export interface ContainerConfig {
  image: string;
  memory: number;
  shutdownTimeout: number;
  startupTimeout: number;
  healthCheckInterval: number;
  javaOpts: string;
}

export interface GraphHopperConfig {
  regions: RegionConfig[];
  containerConfig: ContainerConfig;
}

export interface Point {
  lat: number;
  lon: number;
}

export interface RouteRequest {
  from: Point;
  to: Point;
  vehicle?: string;
  regionId?: string;
}

export interface RouteResponse {
  distance: number; // en mètres
  time: number; // en secondes
  points?: any;
}

export enum ContainerStatus {
  STOPPED = 'stopped',
  STARTING = 'starting',
  RUNNING = 'running',
  STOPPING = 'stopping',
  ERROR = 'error',
}

export interface RegionState {
  regionId: string;
  status: ContainerStatus;
  containerId?: string;
  lastUsed: Date;
}
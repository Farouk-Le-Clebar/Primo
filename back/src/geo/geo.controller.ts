import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('departements')
  async getAllDepartements(@Res() res: Response) {
    try {
      const data = await this.geoService.getAllDepartements();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.json(data);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch all departements data',
      );
    }
  }

  @Get('departements/:code')
  async getDepartement(@Param('code') code: string, @Res() res: Response) {
    try {
      const data = await this.geoService.getDepartement(code);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.json(data);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch departement with code ' + code,
      );
    }
  }

  @Get('communes/:departementCode')
  async getCommunes(
    @Param('departementCode') departementCode: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.geoService.getCommunes(departementCode);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.json(data);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch communes data for departement ' + departementCode,
      );
    }
  }


  @Get('pois')
  async getPois(
    @Res() res: Response,
    @Query('bbox') bbox?: string,
    @Query('types') types?: string,
    @Query('zoom') zoom?: string,
  ) {
    if (!bbox) {
      throw new BadRequestException('bbox parameter is required');
    }

    const bboxParts = bbox.split(',');
    if (bboxParts.length !== 4) {
      throw new BadRequestException(
        'bbox must be in format: minLon,minLat,maxLon,maxLat',
      );
    }

    try {
      const data = await this.geoService.getPois({
        bbox,
        types: types ? types.split(',').map((t) => t.trim()) : undefined,
        zoom: zoom ? parseInt(zoom, 10) : undefined,
      });

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.json(data);
    } catch (error) {
      console.error('Error in getPois controller:', error);
      throw new InternalServerErrorException('Failed to fetch POI data');
    }
  }


  @Get('pois/types')
  async getPoiTypes(@Res() res: Response) {
    try {
      const data = await this.geoService.getAvailablePoiTypes();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.json(data);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch available POI types',
      );
    }
  }
}
import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
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
}

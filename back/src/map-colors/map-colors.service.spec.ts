import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { DEFAULT_MAP_COLORS } from './map-colors.defaults';
import { MapColorsService } from './map-colors.service';
import { MapColors } from './map-colors.types';

const CUSTOM_COLORS: MapColors = {
  ...DEFAULT_MAP_COLORS,
  dark: {
    ...DEFAULT_MAP_COLORS.dark,
    hover: { fill: '#ff0000', stroke: '#00ff00', fillOpacity: 0.5 },
  },
};

describe('MapColorsService', () => {
  const findOne = jest.fn();
  const update = jest.fn();
  const service = new MapColorsService({
    findOne,
    update,
  } as unknown as Repository<User>);

  beforeEach(() => jest.clearAllMocks());

  it('renvoie les couleurs par défaut sans préférence', async () => {
    findOne.mockResolvedValue({ id: 'u1', mapColors: null });
    await expect(service.getMapColors('u1')).resolves.toEqual(
      DEFAULT_MAP_COLORS,
    );
  });

  it('renvoie les couleurs enregistrées', async () => {
    findOne.mockResolvedValue({ id: 'u1', mapColors: CUSTOM_COLORS });
    await expect(service.getMapColors('u1')).resolves.toEqual(CUSTOM_COLORS);
  });

  it('demande explicitement la colonne exclue par défaut', async () => {
    findOne.mockResolvedValue(null);
    await service.getMapColors('u1');
    expect(findOne).toHaveBeenCalledWith({
      where: { id: 'u1' },
      select: ['id', 'mapColors'],
    });
  });

  it('enregistre les couleurs', async () => {
    await expect(service.updateMapColors('u1', CUSTOM_COLORS)).resolves.toEqual(
      CUSTOM_COLORS,
    );
    expect(update).toHaveBeenCalledWith('u1', { mapColors: CUSTOM_COLORS });
  });

  it('réinitialise les couleurs', async () => {
    await expect(service.resetMapColors('u1')).resolves.toEqual(
      DEFAULT_MAP_COLORS,
    );
    expect(update).toHaveBeenCalledWith('u1', { mapColors: null });
  });
});

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DEFAULT_MAP_COLORS } from '../map-colors.defaults';
import { UpdateMapColorsDto } from './update-map-colors.dto';

const pipe = new ValidationPipe({ whitelist: true });

const validate = (body: unknown) =>
  pipe.transform(body, { type: 'body', metatype: UpdateMapColorsDto });

const withDefaultState = (patch: Record<string, unknown>) => ({
  ...DEFAULT_MAP_COLORS,
  light: {
    ...DEFAULT_MAP_COLORS.light,
    default: { ...DEFAULT_MAP_COLORS.light.default, ...patch },
  },
});

describe('UpdateMapColorsDto', () => {
  it('accepte les couleurs par défaut', async () => {
    await expect(validate(DEFAULT_MAP_COLORS)).resolves.toEqual(
      DEFAULT_MAP_COLORS,
    );
  });

  it('retire les propriétés inconnues à tous les niveaux', async () => {
    const body = { ...withDefaultState({ weight: 12 }), isAdmin: true };
    await expect(validate(body)).resolves.toEqual(DEFAULT_MAP_COLORS);
  });

  it.each(['#fff', 'ffffff', '#gggggg', '#ffffffff', 'red', '', 12, null])(
    'rejette la couleur %p',
    async (color) => {
      await expect(
        validate(withDefaultState({ fill: color })),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        validate(withDefaultState({ stroke: color })),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each([-0.01, 1.01, Number.NaN, Number.POSITIVE_INFINITY, '0.5', null])(
    "rejette l'opacité %p",
    async (fillOpacity) => {
      await expect(
        validate(withDefaultState({ fillOpacity })),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each([0, 1])("accepte l'opacité limite %p", async (fillOpacity) => {
    await expect(
      validate(withDefaultState({ fillOpacity })),
    ).resolves.toBeDefined();
  });

  it('rejette une version inconnue', async () => {
    await expect(
      validate({ ...DEFAULT_MAP_COLORS, version: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejette un thème manquant', async () => {
    const { version, light } = DEFAULT_MAP_COLORS;
    await expect(validate({ version, light })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejette un état de parcelle manquant', async () => {
    const { default: defaultState, hover } = DEFAULT_MAP_COLORS.dark;
    const body = {
      ...DEFAULT_MAP_COLORS,
      dark: { default: defaultState, hover },
    };
    await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejette un thème fourni sous forme de tableau', async () => {
    const body = { ...DEFAULT_MAP_COLORS, dark: [DEFAULT_MAP_COLORS.dark] };
    await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
  });
});

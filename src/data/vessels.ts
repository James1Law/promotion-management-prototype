import type { VesselType } from './types';

/**
 * Vessel catalogue — used to populate the "planned vessel" dropdown on the
 * promotion form when the seafarer is not currently aboard. Includes the
 * vessels referenced in seed contracts plus a few open positions to pick from.
 */
export interface Vessel {
  name: string;
  type: VesselType;
}

export const VESSELS: Vessel[] = [
  { name: 'MT Nordic Star', type: 'TANKER' },
  { name: 'MT Gulf Trader', type: 'TANKER' },
  { name: 'MV Pacific Bridge', type: 'CONTAINER' },
  { name: 'MV Atlantic Crest', type: 'CONTAINER' },
  { name: 'MV Adriatic Star', type: 'CONTAINER' },
  { name: 'MV Coral Express', type: 'CONTAINER' },
  { name: 'MV Iron Crest', type: 'BULK CARRIER' },
  { name: 'MV Ore Master', type: 'BULK CARRIER' },
  { name: 'MV Cape Horizon', type: 'BULK CARRIER' },
];

/** Vessels of a given type — handy for narrowing the planned-vessel dropdown. */
export function vesselsByType(type: VesselType): Vessel[] {
  return VESSELS.filter((v) => v.type === type);
}

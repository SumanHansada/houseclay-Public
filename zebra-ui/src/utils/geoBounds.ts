export type LatLngBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export const BENGALURU_BOUNDS_RESTRICTED: LatLngBounds = {
  south: 12.834,
  west: 77.46,
  north: 13.139,
  east: 77.743,
};

/**
 * south: Covers southern extensions like Electronics City/Anekal
 * west: Includes western areas like Kengeri/Bidadi
 * north: Extends to northern outskirts like Yelahanka/Devanahalli
 * east: Reaches eastern fringes like Hoskote
 */
export const BENGALURU_BOUNDS: LatLngBounds = {
  south: 12.66,
  west: 77.33,
  north: 13.23,
  east: 77.84,
};

export function isWithinBounds(
  lat: number,
  lng: number,
  bounds: LatLngBounds,
): boolean {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

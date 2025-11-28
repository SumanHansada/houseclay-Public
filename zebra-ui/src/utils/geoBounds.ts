export type LatLngBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export const BENGALURU_BOUNDS: LatLngBounds = {
  south: 12.834,
  west: 77.46,
  north: 13.139,
  east: 77.743,
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

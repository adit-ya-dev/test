export interface BoundingBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export interface AOIRequest {
  bbox: BoundingBox;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  regionName?: string;
}

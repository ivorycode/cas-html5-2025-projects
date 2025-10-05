export interface PhotonResponse {
  features: PhotonFeature[];
}

export interface PhotonFeature {
  geometry: PhotonGeometry;
  properties: PhotonProperties;
}

export interface PhotonGeometry {
  coordinates: [number, number]; // [lon, lat]
  type: 'Point';
}

export interface PhotonProperties {
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface PlaceSuggestion {
  label: string;
  coords: [number, number]; // [lat, lon]
}

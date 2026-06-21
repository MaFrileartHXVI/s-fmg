const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

if (!mapboxToken) {
  throw new Error(
    "Infrastructure initialization failure: Missing Mapbox access token."
  )
}

export const MAPBOX_CONFIG = {
  accessToken: mapboxToken,
  style: "mapbox://styles/mapbox/streets-v12",
  defaultCenter: [107.1234, -6.2612] as [number, number],
  zoom: 15,
}
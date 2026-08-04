import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Known city coordinate mapping for fallback matching
const CITY_COORDINATES = {
  mumbai: { lat: 18.9438, lng: 72.8232 }, // Marine Drive
  delhi: { lat: 28.6129, lng: 77.2295 }, // India Gate
  bengaluru: { lat: 12.9766, lng: 77.5993 }, // Cubbon Park
  bangalore: { lat: 12.9766, lng: 77.5993 },
  pune: { lat: 18.5204, lng: 73.8567 },
  hyderabad: { lat: 17.4065, lng: 78.4772 }, // Hussain Sagar
  chennai: { lat: 13.0475, lng: 80.2824 }, // Marina Beach
  goa: { lat: 15.4989, lng: 73.8278 },
  kolkata: { lat: 22.5448, lng: 88.3426 }, // Victoria Memorial
  jaipur: { lat: 26.9124, lng: 75.7873 },
};

// Generates a realistic multi-point race loop path around a given center
function generateRaceLoop(centerLat, centerLng) {
  return [
    [centerLat, centerLng],
    [centerLat + 0.008, centerLng + 0.005],
    [centerLat + 0.015, centerLng + 0.012],
    [centerLat + 0.012, centerLng + 0.022],
    [centerLat + 0.002, centerLng + 0.018],
    [centerLat - 0.006, centerLng + 0.009],
    [centerLat, centerLng], // Loop back to start line
  ];
}

// Auto-adjusts map zoom & center to frame the entire polyline route
function AutoFitBounds({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 1) {
      try {
        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (err) {
        console.error("Map fitBounds error:", err);
      }
    } else if (route && route.length === 1) {
      map.setView(route[0], 13);
    }
  }, [map, route]);
  return null;
}

export default function RouteMap({
  coordinates = [],
  startLat,
  startLng,
  locationName = "",
  title = "Race Route",
  height = "380px",
}) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: defaultIcon.options.iconUrl,
      iconRetinaUrl: defaultIcon.options.iconRetinaUrl,
      shadowUrl: defaultIcon.options.shadowUrl,
    });
  }, []);

  // Determine center coordinates
  let centerLat = startLat;
  let centerLng = startLng;

  if (!centerLat || !centerLng) {
    const locLower = (locationName || "").toLowerCase();
    const matchedCityKey = Object.keys(CITY_COORDINATES).find((key) =>
      locLower.includes(key)
    );
    if (matchedCityKey) {
      centerLat = CITY_COORDINATES[matchedCityKey].lat;
      centerLng = CITY_COORDINATES[matchedCityKey].lng;
    } else {
      // Default to Mumbai Marine Drive
      centerLat = 18.9438;
      centerLng = 72.8232;
    }
  }

  // Construct full route polyline
  const route =
    coordinates && Array.isArray(coordinates) && coordinates.length > 1
      ? coordinates
      : generateRaceLoop(Number(centerLat), Number(centerLng));

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 shadow-xl relative"
      style={{ height }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFitBounds route={route} />

        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "#f15a24", weight: 5, opacity: 0.9 }}
          />
        )}

        <Marker position={route[0]}>
          <Popup>
            <div className="font-semibold text-gray-900">
              🏃 {title}
              <br />
              <span className="text-xs text-orange-600 font-bold">Start Line</span>
            </div>
          </Popup>
        </Marker>

        {route.length > 1 && (
          <Marker position={route[route.length - 1]}>
            <Popup>
              <div className="font-semibold text-gray-900">
                🏁 {title}
                <br />
                <span className="text-xs text-emerald-600 font-bold">Finish Line</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

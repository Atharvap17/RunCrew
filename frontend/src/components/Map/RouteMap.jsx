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
      map.setView(route[0], 14);
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

  const hasValidStart =
    startLat !== null &&
    startLat !== undefined &&
    startLng !== null &&
    startLng !== undefined &&
    !isNaN(Number(startLat)) &&
    !isNaN(Number(startLng));

  const hasCoordinates = Array.isArray(coordinates) && coordinates.length > 0;

  // Build real route from provided coordinates or start point
  let route = [];
  if (hasCoordinates) {
    route = coordinates;
  } else if (hasValidStart) {
    route = [[Number(startLat), Number(startLng)]];
  }

  // If no coordinates are available at all, show an informative empty state instead of fake map
  if (route.length === 0) {
    return (
      <div
        className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center shadow-xl"
        style={{ height }}
      >
        <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-2xl text-orange-400 mb-3">
          📍
        </div>
        <h4 className="text-white font-semibold text-lg mb-1">Route Map Not Specified</h4>
        <p className="text-gray-400 text-sm max-w-sm">
          The organizer has not set exact map route coordinates for {locationName || "this event"} yet.
        </p>
      </div>
    );
  }

  const centerLat = route[0][0];
  const centerLng = route[0][1];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 shadow-xl relative"
      style={{ height }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={14}
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


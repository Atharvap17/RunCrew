import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch, FaTrash, FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";

// SVG Map Pin Generators (No external CDN dependencies or broken image errors)
const createPinIcon = (color, label = "") => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
      <path fill="${color}" stroke="#ffffff" stroke-width="1.8" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
      <circle cx="12" cy="12" r="6.5" fill="#ffffff"/>
      <text x="12" y="15" font-size="8.5" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" fill="${color}" text-anchor="middle">${label}</text>
    </svg>
  `;
  return L.divIcon({
    className: "custom-map-pin",
    html: svg,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });
};

const startIcon = createPinIcon("#10b981", "START");
const finishIcon = createPinIcon("#ef4444", "END");
const defaultIcon = createPinIcon("#f15a24", "•");

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 14, { duration: 1.2 });
    }
  }, [map, center]);
  return null;
}

export default function LocationPickerMap({
  startLat,
  startLng,
  routeCoordinates = [],
  onChange,
  height = "340px",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);

  const defaultCenter = [
    startLat && !isNaN(Number(startLat)) ? Number(startLat) : 19.076,
    startLng && !isNaN(Number(startLng)) ? Number(startLng) : 72.8777,
  ];

  const handleMapClick = (lat, lng) => {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));

    let updatedRoute = Array.isArray(routeCoordinates) ? [...routeCoordinates] : [];

    if (updatedRoute.length === 0) {
      updatedRoute = [[roundedLat, roundedLng]];
    } else {
      updatedRoute.push([roundedLat, roundedLng]);
    }

    onChange({
      start_latitude: updatedRoute[0][0],
      start_longitude: updatedRoute[0][1],
      route_coordinates: updatedRoute,
    });
  };

  const handleSearch = async (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const resultLat = parseFloat(parseFloat(data[0].lat).toFixed(6));
        const resultLng = parseFloat(parseFloat(data[0].lon).toFixed(6));

        // Pan map view to searched location without automatically pinning point 1
        setSearchedLocation([resultLat, resultLng]);
      } else {
        setSearchError("Location not found. Try searching another landmark or click on the map directly.");
      }
    } catch (err) {
      setSearchError("Search service unavailable. Please navigate on the map directly.");
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    onChange({
      start_latitude: null,
      start_longitude: null,
      route_coordinates: [],
    });
    setSearchedLocation(null);
    setSearchError("");
  };

  const route = Array.isArray(routeCoordinates) ? routeCoordinates : [];
  const flyCenter = searchedLocation || (route.length > 0 ? route[route.length - 1] : null);

  return (
    <div className="space-y-3">
      <style>{`
        .custom-map-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      {/* Search Header Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="form-input text-xs py-2 px-3 flex-1"
            placeholder="Search city/landmark (e.g. Marine Drive, Mumbai)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1 shrink-0"
          >
            <FaSearch /> {searching ? "Searching..." : "Locate"}
          </button>
        </div>

        {route.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-outline text-xs py-2 px-3 text-red-400 hover:text-red-300 flex items-center gap-1 shrink-0"
          >
            <FaTrash /> Clear Route ({route.length} pts)
          </button>
        )}
      </div>

      {searchError && <p className="text-xs text-red-400">{searchError}</p>}

      <p className="text-xs text-gray-400 flex items-center gap-1">
        💡 <span className="font-semibold text-gray-300">Tip:</span> Search location to pan map. Click on map to set points. First click sets <span className="text-emerald-400 font-bold">Start Line</span>, subsequent clicks plot <span className="text-orange-400 font-bold">Race Route</span> & <span className="text-red-400 font-bold">Finish Line</span>.
      </p>

      {/* Interactive Leaflet Map Container */}
      <div
        className="rounded-xl overflow-hidden border border-white/15 relative shadow-inner"
        style={{ height }}
      >
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {flyCenter && <FlyToCenter center={flyCenter} />}

          <MapClickHandler onMapClick={handleMapClick} />

          {/* Polyline Route */}
          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "#f15a24", weight: 5, opacity: 0.9 }}
            />
          )}

          {/* Start Line Marker (First Point) */}
          {route.length > 0 && (
            <Marker position={route[0]} icon={startIcon}>
              <Popup>
                <div className="text-xs font-semibold text-gray-900">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <FaMapMarkerAlt /> Start Line
                  </span>
                  Lat: {route[0][0]}, Lng: {route[0][1]}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Waypoints */}
          {route.length > 2 &&
            route.slice(1, route.length - 1).map((pt, idx) => (
              <Marker key={idx} position={pt} icon={defaultIcon}>
                <Popup>
                  <div className="text-xs text-gray-900">
                    Waypoint #{idx + 1}<br />
                    Lat: {pt[0]}, Lng: {pt[1]}
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Finish Line Marker (Last Point if > 1) */}
          {route.length > 1 && (
            <Marker position={route[route.length - 1]} icon={finishIcon}>
              <Popup>
                <div className="text-xs font-semibold text-gray-900">
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <FaFlagCheckered /> Finish Line
                  </span>
                  Lat: {route[route.length - 1][0]}, Lng: {route[route.length - 1][1]}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Coordinate Status Summary */}
      {route.length > 0 && (
        <div className="bg-slate-900/60 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 flex flex-wrap justify-between items-center gap-2">
          <div>
            <span className="text-emerald-400 font-medium mr-3">
              🟢 Start: {route[0][0]}, {route[0][1]}
            </span>
            {route.length > 1 && (
              <span className="text-red-400 font-medium">
                🔴 Finish: {route[route.length - 1][0]}, {route[route.length - 1][1]}
              </span>
            )}
          </div>
          <span className="text-gray-400">{route.length} point(s) recorded</span>
        </div>
      )}
    </div>
  );
}

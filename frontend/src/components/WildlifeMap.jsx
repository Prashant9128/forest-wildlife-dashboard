import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔧 Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🎯 Custom colored marker
const createCustomIcon = (color = "#10b981") =>
  new L.DivIcon({
    className: "custom-icon",
    html: `
      <div style="
        background:${color};
        width:22px;
        height:22px;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 4px 6px rgba(0,0,0,.4);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });

// 🎯 Auto-focus map on latest observation
function AutoCenter({ observations }) {
  const map = useMap();

  useEffect(() => {
    if (!observations?.length) return;

    const latest = observations.find(
      (o) => o.coordinates?.lat && o.coordinates?.lng
    );

    if (latest) {
      map.setView(
        [latest.coordinates.lat, latest.coordinates.lng],
        7,
        { animate: true }
      );
    }
  }, [observations, map]);

  return null;
}

export default function WildlifeMap({ observations = [] }) {
  const defaultCenter = [20.5937, 78.9629]; // 🇮🇳 India

  // 🎯 Normalize data once (performance)
  const validObservations = useMemo(
    () =>
      observations.filter(
        (o) => o.coordinates?.lat && o.coordinates?.lng
      ),
    [observations]
  );

  const getStatusColor = (obs) => {
    const status =
      obs.conservationStatus || obs.status || "protected";

    switch (status.toLowerCase()) {
      case "endangered":
        return "#ef4444";
      case "vulnerable":
        return "#eab308";
      case "protected":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  return (
    <div className="glass p-2 h-[500px] w-full relative z-0 rounded-xl overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 🔁 Auto recenter */}
        <AutoCenter observations={validObservations} />

        {/* 📍 Markers */}
        {validObservations.map((obs) => (
          <Marker
            key={obs._id}
            position={[obs.coordinates.lat, obs.coordinates.lng]}
            icon={createCustomIcon(getStatusColor(obs))}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-1">
                  {obs.species}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {obs.location}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    getStatusColor(obs) === "#ef4444"
                      ? "bg-red-500"
                      : getStatusColor(obs) === "#eab308"
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                  }`}
                >
                  {obs.conservationStatus || obs.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 🗺️ Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-black/80 backdrop-blur p-4 rounded-lg border border-white/10 text-xs">
        <h4 className="font-bold mb-2 text-white/70">Legend</h4>
        <div className="space-y-2 text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Endangered
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            Vulnerable
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Protected
          </div>
        </div>
      </div>
    </div>
  );
}

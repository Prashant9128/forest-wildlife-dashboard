import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔧 Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* 🔁 Recenter map when position changes */
function RecenterMap({ position }) {
  const map = useMap();

  if (position) {
    map.setView([position.lat, position.lng], 13);
  }

  return null;
}

/* 📍 Handle map click */
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
}

export default function LocationPicker({ position, setPosition }) {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={[20.5937, 78.9629]} // initial fallback
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* 🔁 Auto recenter */}
        <RecenterMap position={position} />

        {/* 📍 Marker */}
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>

      {/* 🔎 Status label */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs p-2 rounded text-center z-[1000] pointer-events-none">
        {position
          ? "📍 Location selected accurately"
          : "Tap on map to mark exact location"}
      </div>
    </div>
  );
}

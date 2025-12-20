import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaCamera,
  FaTimes,
  FaGlobeAmericas,
} from "react-icons/fa";
import LocationPicker from "./LocationPicker";
import api from "../api/axios";

/* 🌍 Reverse Geocoding (coords → address) */
const fetchAddressFromCoords = async (lat, lng, setFormData) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    if (data?.display_name) {
      setFormData((prev) => ({
        ...prev,
        location: data.display_name,
      }));
    }
  } catch (err) {
    console.error("Reverse geocoding failed", err);
  }
};

/* 🔎 Forward Geocoding (address → coords) */
const fetchCoordsFromAddress = async (address, setCoordinates) => {
  try {
    if (!address) return;

    // 🛡️ Sanitize: Nominatim fails on very long/complex queries
    // If address is huge, try to use just the first few parts (e.g. "Mall Road, Amritsar")
    let query = address;
    if (address.length > 80) {
      const parts = address.split(',');
      if (parts.length > 2) {
        query = parts.slice(0, 3).join(',');
      }
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Geocoding service unavailable");

    const data = await res.json();

    if (data && data.length > 0) {
      setCoordinates({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      });
    } else {
      alert("Location not found. Try a simpler address (e.g. City, State).");
    }
  } catch (err) {
    console.warn("Forward geocoding failed:", err);
    alert("Could not auto-locate address. Please use the map pin.");
  }
};

export default function AddObservation({ onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    species: "",
    location: "",
    status: "protected",
    notes: "",
    image: "",
  });

  const [coordinates, setCoordinates] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  /* =======================
     EDIT MODE
  ======================= */
  useEffect(() => {
    if (initialData) {
      setFormData({
        species: initialData.species || "",
        location: initialData.location || "",
        status:
          initialData.conservationStatus?.toLowerCase() || "protected",
        notes: initialData.description || "",
        image: initialData.image || "",
      });

      if (initialData.coordinates) {
        setCoordinates(initialData.coordinates);
      }

      if (initialData.image) {
        setPreview(initialData.image);
      }
    }
  }, [initialData]);

  /* =======================
     NEW MODE → REAL GPS
  ======================= */
  useEffect(() => {
    if (!initialData && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy > 150) {
            alert(
              "⚠️ GPS accuracy is low. Please ensure real location is enabled."
            );
          }

          setCoordinates({
            lat: latitude,
            lng: longitude,
          });

          fetchAddressFromCoords(latitude, longitude, setFormData);
        },
        (error) => {
          console.warn("Location permission denied:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    }
  }, [initialData]);

  /* =======================
     Handlers
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const wildlifeImages = [
        "https://images.unsplash.com/photo-1564349683136-7726501ca75b?w=600",
        "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600",
      ];
      const randomImage =
        wildlifeImages[Math.floor(Math.random() * wildlifeImages.length)];

      const payload = {
        species: formData.species,
        location: formData.location,
        coordinates: coordinates
          ? { lat: coordinates.lat, lng: coordinates.lng }
          : null,
        conservationStatus: formData.status,
        description: formData.notes,
        image: formData.image || randomImage,
      };

      if (initialData) {
        await api.put(`/observations/${initialData._id}`, payload);
        alert("Observation updated successfully!");
      } else {
        await api.post("/observations", payload);
      }

      onClose ? onClose() : navigate("/");
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to submit observation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="glass p-6 md:p-8 max-w-4xl mx-auto relative mt-10">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <FaTimes size={20} />
        </button>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-300">
          {initialData ? "Edit Observation" : "New Observation"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <input
              type="text"
              name="species"
              value={formData.species}
              onChange={handleChange}
              placeholder="Species (e.g. Bengal Tiger)"
              className="input-field"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="protected">Protected</option>
              <option value="vulnerable">Vulnerable</option>
              <option value="endangered">Endangered</option>
            </select>

            {/* LOCATION INPUT + SEARCH */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <FaMapMarkerAlt />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Type city/state (e.g. Bihar)"
                  className="input-field pl-10"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  fetchCoordsFromAddress(formData.location, setCoordinates)
                }
                className="px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
              >
                Search
              </button>
            </div>

            <p className="text-xs text-white/40 flex items-center gap-1">
              <FaGlobeAmericas /> GPS, map click, or text search supported
            </p>
          </div>

          {/* MAP */}
          <LocationPicker
            position={coordinates}
            setPosition={(pos) => {
              setCoordinates(pos);
              fetchAddressFromCoords(pos.lat, pos.lng, setFormData);
            }}
          />
        </div>

        {/* IMAGE + NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {!preview ? (
              <label className="flex flex-col items-center justify-center h-32 rounded-xl bg-white/5 border-2 border-dashed border-white/10 cursor-pointer">
                <FaCamera className="text-xl text-white/40 mb-1" />
                <span className="text-xs text-white/40">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative h-32 rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData((p) => ({ ...p, image: "" }));
                  }}
                  className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Field notes"
            className="input-field resize-none h-32"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-4 text-lg"
        >
          {isSubmitting ? "Syncing..." : "Log Observation Entry"}
        </button>
      </form>
    </div>
  );
}

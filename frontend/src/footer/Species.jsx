import { useState } from "react";
import { FaShieldAlt, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTree, FaMapMarkerAlt } from "react-icons/fa";

const SPECIES_DATA = [
  {
    name: "Bengal Tiger",
    status: "Endangered",
    desc: "The Bengal tiger is a population of the Panthera tigris tigris subspecies. It ranks among the biggest wild cats alive today.",
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?auto=format&fit=crop&q=80&w=800",
    habitat: "Dense forests, mangroves",
    scientificName: "Panthera tigris tigris",
    population: "~3,000",
    threats: "Poaching, Habitat Loss"
  },
  {
    name: "Asian Elephant",
    status: "Endangered",
    desc: "The largest living land animal in Asia. Since 1986, the Asian elephant has been listed as Endangered on the IUCN Red List.",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800",
    habitat: "Grasslands, forests",
    scientificName: "Elephas maximus",
    population: "~40,000",
    threats: "Human-Wildlife Conflict"
  },
  {
    name: "Indian Rhinoceros",
    status: "Vulnerable",
    desc: "Also known as the greater one-horned rhinoceros, it is native to the Indian subcontinent.",
    image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=800",
    habitat: "Riverine grasslands",
    scientificName: "Rhinoceros unicornis",
    population: "~3,700",
    threats: "Poaching for Horn"
  },
  {
    name: "Snow Leopard",
    status: "Vulnerable",
    desc: "A felid in the genus Panthera native to the mountain ranges of Central and South Asia.",
    image: "https://plus.unsplash.com/premium_photo-1664303899642-88b294481198?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    habitat: "Alpine and subalpine zones",
    scientificName: "Panthera uncia",
    population: "~4,000 - 6,500",
    threats: "Climate Change, Retaliatory Killing"
  },
  {
    name: "Red Panda",
    status: "Endangered",
    desc: "A carnivore native to the eastern Himalayas and southwestern China.",
    image: "https://images.unsplash.com/photo-1542880941-1abfea46bba6?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    habitat: "Temperate forests",
    scientificName: "Ailurus fulgens",
    population: "<10,000",
    threats: "Deforestation, Disease"
  },
  {
    name: "Peacock",
    status: "Protected",
    desc: "The Indian peafowl is a resident breeder across the Indian subcontinent.",
    image: "https://images.unsplash.com/photo-1572877183903-f6f33bbfa7c5?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    habitat: "Deciduous forests",
    scientificName: "Pavo cristatus",
    population: "Stable",
    threats: "Habitat degradation"
  }
];

export default function Species() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Species Library
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Discover the diverse wildlife monitored by our rangers. Understanding these species is key to their conservation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPECIES_DATA.map((animal, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedSpecies(animal)}
              className="glass rounded-2xl overflow-hidden group hover:bg-slate-800/80 transition-all duration-300 cursor-pointer border border-white/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/20"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg
                      ${animal.status === 'Endangered' ? 'bg-red-500/90 text-white' :
                      animal.status === 'Vulnerable' ? 'bg-amber-500/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
                    {animal.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">{animal.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {animal.desc}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-white/10">
                  <span className="uppercase tracking-widest font-semibold text-emerald-500">Habitat:</span>
                  {animal.habitat}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedSpecies && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedSpecies(null)}
        >
          <div
            className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSpecies(null)}
              className="absolute top-4 right-4 z-50 bg-black/40 text-white p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <FaTimes size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img
                src={selectedSpecies.image}
                alt={selectedSpecies.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden"></div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto custom-scrollbar bg-slate-900/50">
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-white/10
                        ${selectedSpecies.status === 'Endangered' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    selectedSpecies.status === 'Vulnerable' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                  {selectedSpecies.status}
                </span>
                <h2 className="text-4xl font-serif font-bold text-white mb-1">{selectedSpecies.name}</h2>
                <p className="text-emerald-400 italic text-sm">{selectedSpecies.scientificName}</p>
              </div>

              <div className="space-y-6 flex-grow">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {selectedSpecies.desc}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                      <FaMapMarkerAlt />
                      <span className="text-xs font-bold uppercase tracking-widest">Habitat</span>
                    </div>
                    <p className="text-slate-300 font-medium">{selectedSpecies.habitat}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                      <FaTree />
                      <span className="text-xs font-bold uppercase tracking-widest">Population</span>
                    </div>
                    <p className="text-slate-300 font-medium">{selectedSpecies.population}</p>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <FaExclamationTriangle />
                    <span className="text-xs font-bold uppercase tracking-widest">Major Threats</span>
                  </div>
                  <p className="text-slate-300">{selectedSpecies.threats}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

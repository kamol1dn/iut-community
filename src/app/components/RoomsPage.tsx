import { useState } from "react";
import { Search, Filter, MapPin, Clock, CheckCircle, XCircle, Projector } from "lucide-react";

type Room = {
  id: string;
  name: string;
  building: string;
  status: "available" | "occupied";
  currentClass?: string;
  availableUntil?: string;
  nextFree?: string;
  hasProjector: boolean;
};

export function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuilding, setFilterBuilding] = useState<"all" | "A" | "B">("all");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterProjector, setFilterProjector] = useState(false);

  const rooms: Room[] = [
    {
      id: "1",
      name: "A605",
      building: "A",
      status: "available",
      availableUntil: "18:00",
      hasProjector: true,
    },
    {
      id: "2",
      name: "A608",
      building: "A",
      status: "occupied",
      currentClass: "Professional Skills",
      nextFree: "12:30",
      hasProjector: false,
    },
    {
      id: "3",
      name: "B209",
      building: "B",
      status: "occupied",
      currentClass: "Database Application & Design",
      nextFree: "16:30",
      hasProjector: true,
    },
    {
      id: "4",
      name: "B102",
      building: "B",
      status: "available",
      availableUntil: "14:00",
      hasProjector: true,
    },
    {
      id: "5",
      name: "C401",
      building: "C",
      status: "available",
      availableUntil: "18:00",
      hasProjector: true,
    },
    {
      id: "6",
      name: "Lab 3",
      building: "B",
      status: "occupied",
      currentClass: "Computer Networks Lab",
      nextFree: "13:00",
      hasProjector: false,
    },
    {
      id: "7",
      name: "A305",
      building: "A",
      status: "available",
      availableUntil: "15:00",
      hasProjector: false,
    },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = filterBuilding === "all" || room.building === filterBuilding;
    const matchesAvailable = !filterAvailable || room.status === "available";
    const matchesProjector = !filterProjector || room.hasProjector;
    return matchesSearch && matchesBuilding && matchesAvailable && matchesProjector;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Rooms & Facilities</h1>
        <p className="text-muted-foreground mt-1">Find available study spaces</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={`px-4 py-2 rounded-lg border transition ${
                filterAvailable
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Available Now
            </button>
            <button
              onClick={() => setFilterProjector(!filterProjector)}
              className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                filterProjector
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Projector className="w-4 h-4" />
              Has Projector
            </button>
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value as "all" | "A" | "B")}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition outline-none cursor-pointer"
            >
              <option value="all">All Buildings</option>
              <option value="A">Building A</option>
              <option value="B">Building B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
              room.status === "available"
                ? "border-green-200 hover:border-green-300"
                : "border-red-200 hover:border-red-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    room.status === "available" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      room.status === "available" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-gray-900">Room {room.name}</h3>
                  <p className="text-gray-500">Building {room.building}</p>
                </div>
              </div>
              {room.status === "available" ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>

            <div className="space-y-2">
              {room.status === "available" ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Available until {room.availableUntil}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                    <XCircle className="w-4 h-4" />
                    <span>Occupied: {room.currentClass}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>Next free: {room.nextFree}</span>
                  </div>
                </>
              )}

              {room.hasProjector && (
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                  <Projector className="w-4 h-4" />
                  <span>Projector available</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-900">No rooms match your filters</p>
          <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

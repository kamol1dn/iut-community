import { useState } from "react";
import { Clock, MapPin, User, BookOpen, X } from "lucide-react";

type ClassSession = {
  id: string;
  code: string;
  name: string;
  time: string;
  room: string;
  professor: string;
  color: string;
};

export function TimetablePage() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);

  const schedule: Record<string, ClassSession[]> = {
    Monday: [
      {
        id: "1",
        code: "PS",
        name: "Professional Skills",
        time: "09:00 - 10:30",
        room: "A305",
        professor: "Dr. Sarah Johnson",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      {
        id: "2",
        code: "CN",
        name: "Computer Networks",
        time: "11:00 - 12:30",
        room: "B102",
        professor: "Prof. Michael Chen",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
    ],
    Tuesday: [
      {
        id: "3",
        code: "DAD",
        name: "Database Application & Design",
        time: "10:00 - 11:30",
        room: "B209",
        professor: "Dr. Emily Rodriguez",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      {
        id: "4",
        code: "IP",
        name: "Internet Programming",
        time: "14:00 - 15:30",
        room: "C401",
        professor: "Dr. James Wilson",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
    ],
    Wednesday: [
      {
        id: "5",
        code: "IE",
        name: "Industrial Engineering",
        time: "09:00 - 10:30",
        room: "A608",
        professor: "Prof. Lisa Anderson",
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
    ],
    Thursday: [
      {
        id: "6",
        code: "CN",
        name: "Computer Networks Lab",
        time: "11:00 - 13:00",
        room: "Lab 3",
        professor: "Prof. Michael Chen",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      {
        id: "7",
        code: "DAD",
        name: "Database Lab",
        time: "15:00 - 16:30",
        room: "Lab 5",
        professor: "Dr. Emily Rodriguez",
        color: "bg-green-100 text-green-700 border-green-200",
      },
    ],
    Friday: [
      {
        id: "8",
        code: "IP",
        name: "Internet Programming",
        time: "10:00 - 11:30",
        room: "C401",
        professor: "Dr. James Wilson",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
    ],
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const today = "Tuesday";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Timetable</h1>
          <p className="text-muted-foreground mt-1">Your weekly schedule</p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 rounded-md transition ${
              viewMode === "daily"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded-md transition ${
              viewMode === "weekly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Weekly View
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      {viewMode === "weekly" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
                <div className="p-4 border-r border-gray-200">
                  <p className="text-gray-600">Time</p>
                </div>
                {days.map((day) => (
                  <div key={day} className="p-4 border-r border-gray-200 last:border-r-0">
                    <p className="text-gray-900">{day}</p>
                    {day === today && (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded mt-1">
                        Today
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="grid grid-cols-6">
                <div className="border-r border-gray-200 bg-gray-50">
                  {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
                    <div key={time} className="p-4 border-b border-gray-200 h-24">
                      <p className="text-gray-500">{time}</p>
                    </div>
                  ))}
                </div>

                {days.map((day) => (
                  <div key={day} className="border-r border-gray-200 last:border-r-0">
                    <div className="p-2 space-y-2 min-h-[480px]">
                      {schedule[day]?.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => setSelectedClass(session)}
                          className={`w-full p-3 rounded-lg border text-left hover:shadow-md transition ${session.color}`}
                        >
                          <p className="font-medium">{session.code}</p>
                          <p className="mt-1 opacity-90">{session.time}</p>
                          <p className="mt-0.5 opacity-75">{session.room}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule[today]?.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedClass(session)}
              className={`w-full p-4 rounded-xl border text-left hover:shadow-md transition ${session.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg">{session.name}</p>
                  <p className="mt-1">Code: {session.code}</p>
                </div>
                <span className="px-3 py-1 bg-white/50 rounded-lg">
                  {session.time}
                </span>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{session.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{session.professor}</span>
                </div>
              </div>
            </button>
          ))}
          {!schedule[today] && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-900">No classes today 🎉</p>
              <p className="text-muted-foreground mt-1">Enjoy your free day!</p>
            </div>
          )}
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClass && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600">Course Details</p>
                <h2 className="text-gray-900 mt-1">{selectedClass.name}</h2>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-500">Course Code</p>
                  <p className="text-gray-900">{selectedClass.code}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="text-gray-900">{selectedClass.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="text-gray-900">{selectedClass.room}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-500">Professor</p>
                  <p className="text-gray-900">{selectedClass.professor}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View Syllabus
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

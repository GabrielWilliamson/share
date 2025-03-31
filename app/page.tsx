"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Calendar, ChevronRight, Monitor, Mail, Wrench, Network } from "lucide-react"

// Module definitions with their date ranges, colors, and icons
const modules = [
  {
    name: "Sistemas Operativos",
    startDate: new Date("2025-02-17"),
    endDate: new Date("2025-03-21"),
    color: "bg-purple-900 hover:bg-purple-800",
    borderColor: "border-purple-700",
    textColor: "text-purple-400",
    icon: Monitor,
  },
  {
    name: "Internet y Correo Electrónico",
    startDate: new Date("2025-03-24"),
    endDate: new Date("2025-04-04"),
    color: "bg-blue-900 hover:bg-blue-800",
    borderColor: "border-blue-700",
    textColor: "text-blue-400",
    icon: Mail,
  },
  {
    name: "Reparación de Equipos de Cómputo",
    startDate: new Date("2025-04-07"),
    endDate: new Date("2025-06-17"),
    color: "bg-green-900 hover:bg-green-800",
    borderColor: "border-green-700",
    textColor: "text-green-400",
    icon: Wrench,
  },
  {
    name: "Servicio de Red de Área Local",
    startDate: new Date("2025-06-18"),
    endDate: new Date("2025-07-01"),
    color: "bg-amber-900 hover:bg-amber-800",
    borderColor: "border-amber-700",
    textColor: "text-amber-400",
    icon: Network,
  },
]

// Function to determine which module a lesson belongs to
function getModuleForLesson(lessonDate) {
  const date = new Date(lessonDate)
  return (
    modules.find((module) => date >= module.startDate && date <= module.endDate) || {
      name: "Otro",
      color: "bg-gray-900 hover:bg-gray-800",
      borderColor: "border-gray-700",
      textColor: "text-gray-400",
      icon: Calendar,
    }
  )
}

export default function Home() {
  const lessons = useQuery(api.lessons.listShortLessons) ?? []

  // Sort lessons by date, most recent first
  const sortedLessons = [...lessons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Clases Recientes</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedLessons.map((lesson) => {
            const module = getModuleForLesson(lesson.date)
            const ModuleIcon = module.icon

            return (
              <Link
                href={`/lesson/${lesson.id}`}
                key={lesson.id}
                className={`${module.color} rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out border ${module.borderColor} hover:shadow-xl hover:scale-102`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${module.textColor} bg-opacity-20 bg-black`}>
                      <ModuleIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${module.textColor}`}>{module.name}</span>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-white">{lesson.title}</h2>

                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time dateTime={lesson.date.toString()}>
                      {new Date(lesson.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm ${module.textColor}`}>Ver detalles</span>
                    <ChevronRight className={`w-5 h-5 ${module.textColor}`} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {sortedLessons.length === 0 && (
          <div className="text-center text-gray-400 mt-8 p-10 border border-gray-800 rounded-lg">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No hay clases disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}


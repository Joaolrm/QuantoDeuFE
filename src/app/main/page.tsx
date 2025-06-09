import { EventList } from "@/components/events/EventList";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuantoDeu - Meus Eventos",
};

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}
    >
      <div className="backdrop-blur-sm bg-black/30 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Meus Eventos</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href="/main/events/create"
              className="bg-amber-600 text-white py-2 px-4 rounded-md text-sm hover:bg-amber-700 text-center transition-colors"
            >
              Criar Evento
            </Link>
            <Link
              href="/main/events/join"
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 text-center transition-colors"
            >
              Participar
            </Link>
          </div>
        </div>
        <EventList />
      </div>
    </div>
  );
}

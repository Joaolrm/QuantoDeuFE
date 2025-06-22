import { EventList } from "@/components/events/EventList";
import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "QuantoDeu - Meus Eventos",
};

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}
    >
      {/* Header fixo */}
      <Header title="Quanto Deu?">
        <Link
          href="/main/events/create"
          className="bg-amber-600 text-white py-2 px-3 rounded-md text-sm hover:bg-amber-700 transition-colors"
        >
          + Novo Evento
        </Link>
      </Header>

      {/* Conteúdo principal */}
      <div className="p-4">
        <div className="backdrop-blur-sm bg-black/30 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">Meus Eventos</h2>
          </div>
          <EventList />
        </div>
      </div>
    </div>
  );
}

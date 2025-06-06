import Head from "next/head";
import { DashboardEvents } from "@/components/Dashboard";
import ".//style_dashboard.css";

export default function Home() {
  return (
    <div className="pb-20 container-dashboard">
      <Head>
        <title>Dashboard</title>
      </Head>

      {/* Conteúdo principal */}
      <main className="p-4">
        <DashboardEvents />
      </main>

      {/* Barra fixa inferior com botões mais próximos */}
      <div className="fixed bottom-0 pr-5 left-0 right-0 flex justify-center items-center gap-16 barra-footer">
        <a className="w-15 h-15  rounded-full bg-amber-500 flex items-center justify-center shadow-md hover:bg-amber-500 transition" aria-label="Home">
          <span className="material-symbols-outlined text-gray-50">menu</span>
        </a>
        <a href="/criarEvento" className="w-15 h-15 rounded-full bg-amber-500 flex items-center justify-center shadow-lg hover:bg-amber-600 transition"aria-label="Criar Evento">
          <span className="material-symbols-outlined text-white">add</span>
        </a>
      </div>
    </div>
  );
}

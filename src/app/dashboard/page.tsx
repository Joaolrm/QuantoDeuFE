import Head from 'next/head';
import { DashboardEvents } from "@/components/Dashboard";
import ".//style.css";

export default function Dashboard() {
  return (
    <div className="min-h-screen pb-20 container-dashboard"> 
      <Head>
        <title>Dashboard Mobile</title>
      </Head>

      {/* Conteúdo principal */}
      <main className="p-4 ">
        <h1 className="text-center text-1xl text-white  mb-2">Organize seus Churrascos com mais Eficiência</h1>

        <DashboardEvents></DashboardEvents>
      </main>

      {/* Barra fixa inferior com botões mais próximos */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-12 barra-footer">
        <button className="w-15 h-15 rounded-full bg-amber-500 flex items-center justify-center shadow-md hover:bg-amber-500 transition">
          <span className="material-symbols-outlined text-2xl text-gray-50">home</span>
        </button>
        
        <a href="/criarEvento" className="w-15 h-15 rounded-full bg-amber-500 flex items-center justify-center shadow-lg hover:bg-amber-600 transition">
          <span className="material-symbols-outlined text-2xl text-white">add</span>
        </a>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import ".//style.css";

export default function criandoEvento() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState("");
  const [itensAdicionados, setItensAdicionados] = useState([]);

  const [itemObrigatorio, setItemObrigatorio] = useState("");
  const [itemOpcional, setItemOpcional] = useState("");

  const adicionarItem = (tipo) => {
    const novoItem = tipo === "obrigatorio" ? itemObrigatorio : itemOpcional;

    if (!novoItem) return;

    // Evitar itens duplicados
    if (!itensAdicionados.some((item) => item.nome === novoItem)) {
      setItensAdicionados([
        ...itensAdicionados,
        { nome: novoItem, tipo },
      ]);
    }

    // Limpar o campo após adicionar
    if (tipo === "obrigatorio") setItemObrigatorio("");
    else setItemOpcional("");
  };

  const removerItem = (itemRemover) => {
    setItensAdicionados(
      itensAdicionados.filter((item) => item.nome !== itemRemover.nome)
    );
  };

  const criarEvento = () => {
    console.log({
      nome,
      endereco,
      data,
      itensAdicionados,
    });
    alert("Evento criado com sucesso!");
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white rounded-lg shadow-lg space-y-4 form-add-evento">
      <div>
        <label className="block text-sm font-bold mb-2">Nome</label>
        <input type="text" placeholder="Ex: Bruna" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 rounded-lg fundo-input text-white placeholder-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Endereço</label>
        <input type="text" placeholder="Ex: otto niemeyer 2500" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full p-2 rounded-lg fundo-input text-white placeholder-gray-300"/>
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Data</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full p-2 rounded-lg fundo-input text-white" />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Itens Obrigatórios</label>
        <div className="flex gap-2">
          <select value={itemObrigatorio} onChange={(e) => setItemObrigatorio(e.target.value)} className="flex-1 p-2 rounded-lg fundo-input text-white">
            <option value="">Selecione um item</option>
            <option value="Cerveja">Cerveja</option>
            <option value="Refrigerante">Refrigerante</option>
          </select>
          <button onClick={() => adicionarItem("obrigatorio")} className="px-4 py-2 bg-amber-500 rounded-lg hover:bg-amber-600">
            Adicionar
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">Itens Opcionais</label>
        <div className="flex gap-2">
          <select value={itemOpcional} onChange={(e) => setItemOpcional(e.target.value)} className="flex-1 p-2 rounded-lg fundo-input text-white" >
            <option value="">Selecione um item</option>
            <option value="Suco">Suco</option>
            <option value="Água">Água</option>
          </select>
          <button onClick={() => adicionarItem("opcional")} className="px-4 py-2 bg-amber-500 rounded-lg hover:bg-amber-600" >
            Adicionar
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Itens Adicionados</h3>
        <ul className="space-y-2">
          {itensAdicionados.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-red-800 p-2 rounded-lg">
              <div className="flex items-center gap-2 relative">
                {item.tipo === "obrigatorio" && (
                  <div className="group relative">
                    <span className="material-symbols-outlined text-yellow-500">
                      warning
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                      Obrigatório
                    </div>
                  </div>
                )}
                {item.nome}
              </div>
              <button onClick={() => removerItem(item)} className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600">
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={criarEvento}
        className="w-full py-2 bg-amber-500 rounded-lg hover:bg-amber-600 font-bold"
      >
        Criar evento
      </button>
    </div>
  );
}

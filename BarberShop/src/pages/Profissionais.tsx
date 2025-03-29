// Profissionais.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Profissional {
  id: string;
  nome: string;
  telefone?: string;
}

interface Props {
  userId: string;
}

export default function Profissionais({ userId }: Props) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const fetchProfissionais = async () => {
    const { data, error } = await supabase
      .from("profissionais")
      .select("*")
      .eq("barbearia_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setProfissionais(data);
  };

  const remover = async (id: string) => {
    const { error } = await supabase.from("profissionais").delete().eq("id", id);
    if (!error) {
      fetchProfissionais();
    } else {
      console.error("Erro ao remover profissional:", error.message);
    }
  };

  const handleAdd = async () => {
    if (!nome) return;
    const { error } = await supabase.from("profissionais").insert([
      {
        nome,
        telefone,
        barbearia_id: userId,
      },
    ]);

    if (!error) {
      setNome("");
      setTelefone("");
      fetchProfissionais();
    }
  };

  useEffect(() => {
    if (userId) fetchProfissionais();
  }, [userId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Profissionais</h2>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border rounded px-3 py-2"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          Adicionar
        </button>
      </div>

      <h3 className="text-lg font-medium">Lista de Profissionais</h3>
      <ul className="space-y-2">
        {profissionais.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>
              {p.nome} {p.telefone && `- ${p.telefone}`}
            </span>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => remover(p.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

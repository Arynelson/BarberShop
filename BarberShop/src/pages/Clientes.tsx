import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
};

export default function Clientes({ userId }: { userId: string }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const fetchClientes = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('barbearia_id', userId);

    if (data) setClientes(data);
  };

  const removerCliente = async (id: string) => {
    await supabase.from('clientes').delete().eq('id', id);
    fetchClientes();
  };

  const adicionarCliente = async () => {
    if (!nome) return;

    const { error } = await supabase.from('clientes').insert({
      nome,
      telefone,
      barbearia_id: userId,
    });

    if (!error) {
      setNome('');
      setTelefone('');
      fetchClientes();
    }
  };

  useEffect(() => {
    if (userId) fetchClientes();
  }, [userId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Clientes</h2>

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
          onClick={adicionarCliente}
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>
              {cliente.nome} {cliente.telefone && `- ${cliente.telefone}`}
            </span>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => removerCliente(cliente.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

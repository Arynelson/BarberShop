import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';





type Servico = {
  id: string;
  nome: string;
  duracao: number | null;
  preco: number;
};

export function Servicos({ userId }: { userId: string }) {
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const [preco, setPreco] = useState('');
  const [servicos, setServicos] = useState<Servico[]>([]);

  const fetchServicos = async () => {
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .eq('barbearia_id', userId);
    if (data) setServicos(data);
  };

  const removerServico = async (id: string) => {
    await supabase.from('servicos').delete().eq('id', id);
    fetchServicos();
  };

  const adicionarServico = async () => {
    if (!nome || !preco) return;

    const duracaoFormatada = duracao ? parseInt(duracao) : null;

    const { error } = await supabase.from('servicos').insert({
      barbearia_id: userId,
      nome,
      duracao: duracaoFormatada,
      preco: parseFloat(preco),
    });

    if (!error) {
      setNome('');
      setDuracao('');
      setPreco('');
      fetchServicos();
    }
  };

  useEffect(() => {
    if (userId) fetchServicos();
  }, [userId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Serviços</h2>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border rounded px-3 py-2"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Duração (min)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Preço R$"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={adicionarServico}
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {servicos.map((s) => (
          <li
            key={s.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>
              {s.nome} {s.duracao ? `- ${s.duracao}min` : ''} - R$ {s.preco.toFixed(2)}
            </span>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => removerServico(s.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function Caixa({ userId }: { userId: string }) {
  const [valor, setValor] = useState("");
  const [forma, setForma] = useState("dinheiro");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [pagamentos, setPagamentos] = useState<any[]>([]);

  const fetchPagamentos = async () => {
    const hoje = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("pagamentos")
      .select("*")
      .eq("barbearia_id", userId)
      .gte("data_pagamento", `${hoje}T00:00:00`)
      .lte("data_pagamento", `${hoje}T23:59:59`)
      .order("data_pagamento", { ascending: false });

    if (data) setPagamentos(data);
  };

  const registrarPagamento = async () => {
    if (!valor) return;
    await supabase.from("pagamentos").insert({
      barbearia_id: userId,
      valor: parseFloat(valor),
      forma_pagamento: forma,
      tipo,
    });
    setValor("");
    fetchPagamentos();
  };

  const total = pagamentos.reduce((sum, p) => p.tipo === "entrada" ? sum + p.valor : sum - p.valor, 0);

  useEffect(() => {
    if (userId) fetchPagamentos();
  }, [userId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">💰 Caixa - Hoje</h2>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border rounded px-3 py-2"
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <select value={forma} onChange={(e) => setForma(e.target.value)} className="border rounded px-3 py-2">
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
          <option value="outro">Outro</option>
        </select>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="border rounded px-3 py-2">
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={registrarPagamento}
        >
          Registrar
        </button>
      </div>

      <h3 className="text-lg font-medium">Transações do Dia</h3>
      <ul className="space-y-2">
        {pagamentos.map((p) => (
          <li key={p.id} className="bg-white rounded p-3 shadow">
            {new Date(p.data_pagamento).toLocaleTimeString("pt-BR")} - {p.tipo.toUpperCase()} - R${p.valor.toFixed(2)} via {p.forma_pagamento}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-bold text-green-600">Saldo do Dia: R$ {total.toFixed(2)}</h3>
    </div>
  );
}

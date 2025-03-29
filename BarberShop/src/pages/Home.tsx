import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home({ userId }: { userId: string }) {
  const [agendamentosPendentes, setAgendamentosPendentes] = useState<any[]>([]);
  const [agendamentosConfirmados, setAgendamentosConfirmados] = useState<any[]>([]);
  const [pagamentosHoje, setPagamentosHoje] = useState<number>(0);
  const [profissionalFiltro, setProfissionalFiltro] = useState<string>("");

  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(hoje);
  fim.setHours(23, 59, 59, 999);

  const fetchResumo = async () => {
    const { data: pendentes } = await supabase
      .from("agendamentos")
      .select("*, clientes(nome, telefone), servicos(nome), profissionais(id, nome)")
      .eq("barbearia_id", userId)
      .gte("data_hora", inicio.toISOString())
      .lte("data_hora", fim.toISOString())
      .or("status.is.null,status.eq.agendado")
      .order("data_hora", { ascending: true });

    if (pendentes) setAgendamentosPendentes(pendentes);

    const { data: confirmados } = await supabase
      .from("agendamentos")
      .select("*, clientes(nome), servicos(nome), profissionais(id, nome)")
      .eq("barbearia_id", userId)
      .eq("status", "confirmado")
      .gte("data_hora", inicio.toISOString())
      .lte("data_hora", fim.toISOString())
      .order("data_hora", { ascending: true });

    if (confirmados) setAgendamentosConfirmados(confirmados);

    const { data: pagamentos } = await supabase
      .from("pagamentos")
      .select("valor")
      .eq("barbearia_id", userId)
      .gte("data_pagamento", inicio.toISOString())
      .lte("data_pagamento", fim.toISOString());

    if (pagamentos) {
      const total = pagamentos.reduce((sum, p) => sum + p.valor, 0);
      setPagamentosHoje(total);
    }
  };

  const confirmarAgendamento = async (id: string, nome: string, telefone: string, horario: string) => {
    await supabase.from("agendamentos").update({ status: "confirmado" }).eq("id", id);
    fetchResumo();

    if (telefone) {
      const mensagem = `Olá ${nome}! Aqui é da barbearia. Confirmamos seu horário para ${horario}. Qualquer dúvida estamos à disposição! ✅`;
      const link = `https://wa.me/55${telefone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
      window.open(link, "_blank");
    }
  };

  const concluirAgendamento = async (id: string) => {
    await supabase.from("agendamentos").update({ status: "concluido" }).eq("id", id);
    fetchResumo();
  };

  const cancelarAgendamento = async (id: string) => {
    await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", id);
    fetchResumo();
  };

  useEffect(() => {
    if (userId) fetchResumo();
  }, [userId]);

  const filtrarPorProfissional = (lista: any[]) => {
    return profissionalFiltro
      ? lista.filter((ag) => ag.profissionais?.id === profissionalFiltro)
      : lista;
  };

  const profissionaisUnicos = [
    ...new Map(
      [...agendamentosPendentes, ...agendamentosConfirmados]
        .filter((ag) => ag.profissionais)
        .map((ag) => [ag.profissionais.id, ag.profissionais])
    ).values(),
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold">🏠 Visão Geral do Dia</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-xl font-medium mb-2">Faturamento até agora:</h3>
        <p className="text-green-600 text-2xl font-bold">R$ {pagamentosHoje.toFixed(2)}</p>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Filtrar por profissional:</label>
        <select
          value={profissionalFiltro}
          onChange={(e) => setProfissionalFiltro(e.target.value)}
          className="border rounded-md px-3 py-2 shadow-sm"
        >
          <option value="">Todos</option>
          {profissionaisUnicos.map((p: any) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-medium mt-6 mb-3">Agendamentos pendentes de confirmação</h3>
        <ul className="space-y-2">
          {filtrarPorProfissional(agendamentosPendentes).length > 0 ? (
            filtrarPorProfissional(agendamentosPendentes).map((ag) => {
              const horario = new Date(ag.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              return (
                <li key={ag.id} className="bg-white p-3 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between">
                  <span>{horario} - {ag.clientes?.nome} - {ag.servicos?.nome} {ag.profissionais && `(Prof: ${ag.profissionais.nome})`}</span>
                  <div className="mt-2 sm:mt-0 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => confirmarAgendamento(ag.id, ag.clientes?.nome, ag.clientes?.telefone, horario)}
                    >
                      Confirmar via WhatsApp
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => cancelarAgendamento(ag.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">Nenhum agendamento pendente</li>
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-medium mt-6 mb-3">Agendamentos confirmados</h3>
        <ul className="space-y-2">
          {filtrarPorProfissional(agendamentosConfirmados).length > 0 ? (
            filtrarPorProfissional(agendamentosConfirmados).map((ag) => {
              const horario = new Date(ag.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              return (
                <li key={ag.id} className="bg-white p-3 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between">
                  <span>{horario} - {ag.clientes?.nome} - {ag.servicos?.nome} {ag.profissionais && `(Prof: ${ag.profissionais.nome})`}</span>
                  <div className="mt-2 sm:mt-0 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => concluirAgendamento(ag.id)}
                    >
                      Concluir
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => cancelarAgendamento(ag.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">Nenhum agendamento confirmado</li>
          )}
        </ul>
      </div>
    </div>
  );
}

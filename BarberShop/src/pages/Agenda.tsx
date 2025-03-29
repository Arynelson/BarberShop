// --- Agenda.tsx estilizado com responsividade e cores por status ---
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

export function Agenda({ userId }: { userId: string }) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [mostrarHoje, setMostrarHoje] = useState(false);

  const fetchDados = async () => {
    const [{ data: cli }, { data: serv }, { data: prof }, { data: agds }] = await Promise.all([
      supabase.from("clientes").select("id, nome, telefone").eq("barbearia_id", userId),
      supabase.from("servicos").select("id, nome").eq("barbearia_id", userId),
      supabase.from("profissionais").select("id, nome").eq("barbearia_id", userId),
      supabase.from("agendamentos").select("id, data_hora, cliente_id, profissional_id, status").eq("barbearia_id", userId),
    ]);

    if (cli) setClientes(cli);
    if (serv) setServicos(serv);
    if (prof) setProfissionais(prof);
    if (agds) setAgendamentos(agds);
  };

  const agendar = async () => {
    if (!clienteId || !servicoId || !dataHora || !profissionalId) return;

    const { error } = await supabase.from("agendamentos").insert({
      barbearia_id: userId,
      cliente_id: clienteId,
      servico_id: servicoId,
      profissional_id: profissionalId,
      data_hora: dataHora,
    });

    if (!error) {
      alert("Agendamento criado com sucesso!");
      setClienteId("");
      setServicoId("");
      setProfissionalId("");
      setDataHora("");
      fetchDados();
    }
  };

  useEffect(() => {
    if (userId) fetchDados();
  }, [userId]);

  const hoje = new Date();
  const agendamentosFiltrados = mostrarHoje
    ? agendamentos.filter((ag) => new Date(ag.data_hora).toDateString() === hoje.toDateString())
    : agendamentos;

  const eventosCalendario = agendamentos.map((ag: any) => {
    const cliente = clientes.find((c) => c.id === ag.cliente_id);
    let backgroundColor = "#eab308"; // agendado (amarelo)
    if (ag.status === "confirmado") backgroundColor = "#22c55e"; // verde
    if (ag.status === "cancelado") backgroundColor = "#ef4444"; // vermelho

    return {
      id: ag.id,
      title: cliente ? `${cliente.nome}` : "Agendamento",
      start: ag.data_hora,
      allDay: false,
      backgroundColor,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Agenda</h2>

      <div className="flex flex-wrap gap-3 items-center">
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Selecionar Cliente</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        <select value={servicoId} onChange={(e) => setServicoId(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Selecionar Serviço</option>
          {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>

        <select value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Selecionar Profissional</option>
          {profissionais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} className="border px-3 py-2 rounded" />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={agendar}>
          Agendar
        </button>
      </div>

      <div className="overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          events={eventosCalendario}
          height="auto"
        />
      </div>

      <button className="text-blue-600 hover:underline" onClick={() => setMostrarHoje(!mostrarHoje)}>
        {mostrarHoje ? "Ver Todos" : "Agendamentos de Hoje"}
      </button>

      <h3 className="text-xl font-medium">Lista</h3>
      <ul className="space-y-2">
        {agendamentosFiltrados.map((ag) => {
          const cliente = clientes.find((c) => c.id === ag.cliente_id);
          const profissional = profissionais.find((p) => p.id === ag.profissional_id);
          return (
            <li key={ag.id} className="bg-white p-3 rounded shadow">
              {new Date(ag.data_hora).toLocaleString("pt-BR")} - {cliente?.nome} {cliente?.telefone && `(${cliente.telefone})`} {profissional && `- Prof: ${profissional.nome}`} ({ag.status || "agendado"})
            </li>
          );
        })}
      </ul>
    </div>
  );
}

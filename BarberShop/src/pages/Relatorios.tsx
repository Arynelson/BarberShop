import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export function Relatorios({ userId }: { userId: string }) {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [servicosMaisUsados, setServicosMaisUsados] = useState<any[]>([]);
  const [horariosMovimentados, setHorariosMovimentados] = useState<any[]>([]);

  const fetchDados = async () => {
    const { data: pg } = await supabase
      .from("pagamentos")
      .select("*")
      .eq("barbearia_id", userId);
    const { data: ags } = await supabase
      .from("agendamentos")
      .select(
        `
        id, data_hora, profissional_id,
        profissionais ( nome ),
        servicos:servico_id ( preco, comissao_percentual, nome )
      `
      )
      .eq("barbearia_id", userId);

    if (pg) setPagamentos(pg);

    if (ags) {
      const porProfissional: Record<string, any> = {};
      const contagemServicos: Record<string, number> = {};
      const horarios: Record<string, number> = {};

      ags.forEach((ag) => {
        const profId = ag.profissional_id;
        const nomeProf = Array.isArray(ag.profissionais)
          ? (ag.profissionais[0] as { nome: string })?.nome
          : (ag.profissionais as { nome: string })?.nome;
        const serv = Array.isArray(ag.servicos) ? ag.servicos[0] : ag.servicos;
        const preco = serv?.preco || 0;
        const comissao = serv?.comissao_percentual || 0;

        if (!porProfissional[profId]) {
          porProfissional[profId] = {
            nome: nomeProf,
            faturamento: 0,
            comissao: 0,
          };
        }
        porProfissional[profId].faturamento += preco;
        porProfissional[profId].comissao += (preco * comissao) / 100;

        if (serv?.nome) {
          contagemServicos[serv.nome] = (contagemServicos[serv.nome] || 0) + 1;
        }

        const hora = new Date(ag.data_hora).getHours();
        const chave = `${hora.toString().padStart(2, "0")}:00`;
        horarios[chave] = (horarios[chave] || 0) + 1;
      });

      setRanking(
        Object.entries(porProfissional).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        }))
      );
      setServicosMaisUsados(
        Object.entries(contagemServicos).map(([nome, total]) => ({
          nome,
          total,
        }))
      );
      setHorariosMovimentados(
        Object.entries(horarios).map(([hora, total]) => ({ hora, total }))
      );
    }
  };

  useEffect(() => {
    if (userId) fetchDados();
  }, [userId]);

  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();

  const totalPorPeriodo = (filtro: (d: Date) => boolean) =>
    pagamentos.reduce((acc, p) => {
      const d = new Date(p.data_pagamento);
      return filtro(d) && p.tipo === "entrada" ? acc + p.valor : acc;
    }, 0);

  const totalHoje = totalPorPeriodo(
    (d) => d.getDate() === dia && d.getMonth() === mes
  );
  const totalSemana = totalPorPeriodo(
    (d) => d >= new Date(hoje.setDate(dia - hoje.getDay()))
  );
  const totalMes = totalPorPeriodo(
    (d) => d.getMonth() === mes && d.getFullYear() === ano
  );

  const totalAtendimentos = pagamentos.filter(
    (p) => p.tipo === "entrada"
  ).length;
  const ticketMedio = totalAtendimentos > 0 ? totalMes / totalAtendimentos : 0;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold">📊 Relatórios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">💵 Faturamento</h3>
          <ul className="space-y-1">
            <li>
              Hoje: <strong>R$ {totalHoje.toFixed(2)}</strong>
            </li>
            <li>
              Semana: <strong>R$ {totalSemana.toFixed(2)}</strong>
            </li>
            <li>
              Mês: <strong>R$ {totalMes.toFixed(2)}</strong>
            </li>
            <li>
              Ticket Médio: <strong>R$ {ticketMedio.toFixed(2)}</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            📈 Horários movimentados
          </h3>
          {horariosMovimentados.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={horariosMovimentados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">Sem dados.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            🏆 Ranking por Profissional
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ranking}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="faturamento" fill="#10b981" name="Faturamento" />
              <Bar dataKey="comissao" fill="#f59e0b" name="Comissão" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            🔧 Serviços mais realizados
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={servicosMaisUsados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

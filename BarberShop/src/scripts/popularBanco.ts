import { faker } from '@faker-js/faker';
import { supabase } from '../lib/supabaseClient';

const userId = '4e6253cd-0b67-4655-8887-c6737a4ac4ef'; // coloque o ID da barbearia logada aqui

async function limparTabelas() {
  await supabase.from('agendamentos').delete().neq('id', '');
  await supabase.from('pagamentos').delete().neq('id', '');
  await supabase.from('clientes').delete().neq('id', '');
  await supabase.from('profissionais').delete().neq('id', '');
  await supabase.from('servicos').delete().neq('id', '');
}

async function popularBanco() {
  await limparTabelas();

  // Criar clientes
  const clientes = Array.from({ length: 20 }).map(() => ({
    barbearia_id: userId,
    nome: faker.person.fullName(),
    telefone: faker.phone.number()
  }));

  const { data: clientesCriados } = await supabase.from('clientes').insert(clientes).select();

  // Criar serviços
  const servicos = Array.from({ length: 5 }).map(() => ({
    barbearia_id: userId,
    nome: faker.commerce.productName(),
    preco: faker.number.float({ min: 30, max: 120 }),
    duracao: faker.number.int({ min: 15, max: 60 }),
    comissao_percentual: faker.number.int({ min: 10, max: 30 }),
  }));
  const { data: servicosCriados } = await supabase.from('servicos').insert(servicos).select();

  // Criar profissionais
  const profissionais = Array.from({ length: 4 }).map(() => ({
    barbearia_id: userId,
    nome: faker.person.firstName(),
  }));
  const { data: profissionaisCriados } = await supabase.from('profissionais').insert(profissionais).select();

  // Criar agendamentos (3 por cliente)
  const agendamentos = clientesCriados!.flatMap((cliente) => {
    return Array.from({ length: 3 }).map(() => {
      const servico = faker.helpers.arrayElement(servicosCriados!);
      const profissional = faker.helpers.arrayElement(profissionaisCriados!);
      const data_hora = faker.date.soon({ days: 14 });
      return {
        barbearia_id: userId,
        cliente_id: cliente.id,
        servico_id: servico.id,
        profissional_id: profissional.id,
        data_hora,
        status: faker.helpers.arrayElement(['agendado', 'confirmado', 'cancelado'])
      };
    });
  });

  const { data: agendamentosCriados } = await supabase.from('agendamentos').insert(agendamentos).select();

  // Criar pagamentos (para alguns agendamentos confirmados)
  const pagamentos = agendamentosCriados!
    .filter((a) => a.status === 'confirmado')
    .map((a) => {
      const serv = servicosCriados!.find((s) => s.id === a.servico_id);
      return {
        barbearia_id: userId,
        valor: serv?.preco || 50,
        tipo: 'entrada',
        forma_pagamento: faker.helpers.arrayElement(['dinheiro', 'pix', 'cartao']),
        data_pagamento: a.data_hora,
      };
    });

  await supabase.from('pagamentos').insert(pagamentos);

  console.log('Banco populado com sucesso!');
}

popularBanco();

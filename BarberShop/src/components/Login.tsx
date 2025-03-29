
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
  onLogin: () => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);
  const [erro, setErro] = useState('');

  const autenticar = async () => {
    setErro('');
    if (modoCadastro) {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) {
        setErro(error.message);
      } else {
        alert('Conta criada com sucesso! Faça login.');
        setModoCadastro(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro(error.message);
      } else {
        onLogin();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {modoCadastro ? 'Criar Conta' : 'Login'}
        </h2>

        {erro && <p className="text-red-600 mb-3 text-sm text-center">{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={autenticar}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {modoCadastro ? 'Registrar' : 'Entrar'}
        </button>

        <p className="text-sm text-center mt-4">
          {modoCadastro ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button
            onClick={() => setModoCadastro(!modoCadastro)}
            className="text-blue-600 hover:underline"
          >
            {modoCadastro ? 'Fazer login' : 'Registrar'}
          </button>
        </p>
      </div>
    </div>
  );
}

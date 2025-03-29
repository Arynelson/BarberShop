// App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import {Agenda} from "./pages/Agenda";
import Clientes from "./pages/Clientes";
import {Servicos} from "./pages/Servicos";
import Profissionais from "./pages/Profissionais";
import Login from "./components/Login";
import { NavBar } from "./components/NavBar";
import { Caixa } from "./pages/Caixa";
import { Relatorios } from "./pages/Relatorios";
import Home from "./pages/Home";

function App() {
  const [logado, setLogado] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        setLogado(true);
        setUserId(session.user.id);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLogado(true);
        setUserId(session.user.id);
      } else {
        setLogado(false);
        setUserId(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!logado || !userId) {
    return <Login onLogin={() => setLogado(true)} />;
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home userId={userId} />} />
        <Route path="/agenda" element={<Agenda userId={userId} />} />
        <Route path="/clientes" element={<Clientes userId={userId} />} />
        <Route path="/servicos" element={<Servicos userId={userId} />} />
        <Route path="/profissionais" element={<Profissionais userId={userId} />} />
        <Route path="/caixa" element={<Caixa userId={userId} />} />
        <Route path="/relatorios" element={<Relatorios userId={userId} />} />
        <Route path="*" element={<Home userId={userId} />} />
      </Routes>
    </Router>
  );
}

export default App;

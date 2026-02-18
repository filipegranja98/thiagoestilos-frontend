import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../img/thiagoestilos.jpeg";

export default function Cancelar() {
  const [token, setToken] = useState("");
  const [agendamento, setAgendamento] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(null);

  const navigate = useNavigate();

  // Definição da URL base para evitar erros de digitação
  const API_BASE_URL = "https://thiagoestilos-backend.onrender.com";

  async function buscarAgendamento() {
    setErro("");
    setMensagem("");
    setAgendamento(null);
    setWhatsappLink(null);

    if (!token) {
      setErro("Informe o token do agendamento.");
      return;
    }

    try {
      setLoading(true);

      // CORREÇÃO: Usando a URL do Render em vez de 127.0.0.1
      const response = await fetch(
        `${API_BASE_URL}/api/agendamentos/${token}/`
      );

      if (!response.ok) {
        throw new Error("Agendamento não encontrado.");
      }

      const data = await response.json();
      setAgendamento(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelarAgendamento() {
    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmar) return;

    try {
      setLoading(true);

      // CORREÇÃO: Adicionado o método DELETE explicitamente
      const response = await fetch(
        `${API_BASE_URL}/api/agendamentos/${token}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar.");
      }

      setMensagem("Agendamento cancelado com sucesso.");
      setWhatsappLink(data.whatsapp_url || null);
      setAgendamento(null);
      setToken("");

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-[450px]">

        {/* HEADER */}
        <header className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-600/20 blur-2xl rounded-full" />
            <img
              src={logoImg}
              alt="Logo Thiago Estilos"
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-yellow-600 object-cover shadow-2xl"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-yellow-500">
            Cancelar Agendamento
          </h1>
          <p className="text-zinc-400 text-sm mt-1 italic">
            Utilize seu token para cancelar seu horário.
          </p>
        </header>

        {/* CARD */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">

          <input
            type="text"
            placeholder="Digite o token do agendamento"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-600 transition-all"
          />

          <button
            onClick={buscarAgendamento}
            disabled={loading}
            className="w-full mt-4 py-3 bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold uppercase rounded-xl transition-all active:scale-95"
          >
            {loading ? "Buscando..." : "Buscar Agendamento"}
          </button>

          {erro && (
            <p className="text-red-500 text-center mt-4 text-sm">{erro}</p>
          )}

          {mensagem && (
            <div className="mt-4 text-center">
              <p className="text-green-500 text-sm">{mensagem}</p>

              {whatsappLink && (
                <button
                  onClick={() => window.open(whatsappLink, "_blank")}
                  className="w-full mt-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase rounded-xl transition-all"
                >
                  Avisar Barbeiro no WhatsApp
                </button>
              )}
            </div>
          )}

          {agendamento && (
            <div className="mt-6 border-t border-zinc-800 pt-6 space-y-2">
              <p>
                <span className="text-zinc-400">Nome:</span>{" "}
                <span className="font-semibold">{agendamento.nome}</span>
              </p>
              <p>
                <span className="text-zinc-400">Serviço:</span>{" "}
                <span className="font-semibold">{agendamento.servico}</span>
              </p>
              <p>
                <span className="text-zinc-400">Data:</span>{" "}
                <span className="font-semibold">{agendamento.data}</span>
              </p>
              <p>
                <span className="text-zinc-400">Horário:</span>{" "}
                <span className="font-semibold">{agendamento.horario}</span>
              </p>

              <button
                onClick={cancelarAgendamento}
                disabled={loading}
                className="w-full mt-6 py-3 border-2 border-red-600 text-red-600 font-bold uppercase rounded-xl hover:bg-red-600/10 transition-all"
              >
                {loading ? "Cancelando..." : "Cancelar Agendamento"}
              </button>
            </div>
          )}
        </div>

        {/* VOLTAR */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 text-zinc-400 hover:text-yellow-500 transition-all text-sm"
        >
          ← Voltar para início
        </button>
      </div>
    </div>
  );
}
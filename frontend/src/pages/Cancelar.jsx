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

  // Puxa a URL do .env ou usa a do Render como padrão
  const API_BASE_URL = import.meta.env.VITE_API_URL;

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

      // Busca os detalhes do agendamento para mostrar na tela antes de cancelar
      const response = await fetch(
        `${API_BASE_URL}/api/agendamentos/${token}/`
      );

      if (!response.ok) {
        throw new Error("Agendamento não encontrado ou token inválido.");
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
      "Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
    );

    if (!confirmar) return;

    try {
      setLoading(true);

      // Chamada DELETE para o endpoint correto
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
        throw new Error(data.error || "Erro ao processar o cancelamento.");
      }

      setMensagem("Agendamento cancelado com sucesso!");
      setWhatsappLink(data.whatsapp_url || null);
      setAgendamento(null);
      setToken(""); // Limpa o campo de token após sucesso

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
            Cancelar Horário
          </h1>
          <p className="text-zinc-400 text-sm mt-1 italic">
            Insira o token recebido no momento do agendamento.
          </p>
        </header>

        {/* CARD PRINCIPAL */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ex: 123e4567-e89b-12d3..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-600 transition-all font-mono text-sm"
            />

            <button
              onClick={buscarAgendamento}
              disabled={loading}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold uppercase rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar Token"}
            </button>
          </div>

          {/* MENSAGENS DE ERRO E SUCESSO */}
          {erro && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                <p className="text-red-500 text-center text-sm">{erro}</p>
            </div>
          )}

          {mensagem && (
            <div className="mt-4 text-center space-y-4">
              <div className="p-3 bg-green-900/20 border border-green-900/50 rounded-lg">
                <p className="text-green-500 text-sm font-medium">{mensagem}</p>
              </div>

              {whatsappLink && (
                <button
                  onClick={() => window.open(whatsappLink, "_blank")}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Avisar no WhatsApp</span>
                </button>
              )}
            </div>
          )}

          {/* DETALHES DO AGENDAMENTO ENCONTRADO */}
          {agendamento && (
            <div className="mt-6 border-t border-zinc-800 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-yellow-500 text-xs font-bold uppercase mb-4 tracking-tighter">Detalhes da Reserva</h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-zinc-400">Cliente:</span>
                  <span className="font-semibold text-zinc-200">{agendamento.nome}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">Serviço:</span>
                  <span className="font-semibold text-zinc-200">{agendamento.servico}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">Data:</span>
                  <span className="font-semibold text-zinc-200">{agendamento.data}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-400">Horário:</span>
                  <span className="font-semibold text-zinc-200">{agendamento.horario}</span>
                </p>
              </div>

              <button
                onClick={cancelarAgendamento}
                disabled={loading}
                className="w-full mt-8 py-3 border-2 border-red-600 text-red-600 font-bold uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all"
              >
                {loading ? "Processando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          )}
        </div>

        {/* BOTÃO VOLTAR */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-8 text-zinc-500 hover:text-yellow-500 transition-all text-sm flex items-center justify-center gap-2"
        >
          ← Voltar ao Início
        </button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  listarServicos,
  listarHorarios,
  reagendarAgendamento,
  detalheAgendamento
} from "../api/api";
import logoImg from "../img/thiagoestilos.jpeg";
import { useNavigate } from "react-router-dom";



export default function Reagendar() {
  const [servicos, setServicos] = useState([]);
  const [token, setToken] = useState("");
  const [agendamento, setAgendamento] = useState(null);

  const [servicoId, setServicoId] = useState("");
  const [precoSelecionado, setPrecoSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    async function carregar() {
      const data = await listarServicos();
      setServicos(data.servicos || []);
    }
    carregar();
  }, []);

  async function buscarAgendamento() {
    const resposta = await detalheAgendamento(token);

    if (resposta.error) {
      setMensagem("❌ Token inválido.");
      return;
    }

    setAgendamento(resposta);

    const servico = servicos.find(s => s.nome === resposta.servico);
    if (servico) {
      setServicoId(servico.id);
      setPrecoSelecionado(servico.preco);
    }

    setData(resposta.data);
    setHorario(resposta.horario);
    setMensagem("");
  }

  useEffect(() => {
    if (data && servicoId) {
      async function carregarHorarios() {
        const resposta = await listarHorarios(data, servicoId);
        setHorarios(resposta.horarios_disponiveis || []);
      }
      carregarHorarios();
    } else {
      setHorarios([]);
    }
  }, [data, servicoId]);

 async function handleReagendar(e) {
  e.preventDefault();

  const resposta = await reagendarAgendamento(token, {
    nome: agendamento.cliente?.nome || "",
    telefone: agendamento.cliente?.telefone || "",
    servico_id: servicoId,
    data,
    horario
  });

  if (resposta.success) {
    setMensagem(
      "Reagendamento realizado.\nConfirme no WhatsApp com o barbeiro."
    );

    if (resposta.whatsapp_url) {
      setTimeout(() => {
        window.open(resposta.whatsapp_url, "_blank");
      }, 800);
    }
  } else {
    setMensagem(resposta.error || "Erro ao reagendar.");
  }
}


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5 py-10 bg-black bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${logoImg})`
      }}
    >
      <div className="w-full max-w-md bg-[#1a1a1a]/95 p-8 rounded-2xl border-2 border-yellow-600 shadow-2xl text-center">

        <img
          src={logoImg}
          alt="Logo Thiago Estilos"
          className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-yellow-600 object-cover"
        />

        <h1 className="text-yellow-600 text-2xl mb-6 uppercase tracking-widest">
          Reagendar Horário
        </h1>

        {!agendamento && (
          <>
            <label className="block text-xs text-yellow-200 mb-2 uppercase font-bold">
              Informe seu Token
            </label>

            <input
              className="w-full bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Cole aqui seu token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <button
              onClick={buscarAgendamento}
              className="w-full bg-yellow-600 text-black py-4 rounded-md font-extrabold uppercase shadow-lg hover:bg-yellow-500 transition"
            >
              Buscar Agendamento
            </button>
          </>
        )}

        {agendamento && (
          <form onSubmit={handleReagendar} className="flex flex-col gap-4">

            <label className="text-xs text-yellow-200 uppercase font-bold">
              Selecione o Serviço
            </label>

            <select
              className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
              value={servicoId}
              onChange={(e) => {
                const id = e.target.value;
                setServicoId(id);
                const servico = servicos.find((s) => s.id === Number(id));
                setPrecoSelecionado(servico ? servico.preco : null);
              }}
            >
              <option value="">Escolha o serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} ({s.duracao} min)
                </option>
              ))}
            </select>

            {precoSelecionado !== null && (
              <div className="bg-yellow-600/20 p-3 rounded-md text-yellow-500 font-bold text-xl border border-dashed border-yellow-600">
                Total: R$ {Number(precoSelecionado).toFixed(2)}
              </div>
            )}

            <label className="text-xs text-yellow-200 uppercase font-bold">
              Nova Data
            </label>

            <input
              type="date"
              className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <label className="text-xs text-yellow-200 uppercase font-bold">
              Novo Horário
            </label>

            <select
              className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            >
              <option value="">Escolha um horário</option>
              {horarios.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-yellow-600 text-black py-4 rounded-md font-extrabold uppercase shadow-lg hover:bg-yellow-500 transition mt-2"
            >
              Confirmar Reagendamento
            </button>
          </form>
        )}

        {mensagem && (
          <div className="mt-6 bg-green-900 text-green-200 p-4 rounded-md text-sm border border-green-700 whitespace-pre-wrap">
            {mensagem}
          </div>
        )}
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

import { useEffect, useState } from "react";
import { listarServicos, listarHorarios, criarAgendamento } from "../api/api";
import logoImg from "../img/thiagoestilos.jpeg";
import { useNavigate } from "react-router-dom";
export default function Agendar() {
  const [servicos, setServicos] = useState([]);
  const [servicoId, setServicoId] = useState("");
  const [precoSelecionado, setPrecoSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horario, setHorario] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [erroNome, setErroNome] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [whatsappLink, setWhatsappLink] = useState(null);
const navigate = useNavigate();
  /* =========================
     VALIDAÇÕES
  ========================= */

  function validarNome(valor) {
    const partes = valor.trim().split(" ");
    return partes.length >= 2 && partes.every(p => p.length >= 2);
  }

  function validarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");
    return /^[1-9]{2}9\d{8}$/.test(numeros);
  }

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length < 11) return numeros;

    return numeros.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      "($1) $2-$3"
    );
  }

  /* ========================= */

  useEffect(() => {
    async function carregar() {
      const data = await listarServicos();
      setServicos(data.servicos || []);
    }
    carregar();
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();

    let valido = true;

    if (!validarNome(nome)) {
      setErroNome("Informe seu nome completo.");
      valido = false;
    } else {
      setErroNome("");
    }

    if (!validarTelefone(telefone)) {
      setErroTelefone("Informe um WhatsApp válido com DDD.");
      valido = false;
    } else {
      setErroTelefone("");
    }

    if (!valido) return;

    const payload = {
      nome,
      telefone: telefone.replace(/\D/g, ""),
      servico_id: servicoId,
      data,
      horario,
    };

    const resposta = await criarAgendamento(payload);

    if (resposta.whatsapp_url) {
      setMensagem(
        `✅ Agendamento confirmado!\n\nGuarde seu token:\n${resposta.token}`
      );
      setWhatsappLink(resposta.whatsapp_url);

      setNome("");
      setTelefone("");
      setServicoId("");
      setPrecoSelecionado(null);
      setData("");
      setHorario("");
    } else {
      setMensagem(resposta.error || "Erro ao agendar.");
      setWhatsappLink(null);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5 py-10 bg-black bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.8), rgba(0,0,0,.8)), url(${logoImg})`,
      }}
    >
      <div className="w-full max-w-md bg-[#1a1a1a]/95 p-8 rounded-2xl border-2 border-yellow-600 shadow-2xl text-center">

        <img
          src={logoImg}
          alt="Logo Thiago Estilos"
          className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-yellow-600 object-cover"
        />

        <h1 className="text-yellow-600 text-2xl mb-6 uppercase tracking-widest">
          Agendar Horário
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NOME */}
          <label className="text-xs text-left text-yellow-200 uppercase font-bold">
            Nome Completo
          </label>
          <input
            className={`bg-[#2b2b2b] border ${erroNome ? "border-red-500" : "border-gray-600"} rounded-md p-3 text-white`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {erroNome && <p className="text-red-400 text-xs text-left">{erroNome}</p>}

          {/* TELEFONE */}
          <label className="text-xs text-left text-yellow-200 uppercase font-bold">
            Telefone / WhatsApp
          </label>
          <input
            className={`bg-[#2b2b2b] border ${erroTelefone ? "border-red-500" : "border-gray-600"} rounded-md p-3 text-white`}
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            placeholder="(11) 99999-9999"
            required
          />
          {erroTelefone && <p className="text-red-400 text-xs text-left">{erroTelefone}</p>}

          {/* SERVIÇO */}
          <label className="text-xs text-left text-yellow-200 uppercase font-bold">
            Selecione o Serviço
          </label>
          <select
            className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white"
            value={servicoId}
            onChange={(e) => {
              const id = e.target.value;
              setServicoId(id);
              const servico = servicos.find(s => s.id === Number(id));
              setPrecoSelecionado(servico ? servico.preco : null);
            }}
            required
          >
            <option value="">O que vamos fazer hoje?</option>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome} ({s.duracao} min)
              </option>
            ))}
          </select>

          {precoSelecionado !== null && (
            <div className="bg-yellow-600/20 p-3 rounded-md text-yellow-500 font-bold">
              Total: R$ {Number(precoSelecionado).toFixed(2)}
            </div>
          )}

          {/* DATA */}
          <label className="text-xs text-left text-yellow-200 uppercase font-bold">
            Data
          </label>
          <input
            type="date"
            className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          {/* HORÁRIO */}
          <label className="text-xs text-left text-yellow-200 uppercase font-bold">
            Horário
          </label>
          <select
            className="bg-[#2b2b2b] border border-gray-600 rounded-md p-3 text-white"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
          >
            <option value="">Escolha um horário</option>
            {horarios.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 text-black py-4 rounded-md font-extrabold uppercase hover:bg-yellow-500 transition"
          >
            Confirmar Reserva
          </button>
        </form>

        {mensagem && (
          <div className="mt-6 bg-green-900 text-green-200 p-4 rounded-md text-sm whitespace-pre-wrap">
            {mensagem}
            {whatsappLink && (
              <button
                onClick={() => window.open(whatsappLink, "_blank")}
                className="mt-4 w-full bg-green-500 text-white py-3 rounded-md font-extrabold uppercase"
              >
                Enviar confirmação pelo WhatsApp
              </button>
            )}
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

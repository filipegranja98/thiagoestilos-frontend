const BASE_URL = import.meta.env.VITE_API_URL;

export default BASE_URL;
const API_BASE = `${BASE_URL}/api`;

export async function listarServicos() {
  const response = await fetch(`${API_BASE}/servicos/`);
  return response.json();
}

export async function listarHorarios(data, servicoId) {
  const response = await fetch(
    `${API_BASE}/agendamentos/disponiveis/?data=${data}&servico_id=${servicoId}`
  );
  return response.json();
}

export async function criarAgendamento(payload) {
  const response = await fetch(`${API_BASE}/agendamentos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}


export async function detalheAgendamento(token) {
  const res = await fetch(`${API_BASE}/agendamentos/${token}/`);
  return res.json();
}

export async function reagendarAgendamento(token, payload) {
  const res = await fetch(
    `${API_BASE}/agendamentos/${token}/reagendar/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  return res.json();
}
export async function cancelarAgendamento(token) {
  const response = await fetch(
    `/api/agendamentos/${token}/cancelar/`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarServicos } from "../api/api";
import Carousel from "../components/carrosel";

import logoImg from "../img/thiagoestilos.jpeg";
import corte1 from "../img/cortes/corte1.jpeg";
import corte2 from "../img/cortes/corte2.jpeg";
import corte3 from "../img/cortes/corte3.jpeg";
import corte4 from "../img/cortes/corte4.jpeg";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const navigate = useNavigate();
  const imagensCortes = [corte1, corte2, corte3, corte4];

  useEffect(() => {
    async function carregarServicos() {
      try {
        const data = await listarServicos();
        setServicos(data.servicos || []);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    }
    carregarServicos();
  }, []);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
      
      <div className="max-w-[450px] md:max-w-4xl mx-auto min-h-screen flex flex-col px-4 py-8">
       
        <header className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-600/20 blur-2xl rounded-full" />
            
            <img
              src={logoImg}
              alt="Logo Thiago Estilos"
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-yellow-600 object-cover shadow-2xl"
            />
          </div>

          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-yellow-500">
            Thiago Estilos
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-1 italic">
            Estilo, precisão e qualidade no seu corte.
          </p>
        </header>

        <section className="w-full rounded-2xl overflow-hidden shadow-lg h-auto mb-5 md:h-80">
          <Carousel images={imagensCortes} />
        </section>

        <section className="flex-1 mb-12">
          <div className="flex justify-center gap-3 mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest text-yellow-500">
              Serviços
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicos.length === 0 ? (
              <p className="text-zinc-600 text-center py-10 italic">
                Buscando serviços...
              </p>
            ) : (
              servicos.map((s) => (
                <div 
                  key={s.id} 
                  className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center hover:border-yellow-600/50 transition-all"
                >
                  <div>
                    <h3 className="text-zinc-100 font-bold">{s.nome}</h3>
                    <p className="text-zinc-500 text-xs">{s.duracao} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-black text-lg">
                      R$ {Number(s.preco).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Botões */}
        <div className="w-full bg-zinc-950/80 backdrop-blur-md md:relative md:bg-transparent md:p-0 md:mt-auto">
          <div className="max-w-[450px] md:max-w-none mx-auto flex flex-col md:flex-row gap-3">
            
            <button
              onClick={() => navigate("/agendar")}
              className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-black uppercase rounded-xl transition-all shadow-xl active:scale-95"
            >
              Agendar Horário
            </button>
    
            <button
              onClick={() => navigate("/reagendar")}
              className="w-full py-4 border-2 border-yellow-600 text-yellow-600 font-bold uppercase rounded-xl hover:bg-yellow-600/10 transition-all"
            >
              Reagendar
            </button>

            {/* NOVO BOTÃO */}
            <button
              onClick={() => navigate("/cancelar")}
              className="w-full py-4 border-2 border-red-600 text-red-600 font-bold uppercase rounded-xl hover:bg-red-600/10 transition-all"
            >
              Cancelar Agendamento
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react'; // Importe o 'React'
import { Mail, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { FeiranteItf } from '@/utils/types/FeiranteItf';
import { MercadoriaItf } from '@/utils/types/MercadoriaItf';
import { CardMercadoria } from '@/componentes/CardMercadorias';
import { toast } from 'sonner';

export default function PaginaFeirante({ params }: { params: Promise<{ id: string }> }) {

  // AQUI ESTÁ A CORREÇÃO:
  // Usamos React.use() para "desembrulhar" a Promise dos params.
  const resolvedParams = React.use(params);

  const [feirante, setFeirante] = useState<FeiranteItf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mercadorias, setMercadoria] = useState<MercadoriaItf[]>([])

  useEffect(() => {
  async function buscaDadosDoFeirante() {
    if (!resolvedParams.id) {
      setError("ID do feirante não fornecido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar dados do feirante
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/feirantes/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Feirante não encontrado ou falha na rede.');
      const dados = await response.json();
      const feiranteData = dados.feirante || dados;
      setFeirante(feiranteData);

      // Buscar mercadorias do feirante
      const responseMercadorias = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/feirantes/${resolvedParams.id}`);
      if (!responseMercadorias.ok) throw new Error('Erro ao buscar mercadorias.');
      const dadosMercadorias = await responseMercadorias.json();
      setMercadoria(dadosMercadorias);

    } catch (error) {
      const errorMessage = error instanceof Error
          ? error.message
          : "Não foi possível buscar dados";
      
          toast.error(errorMessage);
          console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  }

  buscaDadosDoFeirante();
}, [resolvedParams.id]);



  // --- RENDERIZAÇÃO CONDICIONAL (sem alterações) ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="ml-4 text-lg text-gray-700">Carregando dados do feirante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Ocorreu um Erro</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!feirante) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Feirante não encontrado.</p>
      </div>
    )
  }

  

  // const listaMercadorias = mercadorias.slice(0, 10).map(mercadoria => ( // Mostra apenas 4 para combinar com o design
  //   <CardMercadoria data={mercadoria} key={mercadoria.id} />
  // ))
  const listaMercadorias = mercadorias.slice(0, 10).map(mercadoria => (
  <CardMercadoria
    key={mercadoria.id}
    data={mercadoria}
    feiranteId={feirante.id} // <-- AQUI ESTÁ A NOVA PROP
  />
  
));

  // --- SUCESSO: Renderização da Página (sem alterações) ---
  return (
    <div className="bg-[#f8f9fa]">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-6 mb-10">
          <Image
            src="/feirante.png"
            alt={`Foto de ${feirante.nome}`}
            width={80}
            height={80}
            className="rounded-full bg-gray-200 object-cover"
          />
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900">{feirante.nome}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <Mail size={16} />
                <span>{feirante.email}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1 sm:mt-0">
                <Phone size={16} />
                <span>{feirante.telefone}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center space-x-2">
            <CheckCircle size={18} />
            <span>Feirante Verificado</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Produtos do Feirante</h2>
        {/* Seção de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {listaMercadorias.length > 0 ? listaMercadorias : <p>Carregando produtos...</p>}
        </div>

      </main>
    </div >
  );
}
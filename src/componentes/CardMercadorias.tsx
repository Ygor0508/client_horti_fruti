// src/componentes/CardMercadorias.tsx

import { MercadoriaItf } from "../utils/types/MercadoriaItf";
import Link from "next/link";
import { useState } from "react";
import { useClienteStore } from "@/context/ClienteContext";
import { toast } from "sonner";
import Image from "next/image";

// A interface continua com 'feiranteId' opcional para manter a flexibilidade
interface CardMercadoriaProps {
  data: MercadoriaItf;
  feiranteId?: number; 
}

export function CardMercadoria({ data, feiranteId }: CardMercadoriaProps) {
  const [quantidade, setQuantidade] = useState(1);
  const { cliente } = useClienteStore();

  // Lógica para determinar qual ID usar para o link.
  // Prioriza a prop 'feiranteId'. Se não existir, tenta usar o ID aninhado em 'data'.
  // O 'data.feirante?.id' usa optional chaining para evitar erros se 'data.feirante' não existir.
  const idDoFeiranteParaLink = feiranteId || data.feirante?.id;

  const adicionaPedido = async () => {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: quantidade,
          mercadoria_id: data.id,
          usuario_id: cliente.id,
        }),
      });

      if (response.status === 201) {
        toast.success(`${quantidade} ${data.nome} adicionado(s) ao carrinho!`);
      } else {
        toast.error("Erro ao adicionar ao carrinho.");
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor.");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition hover:shadow-lg flex flex-col">
      <div className="w-full h-45 bg-gray-100 overflow-hidden flex-shrink-0">
        <Image
          src={data.foto}
          alt={data.nome}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold text-gray-800 mb-1">{data.nome}</h5>
        <p className="text-sm text-gray-600 mb-3">
          Doces e crocantes, direto do pomar
        </p>

        <div className="flex items-center justify-between mt-auto mb-4">
          <p className="text-2xl font-bold text-green-600">
            R$ {Number(data.preco).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}/kg
          </p>
          
          {/* Lógica oposta: O link agora é exibido se um ID for encontrado, seja da prop ou do objeto data */}
          {idDoFeiranteParaLink && (
            <Link
              href={`/feirante/${idDoFeiranteParaLink}`}
              className="flex items-center text-orange-500 font-medium hover:underline"
            >
              <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
              Ver Feirante
            </Link>
          )}
        </div>

        {/* ... resto do seu componente (contador, botão, etc.) ... */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
            <button
              onClick={() => setQuantidade(prev => Math.max(1, prev - 1))}
              className="text-gray-600 hover:text-gray-800"
            >
              -
            </button>
            <span className="mx-3 text-lg font-semibold">{quantidade}</span>
            <button
              onClick={() => setQuantidade(prev => prev + 1)}
              className="text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          </div>
          <button
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={adicionaPedido}
          >
            <span className="mr-2">
              {/* ... seu ícone SVG ... */}
            </span>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

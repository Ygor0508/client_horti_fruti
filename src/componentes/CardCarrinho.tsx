// components/CardMercadoria.tsx (ou o caminho do seu componente)
import { MercadoriaItf } from "../utils/types/MercadoriaItf";
import Link from "next/link";
import { useState } from "react";
import { useClienteStore } from "@/context/ClienteContext"; // Importe o hook do contexto
import { toast } from "sonner"

export function CardMercadoria({ data }: { data: MercadoriaItf }) {
  const [quantity, setQuantity] = useState(1);
  const { cliente } = useClienteStore(); // Obtenha o estado do cliente do contexto

  const handleAddToCart = () => {
    if (!cliente.id) { // Verifica se o cliente não está logado (sem ID)
      toast.error("Você precisa estar logado para adicionar itens ao carrinho!");
      window.location.href = "/login"
      return; // Interrompe a função se o cliente não estiver logado
    }
    // Lógica para adicionar ao carrinho (só executa se o cliente estiver logado)
    console.log(`Adicionado ${quantity} de ${data.nome} ao carrinho.`);
    toast.success(`${quantity} ${data.nome} adicionado(s) ao carrinho!`);
    // Aqui você pode adicionar sua lógica real de adição ao carrinho
  };

  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition hover:shadow-lg flex flex-col">
      {/* Imagem */}
      <div className="w-full h-45 bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={data.foto}
          alt={data.nome}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold text-gray-800 mb-1">
          {data.nome}
        </h5>

        <p className="text-sm text-gray-600 mb-3">
          Doces e crocantes, direto do pomar
        </p>

        {/* Preço e Botão Ver Feirante */}
        <div className="flex items-center justify-between mt-auto mb-4">
          <p className="text-2xl font-bold text-green-600">
            R$ {Number(data.preco).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}/kg
          </p>
          <Link
            href={`/feirante/${data.feirante.id}`}
            className="flex items-center text-orange-500 font-medium hover:underline"
          >
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            Ver Feirante
          </Link>
        </div>

        {/* Contador de Quantidade e Botão Adicionar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="text-gray-600 hover:text-gray-800"
            >
              -
            </button>
            <span className="mx-3 text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          </div>
          <button
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={handleAddToCart} // Chama a nova função `handleAddToCart`
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.5 14 6.704 14h6.592c2.204 0 2.964-2.154 1.493-3.66l-.893-.892 1.358-5.43a.997.997 0 00.01-.042L17.78 3H19a1 1 0 100-2H3z" />
              </svg>
            </span>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
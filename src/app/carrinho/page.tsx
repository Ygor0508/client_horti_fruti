'use client';

import { useState, useEffect } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importe o useRouter para redirecionar
import { Minus, Plus, Trash2, Check, Truck, Loader2 } from 'lucide-react';
import { useClienteStore } from "@/context/ClienteContext";
import { toast } from 'sonner';

interface CartItem {
  id: number;
  quantidade: number;
  mercadoria: {
    id: number;
    nome: string;
    descricao: string;
    foto: string;
    preco: string;
    unidade: 'kg' | 'un';
  };
}

export default function CartPage() {
  const { cliente } = useClienteStore();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isFinalizando, setIsFinalizando] = useState(false); // Estado de loading



  useEffect(() => {
    const buscaDados = async () => {
      if (!cliente?.id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${cliente.id}`);
        if (!response.ok) throw new Error("Erro ao buscar carrinho");
        const data = await response.json();
        setCartItems(data);
        setSelectedItems(data.map((item: CartItem) => item.id));
      } catch (error) {
        console.error("Erro ao buscar dados do carrinho:", error);
        toast.error("Não foi possível carregar seu carrinho.");
      }
    };

    if (cliente?.id) buscaDados();
  }, [cliente?.id]);

  // ... (suas outras funções como handleQuantityChange, handleDeleteItem, etc. não mudam)
  const handleQuantityChange = async (itemId: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar quantidade");
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === itemId ? { ...item, quantidade: novaQuantidade } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      toast.error("Não foi possível atualizar o item.");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Erro ao deletar item");
      setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
      toast.success("Item removido do carrinho!");
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      toast.error("Não foi possível remover o item.");
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(current =>
      current.includes(id)
        ? current.filter(itemId => itemId !== id)
        : [...current, id]
    );
  };

  // --- LÓGICA CORRIGIDA PARA FINALIZAR O PEDIDO ---
  const handleFinalizarPedido = async () => {
    const itensSelecionadosParaPedido = cartItems.filter(item => selectedItems.includes(item.id));

    if (itensSelecionadosParaPedido.length === 0) {
      toast.error("Selecione pelo menos um item para finalizar o pedido.");
      return;
    }

    if (!cliente?.id) {
      toast.error("Erro: Usuário não identificado.");
      return;
    }

    setIsFinalizando(true);

    try {
      // 1. Chamando a rota CORRETA: /pedido/finalizar
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Enviando o corpo da requisição no formato esperado pelo 'finalizarPedidoSchema'
        body: JSON.stringify({
          usuario_id: cliente.id,
          itens: itensSelecionadosParaPedido,
        }),
      });

      if (!response.ok) {
        // Tenta ler a mensagem de erro específica do backend
        const errorData = await response.json();
        throw new Error(errorData.erro || "Falha ao finalizar o pedido. Tente novamente.");
      }

      toast.success("Pedido realizado com sucesso!");

      // Redireciona o usuário para a página de "Meus Pedidos" após o sucesso
      router.push('/meus-pedidos');

    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Não foi possível finalizar o pedido.";

      toast.error(errorMessage);
      console.error("Erro ao finalizar pedido:", error);
    } finally {
      setIsFinalizando(false);
    }
  };

  const itemsToCalculate = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = itemsToCalculate.reduce((acc, item) => acc + Number(item.mercadoria.preco) * item.quantidade, 0);
  const taxaEntrega = 0;
  const total = subtotal + taxaEntrega;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">Seu Carrinho de Compras</h1>
        <p className="text-gray-500 mt-1 mb-8">Confira seus produtos e finalize seu pedido</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Produtos no Carrinho</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg">
                  {/* ... (o JSX de cada item do carrinho não muda) ... */}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    </label>
                    <img src={item.mercadoria.foto} alt={item.mercadoria.nome} width={60} height={60} className="rounded-md bg-orange-100 p-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.mercadoria.nome}</h3>
                      <p className="text-sm text-gray-500">{item.mercadoria.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 border rounded-md p-1">
                      <button onClick={() => handleQuantityChange(item.id, item.quantidade - 1)} className="text-gray-500 hover:text-black"><Minus size={16} /></button>
                      <span className="font-bold w-10 text-center">{item.quantidade}{item.mercadoria.unidade}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantidade + 1)} className="text-gray-500 hover:text-black"><Plus size={16} /></button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">R$ {Number(item.mercadoria.preco).toFixed(2)}/{item.mercadoria.unidade}</p>
                      <p className="font-bold text-lg">R$ {(Number(item.mercadoria.preco) * item.quantidade).toFixed(2)}</p>
                    </div>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-xl font-semibold mb-4 border-b pb-3">Resumo do Pedido</h2>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-gray-600"><span>Itens selecionados</span><span className="font-medium text-gray-800">{itemsToCalculate.length} produtos</span></div>
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium text-gray-800">R$ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Taxa de entrega</span><span className="font-medium text-green-600">Grátis</span></div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-xl"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
              </div>
              <button onClick={handleFinalizarPedido} disabled={isFinalizando || itemsToCalculate.length === 0} className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isFinalizando ? (<><Loader2 size={20} className="animate-spin" />Processando...</>) : (<><Check size={20} /> Finalizar Pedido</>)}
              </button>
              <Link href="/" className="block text-center mt-4 text-gray-600 hover:underline">Continuar Comprando</Link>
              {subtotal >= 20 && (
                <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-3">
                  <Truck size={24} />
                  <div>
                    <h4 className="font-semibold">Entrega Grátis</h4>
                    <p className="text-sm">Para pedidos acima de R$ 20,00 na sua região</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

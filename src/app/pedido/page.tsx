'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Check, Truck } from 'lucide-react';
import { useClienteStore } from "@/context/ClienteContext";

interface CartItem {
  id: number;
  nome: string;
  descricao: string;
  foto: string;
  preco: number;
  unidade: 'kg' | 'un';
  quantidade: number;
}

export default function CartPage() {
  const { cliente } = useClienteStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);



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
      }
    };

    buscaDados();
  }, [cliente?.id]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantidade + delta;
          return { ...item, quantidade: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(current =>
      current.includes(id)
        ? current.filter(itemId => itemId !== id)
        : [...current, id]
    );
  };

  const itemsToCalculate = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = itemsToCalculate.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const taxaEntrega = 0;
  const total = subtotal + taxaEntrega;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">Seu Carrinho de Compras</h1>
        <p className="text-gray-500 mt-1 mb-8">Confira seus produtos e finalize seu pedido</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Produtos Selecionados</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </label>
                    <Image src={item.foto} alt={item.nome} width={60} height={60} className="rounded-md bg-orange-100 p-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.nome}</h3>
                      <p className="text-sm text-gray-500">{item.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 border rounded-md p-1">
                      <button onClick={() => handleQuantityChange(item.id, -1)} className="text-gray-500 hover:text-black">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold w-10 text-center">{item.quantidade}{item.unidade}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)} className="text-gray-500 hover:text-black">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">R$ {item.preco.toFixed(2)}/{item.unidade}</p>
                      <p className="font-bold text-lg">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2">
                <Trash2 size={18} /> Editar Carrinho
              </button>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-xl font-semibold mb-4 border-b pb-3">Resumo do Pedido</h2>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Itens selecionados</span>
                  <span className="font-medium text-gray-800">{itemsToCalculate.length} produtos</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                <Check size={20} /> Finalizar Pedido
              </button>
              <Link href="/" className="block text-center mt-4 text-gray-600 hover:underline">
                Continuar Comprando
              </Link>
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

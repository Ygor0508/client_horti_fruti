'use client';

import { useState, useEffect } from 'react';
import { useClienteStore } from "@/context/ClienteContext";
import { toast } from 'sonner';
import {
  Filter, Plus, ShoppingBag, CheckCircle, Clock, XCircle, Eye, Loader2, Truck, RotateCw
} from 'lucide-react';
// import Image from 'next/image';
import { PedidoItf, Status } from '@/utils/types/PedidoItf';

// Componente StatusBadge atualizado para usar o enum Status
const StatusBadge = ({ status }: { status: Status }) => {
  const statusConfig = {
    [Status.FINALIZADO]: { text: 'Confirmado', icon: <CheckCircle size={14} />, color: 'text-green-700 bg-green-100' },
    [Status.PENDENTE]: { text: 'Pendente', icon: <Clock size={14} />, color: 'text-yellow-700 bg-yellow-100' },
    [Status.CANCELADO]: { text: 'Cancelado', icon: <XCircle size={14} />, color: 'text-red-700 bg-red-100' },
    [Status.ENTREGUE]: { text: 'Enviado', icon: <Truck size={14} />, color: 'text-blue-700 bg-blue-100' },
    [Status.EM_PREPARACAO]: { text: 'Em Preparação', icon: <ShoppingBag size={14} />, color: 'text-indigo-700 bg-indigo-100' },
    [Status.EM_ROTA]: { text: 'Em Rota', icon: <Truck size={14} />, color: 'text-cyan-700 bg-cyan-100' },
    [Status.RETORNANDO]: { text: 'Retornando', icon: <RotateCw size={14} />, color: 'text-orange-700 bg-orange-100' },
    [Status.EM_ANDAMENTO]: { text: 'Em Andamento', icon: <Clock size={14} />, color: 'text-gray-700 bg-gray-100' },
  };

  const config = statusConfig[status] || statusConfig[Status.PENDENTE];

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};




export default function MeusPedidosPage() {
  const { cliente } = useClienteStore();
  const [pedidos, setPedidos] = useState<PedidoItf[]>([]);
  // 1. O estado 'stats' foi removido.
  const [loading, setLoading] = useState(true);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<PedidoItf | null>(null);


  useEffect(() => {
    if (!cliente?.id) {
      setLoading(false);
      return;
    }

    const buscaPedidos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar os pedidos.");
        }
        const data: PedidoItf[] = await response.json();
        setPedidos(data);
        // 2. A lógica de 'setStats' foi removida do useEffect.
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Não foi possível carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    buscaPedidos();
  }, [cliente?.id]);

  // 3. As estatísticas agora são calculadas diretamente a partir do estado 'pedidos' a cada renderização.
  const totalPedidos = pedidos.length;
  const pedidosConfirmados = pedidos.filter(p => p.status === Status.FINALIZADO).length;
  const pedidosPendentes = pedidos.filter(p => p.status === Status.PENDENTE).length;
  const pedidosCancelados = pedidos.filter(p => p.status === Status.CANCELADO).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  async function handleDelete() {
    if (!pedidoParaExcluir) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${pedidoParaExcluir.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o pedido.');
      }

      // Remove o pedido da lista localmente para atualizar a UI
      setPedidos(pedidos.filter(p => p.id !== pedidoParaExcluir.id));
      toast.success('Pedido excluído com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível excluir o pedido.');
    } finally {
      setPedidoParaExcluir(null); // Fecha o modal
    }

    // Força reload da página
  window.location.reload();

//     {/* Modal de Confirmação para Excluir Pedido */}
// {pedidoParaExcluir && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Cancelar Pedido</h2>
//       <p className="text-gray-600 mb-6">
//         Tem certeza que deseja cancelar o pedido <strong>#{String(pedidoParaExcluir.id).padStart(3, '0')}</strong>?
//       </p>
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setPedidoParaExcluir(null)}
//           className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
//         >
//           Não
//         </button>
//         <button
//           onClick={handleDelete}
//           className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//         >
//           Sim, cancelar
//         </button>
//       </div>
//     </div>
//   </div>
// )}

  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lista de Pedidos</h1>
            <p className="text-gray-500 mt-1">Gerencie todos os seus pedidos em um só lugar</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-700 font-semibold hover:bg-gray-100">
              <Filter size={18} /> Filtrar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              <Plus size={18} /> Novo Pedido
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas - Usando as constantes calculadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg"><ShoppingBag className="text-blue-600" size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-800">{totalPedidos}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Confirmados</p>
              <p className="text-2xl font-bold text-gray-800">{pedidosConfirmados}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600" size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-gray-800">{pedidosPendentes}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg"><XCircle className="text-red-600" size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Cancelados</p>
              <p className="text-2xl font-bold text-gray-800">{pedidosCancelados}</p>
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos Recentes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h3 className="p-5 text-lg font-semibold text-gray-700">Pedidos Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Mercadoria</th>
                  <th className="px-6 py-3">Preço Unitário</th>
                  <th className="px-6 py-3">Quantidade</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length > 0 ? pedidos.map((pedido) => (
                  <tr key={pedido.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{String(pedido.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={pedido.mercadoria.foto} alt={pedido.mercadoria.nome} width={40} height={40} className="rounded-md bg-gray-200 object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800">{pedido.mercadoria.nome}</p>
                          <p className="text-xs text-gray-500">{pedido.mercadoria.nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">R$ {Number(pedido.mercadoria.preco).toFixed(2)}</td>
                    <td className="px-6 py-4">{pedido.quantidade}</td>
                    <td className="px-6 py-4 font-semibold">R$ {(Number(pedido.mercadoria.preco) * pedido.quantidade).toFixed(2)}</td>
                    <td className="px-6 py-4"><StatusBadge status={pedido.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button
                          onClick={() => {
                            setPedidoParaExcluir(pedido);
                            handleDelete();
                          }}
                          className="flex items-center gap-1 text-red-600 hover:underline"
                        >
                          <XCircle size={14} /> Cancelar
                        </button>

                        <button className="flex items-center gap-1 text-blue-600 hover:underline">
                          <Eye size={14} /> Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      Você ainda não fez nenhum pedido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm">
            <p className="text-gray-600">Mostrando 1 a {pedidos.length} de {totalPedidos} pedidos</p>
          </div>
        </div>
      </main>
    </div>
  );
}

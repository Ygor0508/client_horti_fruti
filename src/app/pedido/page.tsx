// 'use client'
// import './page.css'
// import { useEffect, useState } from "react";
// import { useClienteStore } from "@/context/ClienteContext";
// import { PedidoItf } from "@/utils/types/PedidoItf";
// import Image from "next/image"

// // import { toast } from 'sonner';

// // type Inputs = {
// //   descricao: string
// // }

// export default function Pedido() {
//   // const params = useParams()

//   const [pedido, setPedido] = useState<PedidoItf[]>([])
//   const { cliente } = useClienteStore()

//   // const { register, handleSubmit, reset } = useForm<Inputs>()

//   // useEffect(() => {
//   //   async function buscaDados() {
//   //     const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
//   //     const dados = await response.json()
//   //     setPedido(dados)
//   //   }
//   //   buscaDados()
//   // }, [])

//   useEffect(() => {
//   async function buscaDados() {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
//     const dados = await response.json()
//     setPedido(dados)
//   }
//   if (cliente.id) { // Adicione esta verificação
//     buscaDados()
//   }
// }, [cliente.id])


//   // para retornar apenas a data do campo no banco de dados
//   // 2024-10-10T22:46:27.227Z => 10/10/2024
//   function dataDMA(data: string) {
//     const ano = data.substring(0, 4)
//     const mes = data.substring(5, 7)
//     const dia = data.substring(8, 10)
//     return dia + "/" + mes + "/" + ano
//   }

//   const pedidoTable = pedido.map(pedido => (
//     <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//         <p><b>{pedido.mercadoria.nome} <br/> 
//           {pedido.mercadoria.categoria}</b></p>
//         <p className='mt-3'>
//           R$: {Number(pedido.mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
//       </th>
//       <td className="px-6 py-4">
//         {/* <Image src={pedido.mercadoria.foto} className="fotoMercadoria" alt="Foto Mercadoria" /> */}
//         <Image 
//           src={pedido.mercadoria.foto} 
//           className="fotoMercadoria" 
//           alt="Foto Mercadoria" 
//           width={80} // Exemplo de largura
//           height={80} // Exemplo de altura
//         />
//       </td>
//       <td className="px-6 py-4">
//         <p><b>{pedido.mercadoria_Id}</b></p>
//         <p><i>{pedido.mercadoria.quantidade}</i></p>
//       </td>
//       <td className="px-6 py-4">
//         {pedido.status ?
//           <>
//             <p><b>{pedido.status}</b></p>
//             <p><i>Entregue em: {dataDMA(pedido.updatedAt as string)}</i></p>
//           </>
//           :
//           <i>Aguardando...</i>}
//       </td>
//     </tr>
//   ))

//   return (
//     <section className="max-w-7xl mx-auto">
//       <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
//         Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Meus Pedidos</span></h1>

//       <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//           <tr>
//             <th scope="col" className="px-6 py-3">
//               Nome
//             </th>
//             <th scope="col" className="px-6 py-3">
//               Foto
//             </th>
//             <th scope="col" className="px-6 py-3">
//               Quantidade
//             </th>
//             <th scope="col" className="px-6 py-3">
//               Categoria
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {pedidoTable}
//         </tbody>
//       </table>
//     </section>
//   )
// }


// src/app/pedido/page.tsx

'use client'
import './page.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/ClienteContext";
import { PedidoItf, Status } from "@/utils/types/PedidoItf";
import Image from "next/image"
import { toast } from 'sonner';

export default function Pedido() {
  const [pedidos, setPedidos] = useState<PedidoItf[]>([])
  const { cliente } = useClienteStore()

  // async function buscaDados() {
  //   if (!cliente.id) return;
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
  //   const dados = await response.json()
  //   setPedidos(dados)
  // }

  // useEffect(() => {
  //   buscaDados()
  // }, [cliente.id])


  
  useEffect(() => {
    async function buscaDados() {
      if (!cliente.id) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
      const dados = await response.json()
      setPedidos(dados)
    }

    buscaDados()
  }, [cliente.id])


  async function handleDelete(pedidoId: number) {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${pedidoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Pedido cancelado com sucesso!");
        // Atualiza a lista de pedidos removendo o que foi excluído
        setPedidos(pedidos.filter(p => p.id !== pedidoId));
      } else {
        toast.error("Erro ao cancelar o pedido.");
      }
    }
  }

  const pedidoTable = pedidos.map(pedido => (
    <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 align-middle">
      <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <p><b>{pedido.mercadoria.nome}</b></p>
        <p className="text-sm text-gray-500">{pedido.mercadoria.categoria}</p>
        <p className='mt-2 font-bold'>
          R$: {Number(pedido.mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
        </p>
      </td>
      <td className="px-6 py-4">
        <Image
          src={pedido.mercadoria.foto}
          className="fotoMercadoria rounded-md"
          alt="Foto Mercadoria"
          width={80}
          height={80}
        />
      </td>
      <td className="px-6 py-4">
        {/* Mostrando a quantidade e a unidade corretas */}
        <p><b>{pedido.quantidade} {pedido.unidade_medida}</b></p>
      </td>
      <td className="px-6 py-4">
        {/* Coluna de Status */}
        <span className="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-700 dark:text-yellow-100">
          {pedido.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {/* Coluna de Ações com botão de excluir */}
        {pedido.status === Status.EM_PREPARACAO && (
          <button
            onClick={() => handleDelete(pedido.id)}
            className="font-medium text-red-600 dark:text-red-500 hover:underline"
            title="Cancelar Pedido"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  ))

  return (
    <section className="max-w-7xl mx-auto px-4">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Meus Pedidos</span>
      </h1>
      
      {pedidos.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Mercadoria</th>
                <th scope="col" className="px-6 py-3">Foto</th>
                <th scope="col" className="px-6 py-3">Quantidade</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidoTable}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Você ainda não fez nenhum pedido.</p>
      )}
    </section>
  )
}
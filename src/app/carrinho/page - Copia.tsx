'use client'
import './page.css'
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/ClienteContext";
import { PedidoItf } from "@/utils/types/PedidoItf";
import Image from "next/image"

// import { toast } from 'sonner';

// type Inputs = {
//   descricao: string
// }

export default function Pedido() {
  // const params = useParams()

  const [pedido, setPedido] = useState<PedidoItf[]>([])
  const { cliente } = useClienteStore()

  // const { register, handleSubmit, reset } = useForm<Inputs>()

  // useEffect(() => {
  //   async function buscaDados() {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
  //     const dados = await response.json()
  //     setPedido(dados)
  //   }
  //   buscaDados()
  // }, [])

  useEffect(() => {
  async function buscaDados() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido/${cliente.id}`)
    const dados = await response.json()
    setPedido(dados)
  }
  if (cliente.id) { // Adicione esta verificação
    buscaDados()
  }
}, [cliente.id])


  // para retornar apenas a data do campo no banco de dados
  // 2024-10-10T22:46:27.227Z => 10/10/2024
  function dataDMA(data: string) {
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return dia + "/" + mes + "/" + ano
  }

  const pedidoTable = pedido.map(pedido => (
    <tr key={pedido.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <p><b>{pedido.mercadoria.nome} <br/> 
          {pedido.mercadoria.categoria}</b></p>
        <p className='mt-3'>
          R$: {Number(pedido.mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
      </th>
      <td className="px-6 py-4">
        <Image src={pedido.mercadoria.foto} className="fotoMercadoria" alt="Foto Mercadoria" />
      </td>
      <td className="px-6 py-4">
        <p><b>{pedido.mercadoria_Id}</b></p>
        <p><i>{pedido.mercadoria.quantidade}</i></p>
      </td>
      <td className="px-6 py-4">
        {pedido.status ?
          <>
            <p><b>{pedido.status}</b></p>
            <p><i>Entregue em: {dataDMA(pedido.updatedAt as string)}</i></p>
          </>
          :
          <i>Aguardando...</i>}
      </td>
    </tr>
  ))

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Meus Pedidos</span></h1>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nome
            </th>
            <th scope="col" className="px-6 py-3">
              Foto
            </th>
            <th scope="col" className="px-6 py-3">
              Quantidade
            </th>
            <th scope="col" className="px-6 py-3">
              Categoria
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidoTable}
        </tbody>
      </table>
    </section>
  )
}

////

// 'use client';

// import { MercadoriaItf } from "@/utils/types/MercadoriaItf";
// import { PedidoItf } from "@/utils/types/PedidoItf";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useClienteStore } from "@/context/ClienteContext";
// import { toast } from "sonner";

// export default function Detalhes() {
//   const params = useParams();
//   const { cliente } = useClienteStore();

//   const [mercadoria, setMercadoria] = useState<MercadoriaItf>();
//   const [pedido, setPedido] = useState<PedidoItf>();
//   const [quantidade, setQuantidade] = useState<number>(1); // Valor inicial definido em 1

//   useEffect(() => {
//     async function buscaDados() {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/${params.mercadoria_id}`);
//       const dados = await response.json();
//       setMercadoria(dados);
//     }
//     buscaDados();
//   }, [params.mercadoria_id]);

//   async function adicionaPedido() {
//     if (!cliente?.id) {
//       toast.error("Você precisa estar logado para adicionar ao carrinho.");
//       return;
//     }
    
//   const quantidade = Number(prompt("Digite a quantidade desejada:", "1"))
//   if (isNaN(quantidade) || quantidade <= 0) {
//     toast.error("Quantidade inválida. Por favor, insira um número válido.");
//     return;
//   }
//   // setPedido(quantidade) // Removed as it is not needed
    
    
    
//     const payload = {
//       status: "EM_PREPARACAO",
//       mercadoria_id: Number(params.mercadoria_id),
//       usuario_id: cliente.id,
//       quantidade: quantidade, // Deve ser um número definido
//     };

//     console.log("Payload enviado:", payload);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const responseText = await response.text();
//       console.log("Resposta da requisição:", responseText);

//       if (response.status === 201) {
//         toast.success("Mercadoria adicionada ao carrinho!");
//         setQuantidade(1); // Reseta para 1 após o pedido
//       } else {
//         toast.error("Erro ao adicionar ao carrinho.");
//       }
//     } catch (error) {
//       console.error("Erro na requisição:", error);
//       toast.error("Erro ao conectar com o servidor.");
//     }
//   }

//   const listaFotos = mercadoria?.fotos?.map(foto => (
//     <div key={foto.id}>
//       <img
//         src={foto.url}
//         alt={foto.descricao}
//         title={foto.descricao}
//         className="h-52 max-w-80 rounded-lg"
//       />
//     </div>
//   ));

//   return (
//     <>
//       <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
//         {mercadoria?.foto &&
//           <>
//             <img
//               className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
//               src={mercadoria.foto}
//               alt="Foto da mercadoria"
//             />
//             <div className="flex flex-col justify-between p-4 leading-normal">
//               <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//                 Nome: {mercadoria ? mercadoria.nome : "Carregando..."} {mercadoria.categoria}
//               </h5>
//               <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
//                 Feirante: {mercadoria?.feirante?.nome ?? "Carregando..."}
//               </h5>
//               <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
//                 Preço R$: {Number(mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
//               </h5>
//               <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
//                 {mercadoria.categoria}
//               </p>

//               {/* Campo de entrada para a quantidade */}
//               <div className="mb-4">
//                 <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Quantidade:
//                 </label>
//                 <input
//                   type="number"
//                   id="quantidade"
//                   value={quantidade}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     // Se o valor estiver vazio, seta 1; caso contrário, converte para número
//                     if (val === "") {
//                       setQuantidade(1);
//                     } else {
//                       setQuantidade(parseInt(val, 10));
//                     }
//                   }}
//                   min="1"
//                   required
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
//                 />
//               </div>

//               <button
//                 onClick={adicionaPedido}
//                 className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
//               >
//                 Adicionar pedido
//               </button>
//             </div>
//           </>
//         }
//       </section>

//       <div className="mt-4 md:max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
//         {listaFotos}
//       </div>
//     </>
//   );
// }

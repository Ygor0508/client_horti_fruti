// 'use client'
// import { MercadoriaItf } from "@/utils/types/MercadoriaItf";
// import { useParams } from "next/navigation"
// import { useEffect, useState } from "react";
// import { useClienteStore } from "@/context/ClienteContext"; 
// import { toast } from "sonner";
// import Image from "next/image"


// export default function Detalhes() {
//   const params = useParams()
//   const { cliente } = useClienteStore() 

//   const [mercadoria, setMercadoria] = useState<MercadoriaItf>()

//   useEffect(() => {
//     async function buscaDados() {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/${params.mercadoria_id}`)
//       const dados = await response.json()
//       setMercadoria(dados)
//     }
//     buscaDados()
//   }, [params.mercadoria_id])

//   async function adicionaPedido() {
//     if (!cliente?.id) {
//       toast.error("Você precisa estar logado para adicionar ao carrinho.")
//       return
//     }

//     console.log("🟢 ID do cliente logado:", cliente.id)
//     console.log("🟢 id produto:", params.mercadoria_id)
//     console.log("🟢 status:", "EM_PREPARACAO")

//     const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         status: "EM_PREPARACAO",
//         mercadoria_id: Number(params.mercadoria_id),
//         usuario_id: cliente.id
        
//       })
//     })

//     const textoErro = await response.text()
// console.log("Erro ao adicionar pedido:", textoErro)


//     if (response.status === 201) {
//       toast.success("Mercadoria adicionada ao carrinho!")
//     } else {
//       toast.error("Erro ao adicionar ao carrinho.")
//     }
//   }

//   const listaFotos = mercadoria?.fotos?.map(foto => (
//     <div key={foto.id}>
//       <Image
//         src={foto.url}
//         alt={foto.descricao}
//         title={foto.descricao}
//         className="h-52 max-w-80 rounded-lg"
//       />
//     </div>
//   ))

//   return (
//     <>
//       <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
//         {mercadoria?.foto &&
//           <>
//             <Image
//               className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
//               src={mercadoria.foto}
//               alt="Foto da mercadoria"
//               width={1000}
//               height={1000}
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

//               {/* Botão para adicionar ao carrinho */}
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
//   )
// }



'use client'
import { MercadoriaItf } from "@/utils/types/MercadoriaItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/ClienteContext";
import { toast } from "sonner";
import Image from "next/image";

export default function Detalhes() {
  const params = useParams();
  const { cliente } = useClienteStore();

  const [mercadoria, setMercadoria] = useState<MercadoriaItf>();
  const [quantidade, setQuantidade] = useState(1); // Estado para a quantidade
  const [unidadeMedida, setUnidadeMedida] = useState("UN"); // Estado para Unidade ou KG

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias/${params.mercadoria_id}`);
      const dados = await response.json();
      setMercadoria(dados);
    }
    buscaDados();
  }, [params.mercadoria_id]);

  async function adicionaPedido() {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    if (quantidade <= 0) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedido`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "EM_PREPARACAO",
          mercadoria_id: Number(params.mercadoria_id),
          usuario_id: cliente.id,
          quantidade: Number(quantidade),
          unidade_medida: unidadeMedida,
        })
      });

      if (response.ok) { // Usar response.ok para status de sucesso (200-299)
        toast.success("Mercadoria adicionada ao carrinho!");
      } else {
        // Tratamento de erro mais robusto
        const responseBody = await response.text(); // Pega a resposta como texto primeiro
        let erroData = null;
        
        try {
          erroData = JSON.parse(responseBody); // Tenta converter para JSON
        } catch (e) {
          // Se a conversão falhar, a resposta não era JSON
          console.error("A resposta da API não é um JSON válido:", responseBody);
          toast.error(`Erro do servidor: ${response.status} - ${response.statusText}`);
          return;
        }

        console.error("Erro ao adicionar pedido (dados da API):", erroData);
        
        // Verifica erros de validação do Zod especificamente
        if (erroData && erroData.detalhes) {
          const errorMessages = Object.values(erroData.detalhes).flat().join(', ');
          toast.error(`Erro de validação: ${errorMessages}`);
        } else {
          toast.error(`Erro ao adicionar ao carrinho: ${erroData.erro || 'Tente novamente.'}`);
        }
      }
    } catch (error) {
      console.error("Erro de rede ou na requisição:", error);
      toast.error("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }
  }

  const listaFotos = mercadoria?.fotos?.map(foto => (
    <div key={foto.id}>
      <Image
        src={foto.url}
        alt={foto.descricao}
        title={foto.descricao}
        className="h-52 w-full object-cover rounded-lg"
        width={320}
        height={208}
      />
    </div>
  ));

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        {mercadoria?.foto &&
          <>
            <Image
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-1/2 md:rounded-none md:rounded-s-lg"
              src={mercadoria.foto}
              alt="Foto da mercadoria"
              width={500}
              height={500}
              priority
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {mercadoria.nome}
              </h5>
              <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
                {mercadoria.categoria}
              </p>
              <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
                Feirante: {mercadoria?.feirante?.nome ?? "Carregando..."}
              </h5>
              <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
                Preço R$: {Number(mercadoria.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
              </h5>
              
              {/* Seletor de Quantidade e Unidade */}
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <label htmlFor="unidade" className="block text-sm font-medium text-gray-900 dark:text-white">Medida:</label>
                  <select
                    id="unidade"
                    value={unidadeMedida}
                    onChange={(e) => setUnidadeMedida(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="UN">Unidade</option>
                    <option value="KG">Quilo (Kg)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantidade" className="block text-sm font-medium text-gray-900 dark:text-white">Quantidade:</label>
                  <input
                    type="number"
                    id="quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    min="0.1"
                    step={unidadeMedida === 'KG' ? '0.1' : '1'}
                  />
                </div>
              </div>

              {/* Botão para adicionar ao carrinho */}
              <button
                onClick={adicionaPedido}
                className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </>
        }
      </section>

      <div className="mt-4 md:max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {listaFotos}
      </div>
    </>
  )
}
'use client'

import { CardMercadoria } from "../componentes/CardMercadorias";
import { MercadoriaItf } from "../utils/types/MercadoriaItf";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [mercadorias, setMercadoria] = useState<MercadoriaItf[]>([])

  useEffect(() => {
    async function buscaDados() {
      // Usaremos os dados que você já busca para a lista de produtos
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/mercadorias`)
      // const dados = await response.json()
      // // Sua lógica de tratamento de dados está boa
      // setMercadoria(Array.isArray(dados) ? dados : dados.mercadorias);
      // Dentro da função buscaDados
      const dados = await response.json();

      // Lógica corrigida e mais segura
      // console.log(dados?.mercadorias)
      const items = Array.isArray(dados) ? dados : dados?.mercadorias || [];
      setMercadoria(items);
    }
    buscaDados()
  }, [])

  const listaMercadorias = mercadorias.slice(0, 4).map(mercadoria => ( // Mostra apenas 4 para combinar com o design
    <CardMercadoria data={mercadoria} key={mercadoria.id} />
  ))

  return (
    <>
      {/* 1. Hero Section */}
      <section className="bg-[#377d4c] text-white py-30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-8 px-4 py-16">
          {/* Coluna de Texto */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Produtos Frescos Direto do Campo
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Qualidade, frescor e sabor em cada produto. Apoie produtores locais!
            </p>
            <Link href="#produtos" className="bg-[#e88421] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition">
              Comprar Agora
            </Link>
          </div>
          {/* Coluna de Imagem */}
          <div className="flex justify-center">
            {/* Salve uma imagem de produtos em public/hero-produtos.png */}
            <Image
              src="/old.png"
              width={400}
              height={400}
              alt="Cesta de produtos frescos"
              className="rounded-full"
            />
          </div>
        </div>
      </section>

      {/* 2. Seção de Produtos Frescos */}
      <section id="produtos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Nossos Produtos Frescos
            </h2>
            <p className="text-lg text-gray-600">
              Direto dos melhores produtores para sua mesa
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
            {listaMercadorias.length > 0 ? listaMercadorias : <p>Carregando produtos...</p>}
          </div>
        </div>
      </section>
    </>
  );
}
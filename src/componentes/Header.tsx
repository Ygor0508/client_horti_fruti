'use client'

import { useClienteStore } from "@/context/ClienteContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Header() {
  const { cliente, deslogaCliente } = useClienteStore()
  const router = useRouter()

  function clienteSair() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaCliente()
      localStorage.removeItem("clienteKey")
      router.push("/login")
    }
  }

  return (
    <header className="bg-green-500 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Feirô"
            width={50}  
            height={30} 
          />
          <span className="text-2xl font-bold text-white">Feirô</span>
        </Link>

        <div className="flex items-center gap-4">
          {cliente.id ? (
            <>
              <span className="text-white font-medium">{cliente.nome}</span>
              <Link
                href="/pedido"
                className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
              >
                Meus Pedidos
              </Link>
              <button
                onClick={clienteSair}
                className="text-white hover:underline font-medium text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-white hover:underline"
            >
              Identifique-se
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

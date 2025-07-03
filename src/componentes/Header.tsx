'use client';

import Link from "next/link";
import Image from "next/image";
import { LogIn, ShoppingCart, Package } from 'lucide-react'; // Adicionado o ícone Package
import { useClienteStore } from "@/context/ClienteContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
  const { cliente, deslogaCliente } = useClienteStore();
  const router = useRouter();

  function clienteSair() {
    // A função confirm() pode ser bloqueante. Uma modal customizada seria uma melhoria futura.
    if (confirm("Confirma saída do sistema?")) {
      deslogaCliente();
      localStorage.removeItem("clienteKey");
      router.push("/login");
    }
  }

  function handleCarrinhoClick() {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado para acessar o carrinho!");
      return;
    }
    router.push("/carrinho");
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* O link para a página inicial já está no logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/fusca.png" width={48} height={48} alt="FreshMarket Logo" />
          <span className="text-2xl font-bold text-[#377d4c]"></span>
        </Link>

        <div className="flex items-center gap-4">
          {cliente.id ? (
            <>

              <span className="text-black font-medium hidden sm:inline">{"Bem-vindo " + cliente.nome}</span>
              <button
                onClick={clienteSair}
                className="text-black hover:underline font-medium text-sm"
              >
                Sair
              </button>
              {/* NOVO LINK PARA "MEUS PEDIDOS" */}
              <Link href="/meus-pedidos" className="flex items-center gap-2 text-gray-600 hover:text-[#377d4c] font-medium">
                <Package size={20} />
                Meus Pedidos
              </Link>
            </>
          ) :

            (
              <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-[#377d4c] font-medium">
                <LogIn size={20} />
                Login
              </Link>
            )}


          <button
            onClick={handleCarrinhoClick}
            className="flex items-center gap-2 bg-[#e88421] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <ShoppingCart size={20} />
            Carrinho
          </button>
        </div>
      </div>
    </header>
  );
}

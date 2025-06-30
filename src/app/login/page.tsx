'use client'
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useClienteStore } from "@/context/ClienteContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Inputs = {
  email: string
  senha: string
  manter: boolean
}

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { logaCliente } = useClienteStore()
  const router = useRouter()

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email: data.email, senha: data.senha })
      })

      if (response.status === 200) {
        const dados = await response.json()
        logaCliente(dados)

        if (data.manter) {
          localStorage.setItem("clienteKey", dados.id)
        } else {
          localStorage.removeItem("clienteKey")
        }

        router.push("/")
      } else {
        toast.error("E-mail ou senha incorretos")
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor")
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFF7E6] px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h1>
        <form onSubmit={handleSubmit(verificaLogin)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              required
              placeholder="seu@email.com"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              id="senha"
              required
              placeholder="••••••••"
              {...register("senha")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="manter"
                {...register("manter")}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="manter" className="text-gray-600">Manter conectado</label>
            </div>
            <Link href="/recuperar-senha" className="text-gray-600 hover:underline">Esqueceu a senha?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-2 rounded-lg shadow-sm transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="text-green-800 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  )
}

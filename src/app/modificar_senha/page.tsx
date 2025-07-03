'use client'
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Inputs = {
  email: string
  codigoRecuperacao: string
  novaSenha: string
  confirmarSenha: string
}


export default function RecuperarSenhaConfirmar() {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  async function handleConfirmacao(data: Inputs) {
    if (data.novaSenha !== data.confirmarSenha) {
      toast.error("As senhas não coincidem")
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/alterar-senha`, {
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({
      email: data.email,
      codigoRecuperacao: data.codigoRecuperacao,
      novaSenha: data.novaSenha,
      confirmarSenha: data.confirmarSenha,
    })
  })
  

    if (response.ok) {
      toast.success("Senha redefinida com sucesso!")
      reset()
    } else {
      const result = await response.json()
      toast.error(result.error || "Erro ao redefinir senha")
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Redefinir Senha
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informe seu e-mail, o código enviado e sua nova senha.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(handleConfirmacao)}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
              <input type="email" id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("email")}
              />
            </div>
            <div>
              <label htmlFor="codigoRecuperacao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Código de Recuperação</label>
              <input type="text" id="codigoRecuperacao"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("codigoRecuperacao")}
              />
            </div>
            <div>
              <label htmlFor="novaSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nova Senha</label>
              <input type="password" id="novaSenha"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("novaSenha")}
              />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar Nova Senha</label>
              <input type="password" id="confirmarSenha"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                {...register("confirmarSenha")}
              />
            </div>
            <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Redefinir Senha
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lembrou da senha? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Voltar para login</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Inputs = {
    nome: string
    email: string
    senha: string
    confirmarSenha: string
    telefone: string
    endereco: string
}

export default function Cadastro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>()
    const router = useRouter()
    const senha = watch("senha")

    async function realizarCadastro(data: Inputs) {
        if (data.senha !== data.confirmarSenha) {
            toast.error("As senhas não coincidem!")
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    telefone: data.telefone,
                    endereco: data.endereco
                })
            })

            if (response.status === 201) {
                toast.success("Cadastro realizado com sucesso!")
                router.push("/login")
            } else {
                const error = await response.json()
                toast.error(error.message || "Erro ao realizar cadastro")
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor")
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <p style={{ height: 48 }}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Cadastro de Novo Cliente
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(realizarCadastro)}>
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Completo</label>
                                <input type="text" id="nome"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("nome", { required: "Nome é obrigatório" })} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                                <input type="email" id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("email", { 
                                        required: "E-mail é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "E-mail inválido"
                                        }
                                    })} />
                            </div>
                            <div>
                                <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
                                <input type="tel" id="telefone"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("telefone", { required: "Telefone é obrigatório" })} />
                            </div>
                            <div>
                                <label htmlFor="endereco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço</label>
                                <input type="text" id="endereco"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("endereco", { required: "Endereço é obrigatório" })} />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                                <input type="password" id="senha"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("senha", { 
                                        required: "Senha é obrigatória",
                                        minLength: {
                                            value: 6,
                                            message: "A senha deve ter pelo menos 6 caracteres"
                                        }
                                    })} />
                            </div>
                            <div>
                                <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar Senha</label>
                                <input type="password" id="confirmarSenha"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                    {...register("confirmarSenha", { 
                                        required: "Confirmação de senha é obrigatória",
                                        validate: value => value === senha || "As senhas não coincidem"
                                    })} />
                            </div>
                            <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Cadastrar
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Já possui uma conta? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Faça login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
} 
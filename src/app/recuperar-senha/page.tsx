'use client'
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Inputs = {
    email: string
}

export default function RecuperarSenha() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
    const router = useRouter()

    async function solicitarRecuperacao(data: Inputs) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios/solicitar-recuperacao`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ email: data.email })
            })

            if (response.status === 200) {
                toast.success("Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.")
                router.push("/modificar_senha")
            } else {
                toast.error("Erro ao processar a solicitação")
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
                            Recuperar Senha
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Digite seu e-mail cadastrado para receber as instruções de recuperação de senha.
                        </p>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(solicitarRecuperacao)}>
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
                            <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Enviar Código de Recuperação
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Voltar para o login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
} 
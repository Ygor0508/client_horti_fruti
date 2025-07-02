import { UsuarioItf } from '@/utils/types/UsuarioItf'
import { create } from 'zustand'

type ClienteStore = {
    cliente: UsuarioItf
    logaCliente: (clienteLogado: UsuarioItf) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: {} as UsuarioItf,
    logaCliente: (clienteLogado) => set({cliente: clienteLogado}),
    deslogaCliente: () => set({cliente: {} as UsuarioItf})
}))
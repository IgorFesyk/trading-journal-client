import { api } from '@shared/lib/api'

import type { Symbol, SymbolCategory } from '../symbol.types'

type CreateSymbolRequest = {
    name: string
    category: SymbolCategory
}

export async function createSymbolApi(data: CreateSymbolRequest) {
    const response = await api.post<Symbol>('/symbols', data)
    return response.data
}

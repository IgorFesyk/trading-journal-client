import { api } from '@shared/lib/api'

import type { Symbol, SymbolCategory } from '../symbol.types'

type UpdateSymbolInput = {
    id: number
    name?: string
    category?: SymbolCategory
    published?: boolean
}

export async function updateSymbolApi(input: UpdateSymbolInput) {
    const { id, ...body } = input
    return api.put<Symbol>(`/symbols/${id}`, body).then((r) => r.data)
}

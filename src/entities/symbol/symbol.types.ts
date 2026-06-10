export type SymbolCategory = 'FOREX' | 'CRYPTO' | 'STOCKS' | 'INDICES'

export type Symbol = {
    id: number
    name: string
    category: SymbolCategory
    createdAt: string
    updatedAt: string
}

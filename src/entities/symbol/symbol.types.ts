export type SymbolCategory = 'FOREX' | 'CRYPTO' | 'STOCKS' | 'INDICES'

export type Symbol = {
    id: number
    name: string
    category: SymbolCategory
    published: boolean
    tradeCount: number
    createdAt: string
    updatedAt: string
}

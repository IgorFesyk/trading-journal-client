import { api } from '@shared/lib/api'

import type { Symbol } from '../symbol.types'

export async function getSymbolsApi() {
    return api.get<Symbol[]>('/symbols').then((r) => r.data)
}

import { DeleteSymbolButton } from '@features/admin'

import type { Symbol } from '@entities/symbol'

const CATEGORY_LABELS: Record<Symbol['category'], string> = {
    FOREX: 'Forex',
    CRYPTO: 'Crypto',
    STOCKS: 'Stocks',
    INDICES: 'Indices',
}

type SymbolRowProps = {
    symbol: Symbol
}

export function SymbolRow(props: SymbolRowProps) {
    const { symbol } = props

    return (
        <div className="flex items-center gap-6 border-b px-4 py-4 last:border-b-0">
            <div className="w-32 shrink-0">
                <span className="font-mono text-sm font-bold">{symbol.name}</span>
            </div>
            <div className="flex-1 text-sm text-muted-foreground">{CATEGORY_LABELS[symbol.category]}</div>
            <div className="w-24 shrink-0 text-xs text-muted-foreground">{symbol.tradeCount} trades</div>
            <div className="w-14 shrink-0">
                <DeleteSymbolButton symbol={symbol} />
            </div>
        </div>
    )
}

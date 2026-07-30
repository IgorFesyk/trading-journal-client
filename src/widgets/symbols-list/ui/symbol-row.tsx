import { DeleteSymbolButton, EditSymbolButton } from '@features/admin'

import type { Symbol } from '@entities/symbol'

const CATEGORY_LABELS: Record<Symbol['category'], string> = {
    FOREX: 'Forex',
    CRYPTO: 'Crypto',
    STOCKS: 'Stocks',
    INDICES: 'Indices',
}

const PUBLISHED_STYLES: Record<'true' | 'false', string> = {
    true: 'bg-green-500/10 text-green-600 dark:text-green-400',
    false: 'bg-muted text-muted-foreground',
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
            <div className="w-32 shrink-0">
                <span
                    className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${PUBLISHED_STYLES[symbol.published ? 'true' : 'false']}`}
                >
                    {symbol.published ? 'Published' : 'Unpublished'}
                </span>
            </div>
            <div className="flex w-20 shrink-0 items-center justify-end gap-1">
                <EditSymbolButton symbol={symbol} />
                <DeleteSymbolButton symbol={symbol} />
            </div>
        </div>
    )
}

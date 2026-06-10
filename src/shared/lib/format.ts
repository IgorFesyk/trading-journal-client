import type { Currency } from '@entities/account'

export function formatCents(cents: number, currency: Currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(cents / 100)
}

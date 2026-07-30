export function formatCents(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(cents / 100)
}

export function formatCentsCompact(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(cents / 100)
}

export function formatBips(bips: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(bips / 10000)
}

export function toCents(dollars: number) {
    return Math.round(dollars * 100)
}

export function toBips(percent: number) {
    return Math.round(percent * 100)
}

export function fromCents(cents: number) {
    return cents / 100
}

export function fromBips(bips: number) {
    return bips / 100
}

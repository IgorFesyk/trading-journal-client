import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

type StatCardProps = {
    label: string
    value: React.ReactNode
    sub: React.ReactNode
}

export function StatCard(props: StatCardProps) {
    const { label, value, sub } = props
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xs tracking-widest text-muted-foreground uppercase">{label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <div className="font-heading text-2xl leading-none font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
            </CardContent>
        </Card>
    )
}

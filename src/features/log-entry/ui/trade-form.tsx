import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { z } from 'zod'

import { getSymbolsApi } from '@entities/symbol'
import { createTradeApi } from '@entities/trade'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { Textarea } from '@shared/ui/textarea'

const schema = z.object({
    symbolId: z.coerce.number().min(1, 'Required'),
    direction: z.enum(['LONG', 'SHORT']),
    entryTF: z.enum(['M15', 'H1', 'H4', 'D1', 'W1']),
    setup: z.enum(['IDM', 'SNR', 'FVG', 'MarketEntry']),
    status: z.enum(['WIN', 'LOSE', 'BE', 'IN_PROGRESS']),
    risk: z.coerce.number().positive('Required'),
    openedAt: z.string().min(1, 'Required'),
    pnl: z.coerce.number().optional(),
    commission: z.coerce.number().min(0).optional(),
    closedAt: z.string().optional(),
    notes: z.string().optional(),
})

type FormZodInput = z.input<typeof schema>
type FormZodOutput = z.output<typeof schema>
type FormValues = z.infer<typeof schema>

type TradeFormProps = { onSuccess: () => void }

export function TradeForm(props: TradeFormProps) {
    const { onSuccess } = props

    const { accountId } = useParams()
    const queryClient = useQueryClient()

    const { data: symbols = [] } = useQuery({
        queryKey: ['symbols'],
        queryFn: getSymbolsApi,
    })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormZodInput, unknown, FormZodOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            status: 'IN_PROGRESS',
            openedAt: new Date().toISOString().slice(0, 16),
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (values: FormValues) =>
            createTradeApi({
                accountId: Number(accountId),
                symbolId: values.symbolId,
                direction: values.direction,
                entryTF: values.entryTF,
                setup: values.setup,
                status: values.status,
                risk: Math.round(values.risk * 100),
                openedAt: values.openedAt,
                pnl: values.pnl !== undefined ? Math.round(values.pnl * 100) : undefined,
                commission: values.commission !== undefined ? Math.round(values.commission * 100) : undefined,
                closedAt: values.closedAt || undefined,
                notes: values.notes || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades', accountId] })
            onSuccess()
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Symbol" error={errors.symbolId?.message}>
                    <Controller
                        control={control}
                        name="symbolId"
                        render={({ field }) => (
                            <Select value={String(field.value ?? '')} onValueChange={(v) => field.onChange(Number(v))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select symbol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {symbols.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field label="Direction" error={errors.direction?.message}>
                    <Controller
                        control={control}
                        name="direction"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LONG">Long</SelectItem>
                                    <SelectItem value="SHORT">Short</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field label="Entry TF" error={errors.entryTF?.message}>
                    <Controller
                        control={control}
                        name="entryTF"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(['M15', 'H1', 'H4', 'D1', 'W1'] as const).map((tf) => (
                                        <SelectItem key={tf} value={tf}>
                                            {tf}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field label="Setup" error={errors.setup?.message}>
                    <Controller
                        control={control}
                        name="setup"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(['IDM', 'SNR', 'FVG', 'MarketEntry'] as const).map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field label="Status" error={errors.status?.message}>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN_PROGRESS">Open</SelectItem>
                                    <SelectItem value="WIN">Win</SelectItem>
                                    <SelectItem value="LOSE">Loss</SelectItem>
                                    <SelectItem value="BE">Break Even</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                <Field label="Risk %" error={errors.risk?.message}>
                    <Input type="number" step="0.01" placeholder="1.50" {...register('risk')} />
                </Field>

                <Field label="Opened At" error={errors.openedAt?.message} className="col-span-2">
                    <Input type="datetime-local" {...register('openedAt')} />
                </Field>

                <Field label="P&L ($)" error={errors.pnl?.message}>
                    <Input type="number" step="0.01" placeholder="0.00" {...register('pnl')} />
                </Field>

                <Field label="Commission ($)" error={errors.commission?.message}>
                    <Input type="number" step="0.01" placeholder="0.00" {...register('commission')} />
                </Field>

                <Field label="Closed At" error={errors.closedAt?.message} className="col-span-2">
                    <Input type="datetime-local" {...register('closedAt')} />
                </Field>
            </div>

            <Field label="Notes" error={errors.notes?.message}>
                <Textarea placeholder="Optional notes…" rows={2} {...register('notes')} />
            </Field>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Saving…' : 'Log Trade'}
            </Button>
        </form>
    )
}

type FieldProps = {
    label: string
    error?: string
    className?: string
    children: React.ReactNode
}

function Field(props: FieldProps) {
    const { label, error, className, children } = props

    return (
        <div className={`flex flex-col gap-1 ${className ?? ''}`}>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
            {children}
            {error && <span className="text-[10px] text-destructive">{error}</span>}
        </div>
    )
}

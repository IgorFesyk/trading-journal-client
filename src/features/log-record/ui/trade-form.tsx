import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { z } from 'zod'

import { accountQueryKeys } from '@entities/account'
import { symbolQueries } from '@entities/symbol'
import { createTradeApi, tradeQueryKeys } from '@entities/trade'
import type { Trade } from '@entities/trade'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldLabel } from '@shared/ui/field'
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

    const { data: symbols = [] } = useQuery(symbolQueries.all())

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
        onMutate: async (values) => {
            const queryKey = tradeQueryKeys.tradesByAccountId(Number(accountId))

            await queryClient.cancelQueries({ queryKey })

            const previousTrades = queryClient.getQueryData<Trade[]>(queryKey)

            const now = new Date().toISOString()
            const optimisticTrade: Trade = {
                id: -Date.now(),
                accountId: Number(accountId),
                symbolId: values.symbolId,
                direction: values.direction,
                entryTF: values.entryTF,
                setup: values.setup,
                status: values.status,
                risk: Math.round(values.risk * 100),
                pnl: values.pnl !== undefined ? Math.round(values.pnl * 100) : null,
                commission: values.commission !== undefined ? Math.round(values.commission * 100) : null,
                notes: values.notes ?? null,
                openedAt: values.openedAt,
                closedAt: values.closedAt || null,
                createdAt: now,
                updatedAt: now,
            }

            queryClient.setQueryData<Trade[]>(queryKey, (old = []) => [optimisticTrade, ...old])
            onSuccess()

            return { previousTrades }
        },
        onError: (_err, _values, context) => {
            if (context?.previousTrades !== undefined) {
                queryClient.setQueryData(tradeQueryKeys.tradesByAccountId(Number(accountId)), context.previousTrades)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: tradeQueryKeys.tradesByAccountId(Number(accountId)),
            })
            queryClient.invalidateQueries({
                queryKey: accountQueryKeys.stats(Number(accountId)),
            })
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
                <Field>
                    <FieldLabel>Symbol</FieldLabel>
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
                    <FieldError errors={[errors.symbolId]} />
                </Field>

                <Field>
                    <FieldLabel>Direction</FieldLabel>
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
                    <FieldError errors={[errors.direction]} />
                </Field>

                <Field>
                    <FieldLabel>Entry TF</FieldLabel>
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
                    <FieldError errors={[errors.entryTF]} />
                </Field>

                <Field>
                    <FieldLabel>Setup</FieldLabel>
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
                    <FieldError errors={[errors.setup]} />
                </Field>

                <Field>
                    <FieldLabel>Status</FieldLabel>
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
                    <FieldError errors={[errors.status]} />
                </Field>

                <Field>
                    <FieldLabel>Risk %</FieldLabel>
                    <Input type="number" step="0.01" placeholder="1.50" {...register('risk')} />
                    <FieldError errors={[errors.risk]} />
                </Field>

                <Field className="col-span-2">
                    <FieldLabel>Opened At</FieldLabel>
                    <Input type="datetime-local" {...register('openedAt')} />
                    <FieldError errors={[errors.openedAt]} />
                </Field>

                <Field>
                    <FieldLabel>P&L ($)</FieldLabel>
                    <Input type="number" step="0.01" placeholder="0.00" {...register('pnl')} />
                    <FieldError errors={[errors.pnl]} />
                </Field>

                <Field>
                    <FieldLabel>Commission ($)</FieldLabel>
                    <Input type="number" step="0.01" placeholder="0.00" {...register('commission')} />
                    <FieldError errors={[errors.commission]} />
                </Field>

                <Field className="col-span-2">
                    <FieldLabel>Closed At</FieldLabel>
                    <Input type="datetime-local" {...register('closedAt')} />
                    <FieldError errors={[errors.closedAt]} />
                </Field>
            </div>

            <Field>
                <FieldLabel>Notes</FieldLabel>
                <Textarea placeholder="Optional notes…" rows={2} {...register('notes')} />
                <FieldError errors={[errors.notes]} />
            </Field>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Saving…' : 'Log Trade'}
            </Button>
        </form>
    )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { z } from 'zod'

import { accountQueryKeys } from '@entities/account'
import { createTransactionApi, transactionQueryKeys } from '@entities/transaction'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { Textarea } from '@shared/ui/textarea'

const schema = z.object({
    type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'ADJUSTMENT']),
    amount: z.coerce.number().positive('Must be positive'),
    occurredAt: z.string().min(1, 'Required'),
    note: z.string().optional(),
})

type FormZodInput = z.input<typeof schema>
type FormZodOutput = z.output<typeof schema>
type FormValues = z.infer<typeof schema>

type TransactionFormProps = { onSuccess: () => void }

export function TransactionForm(props: TransactionFormProps) {
    const { onSuccess } = props

    const { accountId } = useParams()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormZodInput, unknown, FormZodOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            occurredAt: new Date().toISOString().slice(0, 10),
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (values: FormValues) =>
            createTransactionApi({
                accountId: Number(accountId),
                type: values.type,
                amount: Math.round(values.amount * 100),
                occurredAt: values.occurredAt,
                note: values.note || undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transactionQueryKeys.transactionsByAccountId(Number(accountId)),
            })
            queryClient.invalidateQueries({
                queryKey: accountQueryKeys.stats(Number(accountId)),
            })
            onSuccess()
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
                <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                    <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError errors={[errors.type]} />
                </Field>

                <Field>
                    <FieldLabel>Amount ($)</FieldLabel>
                    <Input type="number" step="0.01" placeholder="0.00" {...register('amount')} />
                    <FieldError errors={[errors.amount]} />
                </Field>

                <Field className="col-span-2">
                    <FieldLabel>Date</FieldLabel>
                    <Input type="date" {...register('occurredAt')} />
                    <FieldError errors={[errors.occurredAt]} />
                </Field>
            </div>

            <Field>
                <FieldLabel>Note</FieldLabel>
                <Textarea placeholder="Optional note…" rows={2} {...register('note')} />
                <FieldError errors={[errors.note]} />
            </Field>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Saving…' : 'Log Transaction'}
            </Button>
        </form>
    )
}

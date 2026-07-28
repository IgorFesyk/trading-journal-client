import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import { accountQueryKeys, createAccountApi } from '@entities/account'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['CAPITAL', 'PROP']),
    currency: z.enum(['USD', 'EUR', 'GBP']),
    startingEquity: z.coerce.number().positive('Must be a positive number'),
    targetEquity: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.coerce.number().positive('Must be a positive number').optional()
    ),
})

type FormZodInput = z.input<typeof schema>
type FormZodOutput = z.output<typeof schema>
type FormValues = z.infer<typeof schema>

type CreateAccountFormProps = {
    onCreated?: () => void
}

export function CreateAccountForm(props: CreateAccountFormProps) {
    const { onCreated } = props

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<FormZodInput, unknown, FormZodOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: 'CAPITAL',
            currency: 'USD',
        },
    })

    const type = useWatch({ control, name: 'type' })

    const { mutate, isPending } = useMutation({
        mutationFn: createAccountApi,
        onSuccess: async (account) => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.all() })
            onCreated?.()
            navigate(`/accounts/${account.id}/dashboard`)
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field>
                <FieldLabel>Account name</FieldLabel>
                <Input placeholder="My Trading Account" disabled={isPending} {...register('name')} />
                <FieldError errors={[errors.name]} />
            </Field>

            <Field>
                <FieldLabel>Type</FieldLabel>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value)
                                if (value === 'CAPITAL') setValue('targetEquity', undefined)
                            }}
                            disabled={isPending}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CAPITAL">Capital</SelectItem>
                                <SelectItem value="PROP">Prop</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <FieldError errors={[errors.type]} />
            </Field>

            <Field>
                <FieldLabel>Currency</FieldLabel>
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <FieldError errors={[errors.currency]} />
            </Field>

            <Field>
                <FieldLabel>Starting equity</FieldLabel>
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10000"
                    disabled={isPending}
                    {...register('startingEquity')}
                />
                <FieldError errors={[errors.startingEquity]} />
            </Field>

            {type === 'PROP' && (
                <Field>
                    <FieldLabel>Target equity (optional)</FieldLabel>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="15000"
                        disabled={isPending}
                        {...register('targetEquity')}
                    />
                    <FieldError errors={[errors.targetEquity]} />
                </Field>
            )}

            <Button type="submit" disabled={isPending}>
                Create account
            </Button>
        </form>
    )
}

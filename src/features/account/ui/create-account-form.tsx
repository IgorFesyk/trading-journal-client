import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import { type AccountType, type Currency, createAccountApi } from '@entities/account'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['CAPITAL', 'PROP']),
    currency: z.enum(['USD', 'EUR', 'GBP']),
    startingEquity: z.coerce.number().positive('Must be a positive number'),
    targetEquity: z.coerce.number().positive('Must be a positive number').optional(),
})

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>

export function CreateAccountForm() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [name, setName] = useState('')
    const [type, setType] = useState<AccountType>('CAPITAL')
    const [currency, setCurrency] = useState<Currency>('USD')
    const [startingEquity, setStartingEquity] = useState('')
    const [targetEquity, setTargetEquity] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})

    const { mutate, isPending } = useMutation({
        mutationFn: createAccountApi,
        onSuccess: async (account) => {
            await queryClient.invalidateQueries({ queryKey: ['accounts'] })
            navigate(`/accounts/${account.id}/dashboard`)
        },
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const result = schema.safeParse({
            name,
            type,
            currency,
            startingEquity: startingEquity || undefined,
            targetEquity: targetEquity || undefined,
        })

        if (!result.success) {
            const flat = result.error.flatten().fieldErrors
            setErrors({
                name: flat.name?.[0],
                type: flat.type?.[0],
                currency: flat.currency?.[0],
                startingEquity: flat.startingEquity?.[0],
                targetEquity: flat.targetEquity?.[0],
            })
            return
        }

        setErrors({})
        mutate(result.data)
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Account name</FieldLabel>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                        placeholder="My Trading Account"
                    />
                    {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select value={type} onValueChange={(v) => setType(v as AccountType)} disabled={isPending}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CAPITAL">Capital</SelectItem>
                            <SelectItem value="PROP">Prop</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.type && <FieldError>{errors.type}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel>Currency</FieldLabel>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)} disabled={isPending}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.currency && <FieldError>{errors.currency}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="startingEquity">Starting equity</FieldLabel>
                    <Input
                        id="startingEquity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={startingEquity}
                        onChange={(e) => setStartingEquity(e.target.value)}
                        disabled={isPending}
                        placeholder="10000"
                    />
                    {errors.startingEquity && <FieldError>{errors.startingEquity}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="targetEquity">Target equity (optional)</FieldLabel>
                    <Input
                        id="targetEquity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={targetEquity}
                        onChange={(e) => setTargetEquity(e.target.value)}
                        disabled={isPending}
                        placeholder="15000"
                    />
                    {errors.targetEquity && <FieldError>{errors.targetEquity}</FieldError>}
                </Field>

                <Field>
                    <Button type="submit" disabled={isPending}>
                        Create account
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

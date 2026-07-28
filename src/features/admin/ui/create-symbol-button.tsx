import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { createSymbolApi, symbolQueryKeys } from '@entities/symbol'

import { getErrorMessage } from '@shared/lib'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Field, FieldError, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.enum(['FOREX', 'CRYPTO', 'STOCKS', 'INDICES']),
})

type FormZodInput = z.input<typeof schema>
type FormZodOutput = z.output<typeof schema>
type FormValues = z.infer<typeof schema>

export function CreateSymbolButton() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormZodInput, unknown, FormZodOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            category: 'FOREX',
        },
    })

    const { mutate, isPending, error } = useMutation({
        mutationFn: createSymbolApi,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: symbolQueryKeys.all() })
            setOpen(false)
            reset()
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)}>
                <Plus weight="bold" />
                Add Symbol
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Symbol</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input placeholder="EUR/USD" disabled={isPending} {...register('name')} />
                            <FieldError errors={[errors.name]} />
                        </Field>

                        <Field>
                            <FieldLabel>Category</FieldLabel>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FOREX">Forex</SelectItem>
                                            <SelectItem value="CRYPTO">Crypto</SelectItem>
                                            <SelectItem value="STOCKS">Stocks</SelectItem>
                                            <SelectItem value="INDICES">Indices</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[errors.category]} />
                        </Field>

                        {error && (
                            <p className="text-xs text-destructive">
                                {getErrorMessage(error) ?? 'Failed to create symbol'}
                            </p>
                        )}

                        <Button type="submit" disabled={isPending}>
                            Add Symbol
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

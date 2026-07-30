import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { type Symbol, symbolQueryKeys, updateSymbolApi } from '@entities/symbol'

import { getErrorMessage } from '@shared/lib'
import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

const schema = z.object({
    name: z.string().min(1, 'Title is required'),
    category: z.enum(['FOREX', 'CRYPTO', 'STOCKS', 'INDICES']),
    published: z.enum(['published', 'unpublished']),
})

type FormZodInput = z.input<typeof schema>
type FormZodOutput = z.output<typeof schema>
type FormValues = z.infer<typeof schema>

type EditSymbolFormProps = { symbol: Symbol; onSuccess: () => void }

export function EditSymbolForm(props: EditSymbolFormProps) {
    const { symbol, onSuccess } = props
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormZodInput, unknown, FormZodOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: symbol.name,
            category: symbol.category,
            published: symbol.published ? 'published' : 'unpublished',
        },
    })

    const { mutate, isPending, error } = useMutation({
        mutationFn: (values: FormValues) =>
            updateSymbolApi({
                id: symbol.id,
                name: values.name,
                category: values.category,
                published: values.published === 'published',
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: symbolQueryKeys.all() })
            onSuccess()
        },
    })

    function onSubmit(values: FormValues) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field>
                <FieldLabel>Title</FieldLabel>
                <Input placeholder="EUR/USD" disabled={isPending} {...register('name')} />
                <FieldError errors={[errors.name]} />
            </Field>

            <Field>
                <FieldLabel>Market</FieldLabel>
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

            <Field>
                <FieldLabel>Published</FieldLabel>
                <Controller
                    control={control}
                    name="published"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="unpublished">Unpublished</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <FieldError errors={[errors.published]} />
            </Field>

            {error && <p className="text-xs text-destructive">{getErrorMessage(error) ?? 'Failed to update symbol'}</p>}

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Saving…' : 'Save Changes'}
            </Button>
        </form>
    )
}

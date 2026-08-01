import { CircleNotch } from '@phosphor-icons/react'

import { cn } from '@shared/lib/utils'

type LoaderProps = React.ComponentProps<typeof CircleNotch>

function Loader(props: LoaderProps) {
    const { className, ...rest } = props

    return <CircleNotch data-slot="loader" className={cn('animate-spin', className)} {...rest} />
}

export { Loader }

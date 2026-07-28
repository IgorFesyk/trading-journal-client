import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown): string | undefined {
    if (isAxiosError<{ message?: string }>(error)) {
        return error.response?.data.message
    }

    return undefined
}

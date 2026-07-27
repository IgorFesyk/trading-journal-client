export {}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize(config: {
                        client_id: string
                        callback: (response: { credential: string }) => void
                    }): void
                    renderButton(
                        parent: HTMLElement,
                        options: {
                            theme?: string
                            size?: string
                            shape?: string
                            text?: string
                            width?: number
                            locale?: string
                        }
                    ): void
                }
            }
        }
    }
}

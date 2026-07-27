let scriptPromise: Promise<void> | null = null

export function loadGoogleScript() {
    if (window.google) return Promise.resolve()

    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client?hl=en'
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
            document.head.appendChild(script)
        })
    }

    return scriptPromise
}

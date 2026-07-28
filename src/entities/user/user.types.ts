export type Role = 'ADMIN' | 'USER'

export type User = {
    id: string
    name: string
    email: string
    role: Role
    createdAt: string
}

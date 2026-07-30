import { Desktop, Moon, Sun } from '@phosphor-icons/react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shared/ui/sidebar'

import { useTheme } from '../lib/use-theme'

const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Desktop },
] as const

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const ActiveIcon = themeOptions.find((option) => option.value === theme)?.icon ?? Desktop

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            <ActiveIcon />
                            <span className="font-normal">Theme</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-40">
                        {themeOptions.map((option) => (
                            <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
                                <option.icon />
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
    SidebarMenuButton,
} from "./ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <SunIcon />
            case "dark":
                return <MoonIcon />
            default:
                return <MonitorIcon />
        }
    }

    const getText = () => {
        switch (theme) {
            case "light":
                return "Light"
            case "dark":
                return "Dark"
            default:
                return "System"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                    {getIcon()}
                    <span>{getText()}</span>
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <SunIcon />
                    Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <MoonIcon />
                    Dark
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <MonitorIcon />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

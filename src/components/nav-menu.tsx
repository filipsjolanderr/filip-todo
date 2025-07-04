import { Link } from "@tanstack/react-router"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { authClient } from "~/lib/auth-client"
import { useState, useEffect } from "react"
import { UserButton } from "@daveyplate/better-auth-ui"

export function NavMenu() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await authClient.getSession()
            setIsAuthenticated(!!data?.user)
        }
        checkAuth()
    }, [])

    const handleSignOut = async () => {
        const { error } = await authClient.signOut()
        if (!error) {
            setIsAuthenticated(false)
        }
    }

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link to="/" className={navigationMenuTriggerStyle()}>
                                Home
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/projects" className={navigationMenuTriggerStyle()}>
                                Projects
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/blog" className={navigationMenuTriggerStyle()}>
                                Blog Posts
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/cv" className={navigationMenuTriggerStyle()}>
                                Curriculum Vitae
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton />
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
} 

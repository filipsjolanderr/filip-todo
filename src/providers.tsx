import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack"
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Link, useRouter } from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { authClient } from "~/lib/auth-client"

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60
        }
    }
})

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthQueryProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthUIProviderTanstack
                        providers={["github"]}
                        authClient={authClient}
                        navigate={(href) => router.navigate({ href })}
                        replace={(href) => router.navigate({ href, replace: true })}
                        Link={({ href, ...props }) => <Link to={href} {...props} />}
                        settingsURL="/dashboard/settings"
                    >
                        {children}

                        <Toaster />
                    </AuthUIProviderTanstack>
                </ThemeProvider>
            </AuthQueryProvider>
        </QueryClientProvider>
    )
}

import { createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from "~/components/app-sidebar"
import { NavActions } from "~/components/nav-actions"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "~/components/ui/sidebar"
import { TodoList } from '~/components/todo-list'
import { SignedIn, RedirectToSignIn, SignedOut } from "@daveyplate/better-auth-ui"

export const Route = createFileRoute('/projects/$projectId')({
    component: Project,
})

function Project() {
    const { projectId } = Route.useParams()

    return (
        <>
            <SignedIn>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
                            <div className="flex flex-1 items-center gap-2 px-3">
                                <SidebarTrigger />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="line-clamp-1">Project: {projectId}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="ml-auto px-3">
                                <NavActions />
                            </div>
                        </header>
                        <TodoList />
                    </SidebarInset>
                </SidebarProvider>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
} 

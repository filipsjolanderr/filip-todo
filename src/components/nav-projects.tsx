import { MoreHorizontal, Plus } from "lucide-react"
import { Link } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: string
    color: string
    tasks: number
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <Link to={project.url} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${project.color}`} />
                    <span>{project.icon}</span>
                    <span>{project.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{project.tasks}</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <Plus />
              <span>Add Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

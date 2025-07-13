import { Link } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavSmartLists({
  smartLists,
}: {
  smartLists: {
    name: string
    url: string
    icon: string
    count: number
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Smart Lists</SidebarGroupLabel>
      <SidebarMenu>
        {smartLists.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{item.count}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

import type * as React from "react"
import { Calendar, CheckSquare, Clock, Home, Inbox, Settings, Target, TrendingUp, Zap } from "lucide-react"
import { Link, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { NavMain } from "~/components/nav-main"
import { NavProjects } from "~/components/nav-projects"
import { NavSecondary } from "~/components/nav-secondary"
import { NavSmartLists } from "~/components/nav-smart-lists"
import { TeamSwitcher } from "~/components/team-switcher"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "~/components/ui/sidebar"
import { getSidebarData } from "~/lib/todo-actions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const currentPath = router.state.location.pathname

  const { data: sidebarData } = useQuery({
    queryKey: ['sidebar-data'],
    queryFn: () => getSidebarData(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Smart Todo App Data
  const data = {
    teams: [
      {
        name: "Personal",
        logo: Target,
        plan: "Pro",
      },
      {
        name: "Work",
        logo: TrendingUp,
        plan: "Team",
      },
      {
        name: "Family",
        logo: Home,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
        badge: sidebarData?.inboxCount?.toString() || "0",
        isActive: currentPath === "/inbox",
      },
      {
        title: "Today",
        url: "/today",
        icon: Calendar,
        isActive: currentPath === "/today",
        badge: sidebarData?.todayCount?.toString() || "0",
      },
      {
        title: "Upcoming",
        url: "/upcoming",
        icon: Clock,
        badge: sidebarData?.upcomingCount?.toString() || "0",
        isActive: currentPath === "/upcoming",
      },
      {
        title: "Completed",
        url: "/completed",
        icon: CheckSquare,
        isActive: currentPath === "/completed",
        badge: sidebarData?.completedCount?.toString() || "0",
      },
    ],
    smartLists: [
      {
        name: "High Priority",
        url: "/smart/high-priority",
        icon: "🔥",
        count: sidebarData?.smartLists?.highPriority || 0,
      },
      {
        name: "Due Today",
        url: "/smart/due-today",
        icon: "⏰",
        count: sidebarData?.todayCount || 0,
      },
      {
        name: "Overdue",
        url: "/smart/overdue",
        icon: "⚠️",
        count: sidebarData?.smartLists?.overdue || 0,
      },
      {
        name: "Quick Tasks",
        url: "/smart/quick-tasks",
        icon: "⚡",
        count: sidebarData?.smartLists?.quickTasks || 0,
      },
      {
        name: "Waiting For",
        url: "/smart/waiting-for",
        icon: "⏳",
        count: sidebarData?.smartLists?.waitingFor || 0,
      },
    ],
    projects: sidebarData?.projects?.map(project => ({
      name: project.name,
      url: `/projects/${encodeURIComponent(project.name)}`,
      icon: "📁",
      color: "bg-blue-500",
      tasks: project.tasks,
    })) || [],
    navSecondary: [
      {
        title: "AI Schedule",
        url: "/ai-schedule",
        icon: Zap,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: TrendingUp,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSmartLists smartLists={data.smartLists} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

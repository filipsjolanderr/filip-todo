import type * as React from "react"
import { Calendar, CheckSquare, Clock, Home, Inbox, Settings, Target, TrendingUp, Zap } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavSmartLists } from "@/components/nav-smart-lists"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

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
      url: "#",
      icon: Inbox,
      badge: "3",
    },
    {
      title: "Today",
      url: "#",
      icon: Calendar,
      isActive: true,
      badge: "5",
    },
    {
      title: "Upcoming",
      url: "#",
      icon: Clock,
      badge: "12",
    },
    {
      title: "Completed",
      url: "#",
      icon: CheckSquare,
    },
  ],
  smartLists: [
    {
      name: "High Priority",
      url: "#",
      icon: "🔥",
      count: 4,
    },
    {
      name: "Due Today",
      url: "#",
      icon: "⏰",
      count: 2,
    },
    {
      name: "Overdue",
      url: "#",
      icon: "⚠️",
      count: 1,
    },
    {
      name: "Quick Tasks",
      url: "#",
      icon: "⚡",
      count: 6,
    },
    {
      name: "Waiting For",
      url: "#",
      icon: "⏳",
      count: 3,
    },
  ],
  projects: [
    {
      name: "Website Redesign",
      url: "#",
      icon: "💻",
      color: "bg-blue-500",
      tasks: 8,
    },
    {
      name: "Marketing Campaign",
      url: "#",
      icon: "📈",
      color: "bg-green-500",
      tasks: 12,
    },
    {
      name: "Home Renovation",
      url: "#",
      icon: "🏠",
      color: "bg-orange-500",
      tasks: 15,
    },
    {
      name: "Learning Spanish",
      url: "#",
      icon: "🇪🇸",
      color: "bg-purple-500",
      tasks: 5,
    },
    {
      name: "Fitness Goals",
      url: "#",
      icon: "💪",
      color: "bg-red-500",
      tasks: 7,
    },
  ],
  navSecondary: [
    {
      title: "AI Schedule",
      url: "#",
      icon: Zap,
    },
    {
      title: "Analytics",
      url: "#",
      icon: TrendingUp,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

"use client"

import * as React from "react"
import {
  Archive,
  Bell,
  BellOff,
  Calendar,
  Clock,
  Copy,
  Flag,
  MoreHorizontal,
  Repeat,
  Share,
  Star,
  Tag,
  Trash2,
  Zap,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const todoActions = [
  [
    {
      label: "Set Priority",
      icon: Flag,
    },
    {
      label: "Set Due Date",
      icon: Calendar,
    },
    {
      label: "Add Reminder",
      icon: Bell,
    },
    {
      label: "Add to Project",
      icon: Tag,
    },
  ],
  [
    {
      label: "Duplicate Task",
      icon: Copy,
    },
    {
      label: "Make Recurring",
      icon: Repeat,
    },
    {
      label: "Share Task",
      icon: Share,
    },
  ],
  [
    {
      label: "AI Optimize",
      icon: Zap,
    },
    {
      label: "Time Block",
      icon: Clock,
    },
    {
      label: "Archive",
      icon: Archive,
    },
  ],
  [
    {
      label: "Turn off notifications",
      icon: BellOff,
    },
    {
      label: "Delete",
      icon: Trash2,
    },
  ],
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">5 tasks today</div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 data-[state=open]:bg-accent">
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {todoActions.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}

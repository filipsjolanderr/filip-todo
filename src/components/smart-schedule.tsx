"use client"

import * as React from "react"
import { Clock, Flag, Zap, Coffee, Brain, Utensils, Edit2, Check, X, CalendarDays, Settings } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"

interface Todo {
    id: string
    title: string
    description?: string | null
    completed: boolean
    priority: string
    dueDate?: Date | null
    estimatedTime?: number | null
    project?: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
}

interface ScheduleItem {
    id: string
    type: "task" | "break" | "meal"
    title: string
    startTime: string
    endTime: string
    duration: number
    priority?: "low" | "medium" | "high" | "urgent"
    project?: string
    icon?: React.ReactNode
}

interface ScheduleConfig {
    startTime: string
    endTime: string
    lunchTime: string
    lunchDuration: number
    breakDuration: number
    longBreakDuration: number
    includeMorningRoutine: boolean
    morningRoutineDuration: number
    maxTasksPerDay: number
    energyOptimization: boolean
}

const priorityColors = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
}

const priorityIcons = {
    low: "🟢",
    medium: "🟡",
    high: "🟠",
    urgent: "🔴",
}

const defaultConfig: ScheduleConfig = {
    startTime: "08:00",
    endTime: "17:00",
    lunchTime: "12:00",
    lunchDuration: 60,
    breakDuration: 10,
    longBreakDuration: 15,
    includeMorningRoutine: true,
    morningRoutineDuration: 15,
    maxTasksPerDay: 8,
    energyOptimization: true,
}

export function SmartSchedule({ todos }: { todos: Todo[] }) {
    const [config, setConfig] = React.useState<ScheduleConfig>(defaultConfig)
    const [isConfigOpen, setIsConfigOpen] = React.useState(false)

    // Generate optimized schedule with smart algorithms
    const optimizedSchedule = React.useMemo(() => {
        const incompleteTasks = todos.filter((todo) => !todo.completed)
        const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 }

        // Enhanced sorting with multiple factors
        const sortedTasks = [...incompleteTasks].sort((a, b) => {
            // Primary: Priority
            if (a.priority !== b.priority) {
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
            }

            // Secondary: Due date proximity
            if (a.dueDate && b.dueDate) {
                const aDue = new Date(a.dueDate)
                const bDue = new Date(b.dueDate)
                const today = new Date()
                const aDaysUntil = Math.ceil((aDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                const bDaysUntil = Math.ceil((bDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                return aDaysUntil - bDaysUntil
            }

            // Tertiary: Estimated time (shorter tasks first for better flow)
            return (a.estimatedTime || 30) - (b.estimatedTime || 30)
        })

        const schedule: ScheduleItem[] = []
        let currentTime = parseTime(config.startTime)
        const endTime = parseTime(config.endTime)
        const lunchTime = parseTime(config.lunchTime)

        // Add morning routine if enabled
        if (config.includeMorningRoutine) {
            schedule.push({
                id: "morning-routine",
                type: "break",
                title: "Morning Coffee & Planning",
                startTime: formatTime(currentTime),
                endTime: formatTime(addMinutes(currentTime, config.morningRoutineDuration)),
                duration: config.morningRoutineDuration,
                icon: <Coffee className="h-4 w-4" />,
            })
            currentTime = addMinutes(currentTime, config.morningRoutineDuration)
        }

        let taskCount = 0
        let consecutiveTaskTime = 0
        const unscheduledTasks: typeof sortedTasks = []

        // First pass: try to schedule high/urgent tasks in peak hours if energy optimization is on
        for (const task of sortedTasks) {
            if (taskCount >= config.maxTasksPerDay) break
            if (currentTime >= endTime) break

            const duration = task.estimatedTime || 30
            const priority = task.priority as "low" | "medium" | "high" | "urgent"
            const hour = currentTime.getHours()
            const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)

            // Check if we need lunch break
            if (currentTime >= lunchTime && currentTime < addMinutes(lunchTime, config.lunchDuration)) {
                schedule.push({
                    id: "lunch",
                    type: "meal",
                    title: "Lunch Break",
                    startTime: formatTime(lunchTime),
                    endTime: formatTime(addMinutes(lunchTime, config.lunchDuration)),
                    duration: config.lunchDuration,
                    icon: <Utensils className="h-4 w-4" />,
                })
                currentTime = addMinutes(lunchTime, config.lunchDuration)
                consecutiveTaskTime = 0
            }

            if (
                config.energyOptimization &&
                (priority === "urgent" || priority === "high") &&
                !isPeakHour
            ) {
                // Defer scheduling this task for now
                unscheduledTasks.push(task)
                continue
            }

            // Add task
            schedule.push({
                id: task.id,
                type: "task",
                title: task.title,
                startTime: formatTime(currentTime),
                endTime: formatTime(addMinutes(currentTime, duration)),
                duration,
                priority,
                project: task.project || undefined,
                icon: <Brain className="h-4 w-4" />,
            })
            currentTime = addMinutes(currentTime, duration)
            consecutiveTaskTime += duration
            taskCount++

            // Smart break scheduling
            if (consecutiveTaskTime >= 90) {
                schedule.push({
                    id: `long-break-${task.id}`,
                    type: "break",
                    title: "Long Break",
                    startTime: formatTime(currentTime),
                    endTime: formatTime(addMinutes(currentTime, config.longBreakDuration)),
                    duration: config.longBreakDuration,
                    icon: <Coffee className="h-4 w-4" />,
                })
                currentTime = addMinutes(currentTime, config.longBreakDuration)
                consecutiveTaskTime = 0
            } else if (duration >= 60) {
                schedule.push({
                    id: `break-${task.id}`,
                    type: "break",
                    title: "Short Break",
                    startTime: formatTime(currentTime),
                    endTime: formatTime(addMinutes(currentTime, config.breakDuration)),
                    duration: config.breakDuration,
                    icon: <Coffee className="h-4 w-4" />,
                })
                currentTime = addMinutes(currentTime, config.breakDuration)
                consecutiveTaskTime = 0
            }
        }

        // Second pass: schedule any deferred high/urgent tasks (or any unscheduled tasks)
        for (const task of unscheduledTasks) {
            if (taskCount >= config.maxTasksPerDay) break
            if (currentTime >= endTime) break

            const duration = task.estimatedTime || 30
            const priority = task.priority as "low" | "medium" | "high" | "urgent"

            // Check if we need lunch break
            if (currentTime >= lunchTime && currentTime < addMinutes(lunchTime, config.lunchDuration)) {
                schedule.push({
                    id: "lunch",
                    type: "meal",
                    title: "Lunch Break",
                    startTime: formatTime(lunchTime),
                    endTime: formatTime(addMinutes(lunchTime, config.lunchDuration)),
                    duration: config.lunchDuration,
                    icon: <Utensils className="h-4 w-4" />,
                })
                currentTime = addMinutes(lunchTime, config.lunchDuration)
                consecutiveTaskTime = 0
            }

            // Add task
            schedule.push({
                id: task.id,
                type: "task",
                title: task.title,
                startTime: formatTime(currentTime),
                endTime: formatTime(addMinutes(currentTime, duration)),
                duration,
                priority,
                project: task.project || undefined,
                icon: <Brain className="h-4 w-4" />,
            })
            currentTime = addMinutes(currentTime, duration)
            consecutiveTaskTime += duration
            taskCount++

            // Smart break scheduling
            if (consecutiveTaskTime >= 90) {
                schedule.push({
                    id: `long-break-${task.id}`,
                    type: "break",
                    title: "Long Break",
                    startTime: formatTime(currentTime),
                    endTime: formatTime(addMinutes(currentTime, config.longBreakDuration)),
                    duration: config.longBreakDuration,
                    icon: <Coffee className="h-4 w-4" />,
                })
                currentTime = addMinutes(currentTime, config.longBreakDuration)
                consecutiveTaskTime = 0
            } else if (duration >= 60) {
                schedule.push({
                    id: `break-${task.id}`,
                    type: "break",
                    title: "Short Break",
                    startTime: formatTime(currentTime),
                    endTime: formatTime(addMinutes(currentTime, config.breakDuration)),
                    duration: config.breakDuration,
                    icon: <Coffee className="h-4 w-4" />,
                })
                currentTime = addMinutes(currentTime, config.breakDuration)
                consecutiveTaskTime = 0
            }
        }

        return schedule
    }, [todos, config])

    const updateConfig = (updates: Partial<ScheduleConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }))
    }

    const totalScheduledTime = optimizedSchedule.reduce((sum, item) => sum + item.duration, 0)
    const taskCount = optimizedSchedule.filter(item => item.type === "task").length

    return (
        <Card className="h-full mt-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        <CardTitle>Smart Schedule</CardTitle>
                    </div>
                    <Popover open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="space-y-4">
                                <h4 className="font-medium">Schedule Settings</h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Start Time</Label>
                                        <Input
                                            type="time"
                                            value={config.startTime}
                                            onChange={(e) => updateConfig({ startTime: e.target.value })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">End Time</Label>
                                        <Input
                                            type="time"
                                            value={config.endTime}
                                            onChange={(e) => updateConfig({ endTime: e.target.value })}
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Lunch Time</Label>
                                        <Input
                                            type="time"
                                            value={config.lunchTime}
                                            onChange={(e) => updateConfig({ lunchTime: e.target.value })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Lunch Duration (min)</Label>
                                        <Input
                                            type="number"
                                            value={config.lunchDuration}
                                            onChange={(e) => updateConfig({ lunchDuration: parseInt(e.target.value) || 60 })}
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Break Duration (min)</Label>
                                        <Input
                                            type="number"
                                            value={config.breakDuration}
                                            onChange={(e) => updateConfig({ breakDuration: parseInt(e.target.value) || 10 })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Long Break (min)</Label>
                                        <Input
                                            type="number"
                                            value={config.longBreakDuration}
                                            onChange={(e) => updateConfig({ longBreakDuration: parseInt(e.target.value) || 15 })}
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Max Tasks/Day</Label>
                                        <Input
                                            type="number"
                                            value={config.maxTasksPerDay}
                                            onChange={(e) => updateConfig({ maxTasksPerDay: parseInt(e.target.value) || 8 })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Morning Routine (min)</Label>
                                        <Input
                                            type="number"
                                            value={config.morningRoutineDuration}
                                            onChange={(e) => updateConfig({ morningRoutineDuration: parseInt(e.target.value) || 15 })}
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Include Morning Routine</Label>
                                        <Switch
                                            checked={config.includeMorningRoutine}
                                            onCheckedChange={(checked) => updateConfig({ includeMorningRoutine: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Energy Optimization</Label>
                                        <Switch
                                            checked={config.energyOptimization}
                                            onCheckedChange={(checked) => updateConfig({ energyOptimization: checked })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>AI-optimized based on priority, energy levels, and task complexity</span>
                    <div className="flex items-center gap-4 text-xs">
                        <span>{taskCount} tasks</span>
                        <span>{Math.round(totalScheduledTime / 60)}h {totalScheduledTime % 60}m</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 overflow-auto max-h-[calc(100vh-200px)]">
                {optimizedSchedule.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No tasks to schedule</p>
                        <p className="text-xs">Add some tasks to see your optimized schedule</p>
                    </div>
                ) : (
                    optimizedSchedule.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:shadow-xs ${item.type === "task"
                                    ? "bg-background border"
                                    : item.type === "break"
                                        ? "bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-100"
                                        : "bg-green-50 border border-green-200 text-green-900 dark:bg-green-900/40 dark:border-green-500 dark:text-green-100"
                                    }`}
                            >
                                <div className="flex flex-col items-center text-xs text-muted-foreground min-w-[60px]">
                                    <span className="font-medium">{item.startTime}</span>
                                    <span>↓</span>
                                    <span>{item.endTime}</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {item.icon}
                                        <span className="font-medium">{item.title}</span>
                                        {item.priority && (
                                            <Badge variant="outline" className={`text-xs ${priorityColors[item.priority]}`}>
                                                {priorityIcons[item.priority]}
                                            </Badge>
                                        )}
                                        {item.project && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.project}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.duration} minutes</div>
                                </div>
                            </div>
                            {index < optimizedSchedule.length - 1 && (
                                <div className="flex justify-center py-1">
                                    <div className="w-px h-4 bg-border"></div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}

// Utility functions
function parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

function addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + minutes)
    return newDate
} 

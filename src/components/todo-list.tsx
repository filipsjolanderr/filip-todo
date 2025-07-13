"use client"

import * as React from "react"
import { Clock, Flag, Plus, Zap, Coffee, Brain, Utensils, Edit2, Check, X, CalendarDays } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { useLocalStorage } from "~/hooks/use-local-storage"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  dueDate?: string
  estimatedTime?: number
  project?: string
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

const projects = [
  "Work",
  "Website Redesign",
  "Marketing Campaign",
  "Home Renovation",
  "Learning Spanish",
  "Fitness Goals",
  "Personal",
]

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", [
    {
      id: "1",
      text: "Review quarterly reports",
      completed: false,
      priority: "high",
      dueDate: "2024-01-15",
      estimatedTime: 60,
      project: "Work",
    },
    {
      id: "2",
      text: "Call dentist for appointment",
      completed: false,
      priority: "medium",
      estimatedTime: 15,
    },
    {
      id: "3",
      text: "Buy groceries for dinner",
      completed: true,
      priority: "low",
      estimatedTime: 30,
    },
    {
      id: "4",
      text: "Finish website redesign mockups",
      completed: false,
      priority: "urgent",
      dueDate: "2024-01-14",
      estimatedTime: 120,
      project: "Website Redesign",
    },
    {
      id: "5",
      text: "Exercise - 30 min cardio",
      completed: false,
      priority: "medium",
      estimatedTime: 30,
      project: "Fitness Goals",
    },
    {
      id: "6",
      text: "Prepare presentation slides",
      completed: false,
      priority: "high",
      estimatedTime: 90,
      project: "Work",
    },
    {
      id: "7",
      text: "Team standup meeting",
      completed: false,
      priority: "medium",
      estimatedTime: 30,
      project: "Work",
    },
  ])

  const [newTodo, setNewTodo] = React.useState("")
  const [newPriority, setNewPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium")
  const [newEstimatedTime, setNewEstimatedTime] = React.useState("30")
  const [newDueDate, setNewDueDate] = React.useState("")
  const [newProject, setNewProject] = React.useState("")
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: newPriority,
        estimatedTime: Number.parseInt(newEstimatedTime) || 30,
        dueDate: newDueDate || undefined,
        project: newProject || undefined,
      }
      setTodos([todo, ...todos])
      setNewTodo("")
      setNewPriority("medium")
      setNewEstimatedTime("30")
      setNewDueDate("")
      setNewProject("")
      setShowAdvanced(false)
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  // Sort todos by priority and completion status
  const sortedTodos = React.useMemo(() => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [todos])

  // Generate optimized schedule
  const optimizedSchedule = React.useMemo(() => {
    const incompleteTasks = todos.filter((todo) => !todo.completed)
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }

    // Sort by priority and due date
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return 0
    })

    const schedule: ScheduleItem[] = []
    let currentTime = new Date()
    currentTime.setHours(8, 0, 0, 0) // Start at 8 AM

    // Add morning routine
    schedule.push({
      id: "morning-coffee",
      type: "break",
      title: "Morning Coffee & Planning",
      startTime: formatTime(currentTime),
      endTime: formatTime(addMinutes(currentTime, 15)),
      duration: 15,
      icon: <Coffee className="h-4 w-4" />,
    })
    currentTime = addMinutes(currentTime, 15)

    // Schedule high-priority tasks in the morning (peak focus time)
    const morningTasks = sortedTasks
      .filter((task) => task.priority === "urgent" || task.priority === "high")
      .slice(0, 2)

    morningTasks.forEach((task) => {
      const duration = task.estimatedTime || 30
      schedule.push({
        id: task.id,
        type: "task",
        title: task.text,
        startTime: formatTime(currentTime),
        endTime: formatTime(addMinutes(currentTime, duration)),
        duration,
        priority: task.priority,
        project: task.project,
        icon: <Brain className="h-4 w-4" />,
      })
      currentTime = addMinutes(currentTime, duration)

      // Add short break after long tasks
      if (duration >= 60) {
        schedule.push({
          id: `break-${task.id}`,
          type: "break",
          title: "Short Break",
          startTime: formatTime(currentTime),
          endTime: formatTime(addMinutes(currentTime, 10)),
          duration: 10,
          icon: <Coffee className="h-4 w-4" />,
        })
        currentTime = addMinutes(currentTime, 10)
      }
    })

    // Lunch break
    if (currentTime.getHours() >= 12) {
      schedule.push({
        id: "lunch",
        type: "meal",
        title: "Lunch Break",
        startTime: formatTime(currentTime),
        endTime: formatTime(addMinutes(currentTime, 60)),
        duration: 60,
        icon: <Utensils className="h-4 w-4" />,
      })
      currentTime = addMinutes(currentTime, 60)
    }

    // Schedule remaining tasks
    const remainingTasks = sortedTasks.filter((task) => !morningTasks.includes(task))

    remainingTasks.forEach((task) => {
      const duration = task.estimatedTime || 30
      schedule.push({
        id: task.id,
        type: "task",
        title: task.text,
        startTime: formatTime(currentTime),
        endTime: formatTime(addMinutes(currentTime, duration)),
        duration,
        priority: task.priority,
        project: task.project,
      })
      currentTime = addMinutes(currentTime, duration)

      // Add buffer time between tasks
      if (duration >= 30) {
        currentTime = addMinutes(currentTime, 5)
      }
    })

    return schedule
  }, [todos])

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalTime = todos.filter((todo) => !todo.completed).reduce((sum, todo) => sum + (todo.estimatedTime || 0), 0)

  return (
    <div className="flex flex-1 gap-6 p-6">
      {/* Left Half - Todo List */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Today's Tasks</h1>
            <p className="text-muted-foreground">
              {todos.length - completedCount} tasks remaining • {Math.floor(totalTime / 60)}h {totalTime % 60}m
              estimated
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Zap className="h-4 w-4" />
            Re-optimize
          </Button>
        </div>

        {/* Add Todo Form */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button onClick={addTodo}>Add Task</Button>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low</SelectItem>
                        <SelectItem value="medium">🟡 Medium</SelectItem>
                        <SelectItem value="high">🟠 High</SelectItem>
                        <SelectItem value="urgent">🔴 Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Estimated Time (minutes)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={newEstimatedTime}
                      onChange={(e) => setNewEstimatedTime(e.target.value)}
                      placeholder="30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select value={newProject} onValueChange={setNewProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project} value={project}>
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <div className="space-y-2 flex-1 overflow-auto">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              onToggle={() => toggleTodo(todo.id)}
              onEdit={() => setEditingId(todo.id)}
              onSave={(updates) => {
                updateTodo(todo.id, updates)
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>

        {/* Progress Summary */}
        {todos.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <div className="flex items-center gap-2">
                <span>
                  {completedCount}/{todos.length} completed
                </span>
                {completedCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                    onClick={clearCompleted}
                  >
                    Clear completed
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-2 w-full bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / todos.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Half - Optimized Schedule */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Today's Optimized Schedule
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-optimized based on priority, energy levels, and task complexity
            </p>
          </CardHeader>
          <CardContent className="space-y-3 overflow-auto max-h-[calc(100vh-200px)]">
            {optimizedSchedule.map((item, index) => (
              <div key={item.id}>
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:shadow-xs ${item.type === "task"
                      ? "bg-background border"
                      : item.type === "break"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                >
                  <div className="flex flex-col items-center text-xs text-muted-foreground min-w-[60px]">
                    <span className="font-medium">{item.startTime}</span>
                    <span>↓</span>
                    <span>{item.endTime}</span>
                  </div>

                  <div className="flex-1 min-w-0">
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// TodoItem Component for inline editing
function TodoItem({
  todo,
  isEditing,
  onToggle,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  todo: Todo
  isEditing: boolean
  onToggle: () => void
  onEdit: () => void
  onSave: (updates: Partial<Todo>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [editText, setEditText] = React.useState(todo.text)
  const [editPriority, setEditPriority] = React.useState(todo.priority)
  const [editTime, setEditTime] = React.useState(todo.estimatedTime?.toString() || "30")
  const [editDueDate, setEditDueDate] = React.useState(todo.dueDate || "")
  const [editProject, setEditProject] = React.useState(todo.project || "")

  const handleSave = () => {
    onSave({
      text: editText,
      priority: editPriority,
      estimatedTime: Number.parseInt(editTime) || 30,
      dueDate: editDueDate || undefined,
      project: editProject || undefined,
    })
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditTime(todo.estimatedTime?.toString() || "30")
    setEditDueDate(todo.dueDate || "")
    setEditProject(todo.project || "")
    onCancel()
  }

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg border bg-background space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox checked={todo.completed} onCheckedChange={onToggle} />
          <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1" autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-3 ml-6">
          <div className="space-y-1">
            <Label className="text-xs">Priority</Label>
            <Select value={editPriority} onValueChange={(value: any) => setEditPriority(value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Time (min)</Label>
            <Input type="number" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="h-8" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Due Date</Label>
            <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="h-8" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Project</Label>
            <Select value={editProject} onValueChange={setEditProject}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 ml-6">
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-xs group ${todo.completed ? "bg-muted/50 opacity-60" : "bg-background"
        }`}
    >
      <Checkbox checked={todo.completed} onCheckedChange={onToggle} className="mt-0.5" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
          <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority]}`}>
            {priorityIcons[todo.priority]} {todo.priority}
          </Badge>
          {todo.project && (
            <Badge variant="secondary" className="text-xs">
              {todo.project}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {todo.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {todo.estimatedTime}m
            </div>
          )}
          {todo.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(todo.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onEdit}>
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Flag className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Helper functions
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

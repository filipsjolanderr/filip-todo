"use client"

import * as React from "react"
import { Calendar, Clock, Flag, Plus, Zap } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  dueDate?: string
  estimatedTime?: number
  project?: string
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

export function TodoList() {
  const [todos, setTodos] = React.useState<Todo[]>([
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
  ])

  const [newTodo, setNewTodo] = React.useState("")
  const [newPriority, setNewPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium")

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: newPriority,
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
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

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalTime = todos.filter((todo) => !todo.completed).reduce((sum, todo) => sum + (todo.estimatedTime || 0), 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-muted-foreground">
            {todos.length - completedCount} tasks remaining • {Math.floor(totalTime / 60)}h {totalTime % 60}m estimated
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Zap className="h-4 w-4" />
          AI Optimize Day
        </Button>
      </div>

      {/* Add Todo Input */}
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
            <SelectTrigger className="w-32">
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
        <Button onClick={addTodo} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {sortedTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-sm ${
              todo.completed ? "bg-muted/50 opacity-60" : "bg-background"
            }`}
          >
            <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-0.5" />

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
                    <Calendar className="h-3 w-3" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Flag className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      {todos.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>
              {completedCount}/{todos.length} completed
            </span>
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
  )
}

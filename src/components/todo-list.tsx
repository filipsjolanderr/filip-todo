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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "~/components/ui/resizable"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getCategories,
  createCategory,
  type TodoInput,
  type TodoUpdateInput
} from "~/lib/todo-actions"
import { toast } from "sonner"
import { SmartSchedule } from "~/components/smart-schedule"

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
  const queryClient = useQueryClient()

  // Query for todos
  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })

  // Query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Mutations
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create todo')
      console.error('Create todo error:', error)
    }
  })

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update todo')
      console.error('Update todo error:', error)
    }
  })

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete todo')
      console.error('Delete todo error:', error)
    }
  })

  const toggleTodoMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      toast.error('Failed to toggle todo')
      console.error('Toggle todo error:', error)
    }
  })

  const [newTodo, setNewTodo] = React.useState("")
  const [newPriority, setNewPriority] = React.useState<string>("medium")
  const [newEstimatedTime, setNewEstimatedTime] = React.useState("30")
  const [newDueDate, setNewDueDate] = React.useState("")
  const [newProject, setNewProject] = React.useState("")
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)

  // Sort todos by priority and completion status
  const sortedTodos = React.useMemo(() => {
    const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 }
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    })
  }, [todos])



  const addTodo = () => {
    if (newTodo.trim()) {
      const todoInput: TodoInput = {
        title: newTodo.trim(),
        priority: newPriority as "low" | "medium" | "high" | "urgent",
        estimatedTime: Number.parseInt(newEstimatedTime) || 30,
        dueDate: newDueDate || undefined,
        project: newProject || undefined,
      }

      createTodoMutation.mutate({ data: todoInput })

      setNewTodo("")
      setNewPriority("medium")
      setNewEstimatedTime("30")
      setNewDueDate("")
      setNewProject("")
      setShowAdvanced(false)
    }
  }

  const handleToggleTodo = (id: string) => {
    toggleTodoMutation.mutate({ data: id })
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate({ data: id })
  }

  const handleUpdateTodo = (id: string, updates: TodoUpdateInput) => {
    updateTodoMutation.mutate({ data: { id, ...updates } })
  }

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed)
    completedTodos.forEach(todo => {
      deleteTodoMutation.mutate({ data: todo.id })
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  // Now we can have conditional returns after all hooks are called
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading todos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading todos: {error.message}</div>
      </div>
    )
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalTime = todos.filter((todo) => !todo.completed).reduce((sum, todo) => sum + (todo.estimatedTime || 0), 0)

  return (
    <div className="h-full p-6">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="space-y-6 h-full">
            {/* Add Todo Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <Button
                      onClick={addTodo}
                      disabled={createTodoMutation.isPending}
                    >
                      {createTodoMutation.isPending ? 'Adding...' : 'Add Task'}
                    </Button>
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
                  onToggle={() => handleToggleTodo(todo.id)}
                  onEdit={() => setEditingId(todo.id)}
                  onSave={(updates) => {
                    handleUpdateTodo(todo.id, updates)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  isUpdating={updateTodoMutation.isPending}
                  isDeleting={deleteTodoMutation.isPending}
                />
              ))}
            </div>

            {/* Progress Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-xs text-muted-foreground">
                      {completedCount} of {todos.length} tasks completed
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium">Total Time</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(totalTime / 60)}h {totalTime % 60}m remaining
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Completion</span>
                    <span>{todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                {completedCount > 0 && (
                  <Button
                    onClick={clearCompleted}
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Clear Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="mx-4" />

        <ResizablePanel defaultSize={40} minSize={25}>
          <SmartSchedule todos={todos} />
        </ResizablePanel>
      </ResizablePanelGroup>
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
  isUpdating,
  isDeleting,
}: {
  todo: Todo
  isEditing: boolean
  onToggle: () => void
  onEdit: () => void
  onSave: (updates: TodoUpdateInput) => void
  onCancel: () => void
  onDelete: () => void
  isUpdating: boolean
  isDeleting: boolean
}) {
  const [editText, setEditText] = React.useState("")
  const [editPriority, setEditPriority] = React.useState<string>("medium")
  const [editTime, setEditTime] = React.useState("30")
  const [editDueDate, setEditDueDate] = React.useState("")
  const [editProject, setEditProject] = React.useState("")

  // Update state when todo changes or when entering edit mode
  React.useEffect(() => {
    if (isEditing) {
      setEditText(todo.title)
      setEditPriority(todo.priority)
      setEditTime(todo.estimatedTime?.toString() || "30")
      setEditDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : "")
      setEditProject(todo.project || "")
    }
  }, [todo, isEditing])

  const handleSave = () => {
    onSave({
      title: editText,
      priority: editPriority as "low" | "medium" | "high" | "urgent",
      estimatedTime: Number.parseInt(editTime) || 30,
      dueDate: editDueDate || undefined,
      project: editProject || undefined,
    })
  }

  const handleCancel = () => {
    // Reset to current todo values
    setEditText(todo.title)
    setEditPriority(todo.priority)
    setEditTime(todo.estimatedTime?.toString() || "30")
    setEditDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : "")
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

        <div className="flex gap-2 ml-6">
          <Button onClick={handleSave} size="sm" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : <Check className="h-4 w-4" />}
          </Button>
          <Button onClick={handleCancel} variant="outline" size="sm">
            <X className="h-4 w-4" />
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
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        className="mt-0.5"
        disabled={isUpdating}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.title}</span>
          <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority as keyof typeof priorityColors]}`}>
            {priorityIcons[todo.priority as keyof typeof priorityIcons]} {todo.priority}
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
        <Button onClick={onEdit} variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={onDelete}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          disabled={isDeleting}
        >
          {isDeleting ? '...' : <X className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

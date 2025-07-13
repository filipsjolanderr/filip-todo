import { createServerFn } from '@tanstack/react-start'
import { eq, and, gte, lt, or, isNull, lte } from 'drizzle-orm'
import { db } from './db/db'
import { todos, categories, todoCategories } from './db/schema'
import { auth } from './auth'
import { getWebRequest } from '@tanstack/react-start/server'

export type TodoInput = {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string
    estimatedTime?: number
    project?: string
    categoryIds?: string[]
}

export type TodoUpdateInput = Partial<TodoInput> & {
    completed?: boolean
}

export const getAuthUser = createServerFn({ method: "GET" }).handler(
    async () => {
        const request = getWebRequest()
        if (!request?.headers) {
            return null
        }
        const session = await auth.api.getSession({
            headers: request.headers,
        })
        return session?.user
    },
)

// Get all todos for the current user
export const getTodos = createServerFn()
    .handler(async () => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const userTodos = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, user.id))
            .orderBy(todos.createdAt)

        return userTodos
    })

// Create a new todo
export const createTodo = createServerFn()
    .validator((d: TodoInput) => d)
    .handler(async ({ data }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const [newTodo] = await db
            .insert(todos)
            .values({
                title: data.title,
                description: data.description,
                priority: data.priority || 'medium',
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                estimatedTime: data.estimatedTime,
                project: data.project,
                userId: user.id,
            })
            .returning()

        // Add categories if provided
        if (data.categoryIds && data.categoryIds.length > 0) {
            const categoryInserts = data.categoryIds.map(categoryId => ({
                todoId: newTodo.id,
                categoryId,
            }))

            await db.insert(todoCategories).values(categoryInserts)
        }

        return newTodo
    })

// Update a todo
export const updateTodo = createServerFn()
    .validator((d: { id: string } & TodoUpdateInput) => d)
    .handler(async ({ data }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const { id, categoryIds, ...updateData } = data

        // Verify the todo belongs to the user
        const existingTodo = await db
            .select()
            .from(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
            .limit(1)

        if (!existingTodo.length) {
            throw new Error('Todo not found')
        }

        const [updatedTodo] = await db
            .update(todos)
            .set({
                ...updateData,
                dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
                updatedAt: new Date(),
            })
            .where(eq(todos.id, id))
            .returning()

        // Update categories if provided
        if (categoryIds !== undefined) {
            // Remove existing categories
            await db
                .delete(todoCategories)
                .where(eq(todoCategories.todoId, id))

            // Add new categories
            if (categoryIds.length > 0) {
                const categoryInserts = categoryIds.map(categoryId => ({
                    todoId: id,
                    categoryId,
                }))

                await db.insert(todoCategories).values(categoryInserts)
            }
        }

        return updatedTodo
    })

// Delete a todo
export const deleteTodo = createServerFn()
    .validator((d: string) => d)
    .handler(async ({ data: id }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify the todo belongs to the user
        const existingTodo = await db
            .select()
            .from(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
            .limit(1)

        if (!existingTodo.length) {
            throw new Error('Todo not found')
        }

        await db.delete(todos).where(eq(todos.id, id))
        return { success: true }
    })

// Toggle todo completion
export const toggleTodo = createServerFn()
    .validator((d: string) => d)
    .handler(async ({ data: id }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        // Get current todo
        const existingTodo = await db
            .select()
            .from(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
            .limit(1)

        if (!existingTodo.length) {
            throw new Error('Todo not found')
        }

        const [updatedTodo] = await db
            .update(todos)
            .set({
                completed: !existingTodo[0].completed,
                updatedAt: new Date(),
            })
            .where(eq(todos.id, id))
            .returning()

        return updatedTodo
    })

// Get categories for the current user
export const getCategories = createServerFn()
    .handler(async () => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const userCategories = await db
            .select()
            .from(categories)
            .where(eq(categories.userId, user.id))
            .orderBy(categories.name)

        return userCategories
    })

// Create a new category
export const createCategory = createServerFn()
    .validator((d: { name: string; color?: string }) => d)
    .handler(async ({ data }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const [newCategory] = await db
            .insert(categories)
            .values({
                name: data.name,
                color: data.color,
                userId: user.id,
            })
            .returning()

        return newCategory
    })

// Get sidebar data (todo counts, projects, etc.)
export const getSidebarData = createServerFn()
    .handler(async () => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        // Get all todos for the user
        const userTodos = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, user.id))

        // Calculate counts
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const inboxCount = userTodos.filter(todo => !todo.completed).length
        const todayCount = userTodos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate >= today &&
            todo.dueDate < tomorrow
        ).length
        const upcomingCount = userTodos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate >= tomorrow
        ).length
        const completedCount = userTodos.filter(todo => todo.completed).length

        // Get unique projects
        const projects = userTodos
            .filter(todo => todo.project && !todo.completed)
            .reduce((acc, todo) => {
                if (!acc.find(p => p.name === todo.project)) {
                    acc.push({
                        name: todo.project!,
                        tasks: userTodos.filter(t => t.project === todo.project && !t.completed).length
                    })
                }
                return acc
            }, [] as { name: string; tasks: number }[])

        // Smart lists
        const highPriorityCount = userTodos.filter(todo =>
            !todo.completed &&
            (todo.priority === 'high' || todo.priority === 'urgent')
        ).length

        const overdueCount = userTodos.filter(todo =>
            !todo.completed &&
            todo.dueDate &&
            todo.dueDate < today
        ).length

        const quickTasksCount = userTodos.filter(todo =>
            !todo.completed &&
            (!todo.estimatedTime || todo.estimatedTime <= 15)
        ).length

        const waitingForCount = userTodos.filter(todo =>
            !todo.completed &&
            todo.title.toLowerCase().includes('waiting') ||
            todo.title.toLowerCase().includes('follow up')
        ).length

        return {
            inboxCount,
            todayCount,
            upcomingCount,
            completedCount,
            projects,
            smartLists: {
                highPriority: highPriorityCount,
                overdue: overdueCount,
                quickTasks: quickTasksCount,
                waitingFor: waitingForCount
            }
        }
    })

// Get todos filtered by various criteria
export const getTodosByFilter = createServerFn()
    .validator((d: { filter: string; value?: string }) => d)
    .handler(async ({ data }) => {
        const user = await getAuthUser()
        if (!user?.id) {
            throw new Error('Unauthorized')
        }

        const { filter, value } = data

        switch (filter) {
            case 'today':
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)

                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            gte(todos.dueDate, today),
                            lt(todos.dueDate, tomorrow)
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'upcoming':
                const tomorrowStart = new Date()
                tomorrowStart.setDate(tomorrowStart.getDate() + 1)
                tomorrowStart.setHours(0, 0, 0, 0)

                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            gte(todos.dueDate, tomorrowStart)
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'completed':
                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            eq(todos.completed, true)
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'project':
                if (!value) throw new Error('Project name required')
                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            eq(todos.project, value)
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'high-priority':
                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            eq(todos.completed, false),
                            or(eq(todos.priority, 'high'), eq(todos.priority, 'urgent'))
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'overdue':
                const now = new Date()
                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            eq(todos.completed, false),
                            lt(todos.dueDate, now)
                        )
                    )
                    .orderBy(todos.createdAt)

            case 'quick-tasks':
                return await db
                    .select()
                    .from(todos)
                    .where(
                        and(
                            eq(todos.userId, user.id),
                            eq(todos.completed, false),
                            or(lte(todos.estimatedTime, 15), isNull(todos.estimatedTime))
                        )
                    )
                    .orderBy(todos.createdAt)

            default:
                // Return all todos (inbox)
                return await db
                    .select()
                    .from(todos)
                    .where(eq(todos.userId, user.id))
                    .orderBy(todos.createdAt)
        }
    }) 

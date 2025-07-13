import { createServerFileRoute } from '@tanstack/react-start/server'
import { db } from '~/lib/db/db'
import { todos } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '~/lib/auth'

export const ServerRoute = createServerFileRoute('/api/todos').methods({
    GET: async ({ request }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })
        if (!session?.user?.id) {
            return new Response('Unauthorized', { status: 401 })
        }

        try {
            const userTodos = await db
                .select()
                .from(todos)
                .where(eq(todos.userId, session.user.id))
                .orderBy(todos.createdAt)

            return new Response(JSON.stringify(userTodos), {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.error('Error fetching todos:', error)
            return new Response('Internal Server Error', { status: 500 })
        }
    },

    POST: async ({ request }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })
        if (!session?.user?.id) {
            return new Response('Unauthorized', { status: 401 })
        }

        try {
            const body = await request.json()
            const { title, description, priority, dueDate, estimatedTime, project } = body

            const [newTodo] = await db
                .insert(todos)
                .values({
                    title,
                    description,
                    priority: priority || 'medium',
                    dueDate: dueDate ? new Date(dueDate) : null,
                    estimatedTime,
                    project,
                    userId: session.user.id,
                })
                .returning()

            return new Response(JSON.stringify(newTodo), {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.error('Error creating todo:', error)
            return new Response('Internal Server Error', { status: 500 })
        }
    }
}) 

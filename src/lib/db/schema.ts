import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

// Users table (Better Auth will handle this, but we can extend it)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Todos table
export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  color: text('color'),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Todo categories junction table
export const todoCategories = pgTable('todo_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  todoId: uuid('todo_id').references(() => todos.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
}); 
import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (managed by Better Auth)
export const users = pgTable("users", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  color: text("color"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Todos table
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  priority: text("priority").default("medium").notNull(), // low, medium, high, urgent
  dueDate: timestamp("due_date"),
  estimatedTime: integer("estimated_time"), // in minutes
  project: text("project"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Todo-Categories junction table
export const todoCategories = pgTable("todo_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  todoId: uuid("todo_id").notNull().references(() => todos.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  categories: many(categories),
}));

export const todosRelations = relations(todos, ({ one, many }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  todoCategories: many(todoCategories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  todoCategories: many(todoCategories),
}));

export const todoCategoriesRelations = relations(todoCategories, ({ one }) => ({
  todo: one(todos, {
    fields: [todoCategories.todoId],
    references: [todos.id],
  }),
  category: one(categories, {
    fields: [todoCategories.categoryId],
    references: [categories.id],
  }),
}));

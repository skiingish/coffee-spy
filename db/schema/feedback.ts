import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const feedback = pgTable('feedback', {
    id: serial('id').primaryKey(),
    message: varchar('message').notNull(),
    name: varchar('name'),
    contact: varchar('contact'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});
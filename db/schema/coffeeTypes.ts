import { pgTable, serial, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const coffeeTypes = pgTable('coffee-types', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
    milkType: varchar('milk_type'),
    size: varchar('size'),
    modifier: numeric('modifier'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});
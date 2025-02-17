import { pgTable, serial, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const venues = pgTable('venues', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
    address: varchar('address'),
    website: varchar('website'),
    latitude: numeric('latitude'),
    longitude: numeric('longitude'),
    created_at: timestamp('created_at').defaultNow(),
});
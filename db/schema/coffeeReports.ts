import { pgTable, bigint, timestamp, integer, doublePrecision, varchar, boolean, serial} from "drizzle-orm/pg-core";
import { coffeeTypes } from "./coffeeTypes";
import { venues } from "./venues";

export const coffeeReports = pgTable('coffee-reports', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    venue_id: integer('venue_id').notNull().references(() => venues.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    coffee_id: bigint('coffee_id', { mode: 'number' }).notNull().references(() => coffeeTypes.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    price: doublePrecision('price'),
    rating: doublePrecision('rating'),
    comments: varchar('comments'),
    hidden: boolean('hidden').notNull().default(false)
});
import { db } from '@/lib/db';
import { venues } from "@/db/schema/venues";
import { coffeeReports } from "@/db/schema/coffeeReports";
import { coffeeTypes } from "@/db/schema/coffeeTypes";
import { eq, and } from "drizzle-orm";

export async function getPrices(name: string, size: string, modifier?: string, hidden: boolean = false) {
    try {
        const conditions = [
            eq(coffeeTypes.name, name),
            eq(coffeeTypes.size, size),
            eq(coffeeReports.hidden, hidden)
        ];

        if (modifier) {
            conditions.push(eq(coffeeTypes.modifier, modifier));
        }

        const results = await db
            .select({
                venue_name: venues.name,
                venue_id: venues.id,
                coffee_id: coffeeTypes.id,
                price: coffeeReports.price,
                latitude: venues.latitude,
                longitude: venues.longitude,
                rating: coffeeReports.rating
            })
            .from(venues)
            .innerJoin(coffeeReports, eq(venues.id, coffeeReports.venue_id))
            .innerJoin(coffeeTypes, eq(coffeeReports.coffee_id, coffeeTypes.id))
            .where(and(...conditions));


        return { prices: results, error: null };
    } catch (error) {
        console.error('Error fetching latte prices:', error);
        return { prices: null, error: 'Failed to fetch prices' };
    }
}
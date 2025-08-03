'use server';
import { db } from '@/lib/db';
import { venues } from "@/db/schema/venues";
import { coffeeReports } from "@/db/schema/coffeeReports";
import { coffeeTypes } from "@/db/schema/coffeeTypes";
import { eq, and } from "drizzle-orm";

export async function getPrices(name: string, size: string, milkType?: string, modifier?: string, hidden: boolean = false) {
    try {
        const conditions = [
            eq(coffeeTypes.name, name),
            eq(coffeeTypes.size, size),
            eq(coffeeReports.hidden, hidden)
        ];

        if (milkType) {
            conditions.push(eq(coffeeTypes.milkType, milkType));
        }

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
                rating: coffeeReports.rating,
                created_at: coffeeReports.created_at,
            })
            .from(venues)
            .innerJoin(coffeeReports, eq(venues.id, coffeeReports.venue_id))
            .innerJoin(coffeeTypes, eq(coffeeReports.coffee_id, coffeeTypes.id))
            .where(and(...conditions));
        
        console.log('Fetched prices:', results);

        // Filter results to get only the latest entry per venue
        const latestPricesByVenue = Object.values(
            results.reduce((acc, item) => {
                if (!acc[item.venue_id] || new Date(item.created_at) > new Date(acc[item.venue_id].created_at)) {
                    acc[item.venue_id] = item;
                }
                return acc;
            }, {} as Record<number, typeof results[0]>)
        );

        // Replace results with filtered data
        results.length = 0;
        results.push(...latestPricesByVenue);

        console.log('Filtered prices:', results);

        return { prices: results, error: null };
    } catch (error) {
        console.error('Error fetching latte prices:', error);
        return { prices: null, error: 'Failed to fetch prices' };
    }
}
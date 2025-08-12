'use server';
import { db } from '@/lib/db';
import { venues } from "@/db/schema/venues";
import { coffeeReports } from "@/db/schema/coffeeReports";
import { coffeeTypes } from "@/db/schema/coffeeTypes";
import { eq, and, inArray } from "drizzle-orm";
import { 
    StandardCoffeeTypes, 
    SpecialtyCoffeeTypes,
    StandardMilkTypes,
    AlternativeMilkTypes,
    isCoffeeTypeStandard,
    isMilkTypeStandard,
    CoffeeType,
    CoffeeMilkType 
} from '@/types/coffeeTypes';

export async function getPricesGrouped(coffeeType: CoffeeType, size: string, milkType: CoffeeMilkType, modifier?: string, hidden: boolean = false) {
    try {
        // Determine which coffee group this selection belongs to
        const isStandardCoffee = isCoffeeTypeStandard(coffeeType);
        const isStandardMilk = isMilkTypeStandard(milkType);
        
        // Get all coffee types in the same group
        const coffeeGroup = isStandardCoffee 
            ? Object.values(StandardCoffeeTypes)
            : Object.values(SpecialtyCoffeeTypes);
            
        // Get all milk types in the same group
        const milkGroup = isStandardMilk
            ? Object.values(StandardMilkTypes)
            : Object.values(AlternativeMilkTypes);

        console.log('Searching for grouped prices:', {
            coffeeGroup,
            milkGroup,
            size,
            isStandardCoffee,
            isStandardMilk
        });

        const conditions = [
            inArray(coffeeTypes.name, coffeeGroup),
            inArray(coffeeTypes.milkType, milkGroup),
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
                rating: coffeeReports.rating,
                created_at: coffeeReports.created_at,
                coffee_name: coffeeTypes.name,
                milk_type: coffeeTypes.milkType,
            })
            .from(venues)
            .innerJoin(coffeeReports, eq(venues.id, coffeeReports.venue_id))
            .innerJoin(coffeeTypes, eq(coffeeReports.coffee_id, coffeeTypes.id))
            .where(and(...conditions));
        
        console.log('Fetched grouped prices:', results);

        // Filter results to get only the latest entry per venue
        const latestPricesByVenue = Object.values(
            results.reduce((acc, item) => {
                if (!acc[item.venue_id] || new Date(item.created_at) > new Date(acc[item.venue_id].created_at)) {
                    acc[item.venue_id] = item;
                }
                return acc;
            }, {} as Record<number, typeof results[0]>)
        );

        console.log('Filtered grouped prices:', latestPricesByVenue);

        return { prices: latestPricesByVenue, error: null };
    } catch (error) {
        console.error('Error fetching grouped prices:', error);
        return { prices: [], error: 'Failed to fetch prices' };
    }
}

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
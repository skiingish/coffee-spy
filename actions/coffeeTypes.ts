import { coffeeTypes } from '@/db/schema/coffeeTypes';
import { db } from '@/lib/db';

export async function getCoffeeTypes() {
    try {
        const allCoffeeTypes = await db.select().from(coffeeTypes)

        return { coffeeTypes: allCoffeeTypes, error: null }
    } catch (error) {
        console.error('Failed to fetch coffeeTypes:', error)
        return { venues: [], error: 'Failed to fetch coffeeType' }
    }
}
'use server';

import { venues } from '@/db/schema/venues';
import { db } from '@/lib/db';

export async function getVenues() {
    try {
        const allVenues = await db.select().from(venues)

        return { venues: allVenues, error: null }
    } catch (error) {
        console.error('Failed to fetch venues:', error)
        return { venues: [], error: 'Failed to fetch venues' }
    }
}

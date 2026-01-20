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

export async function addVenue(data: {
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
}) {
    try {
        const result = await db.insert(venues).values({
            name: data.name,
            address: data.address,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
        }).returning();
        return { venue: result[0], error: null };
    } catch (error) {
        console.error('Failed to add venue:', error);
        return { venue: null, error: 'Failed to add venue' };
    }
}

'use server';

import { db } from '@/lib/db';
import { coffeeReports } from '@/db/schema/coffeeReports';
import { coffeeTypes } from '@/db/schema/coffeeTypes';
import { and, eq } from 'drizzle-orm';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';
import { revalidatePath } from 'next/cache';

interface SubmitReportParams {
    venueId: number;
    coffeeType: CoffeeType;
    coffeeSize: CoffeeSize;
    coffeeMilkType: CoffeeMilkType;
    price: number;
    rating?: number;
    comments?: string;
}

export async function submitReport({
    venueId,
    coffeeType,
    coffeeSize,
    coffeeMilkType,
    price,
    rating,
    comments,
}: SubmitReportParams) {
    try {
        // First, get the coffee type ID based on the selected options
        const [matchingCoffeeType] = await db
            .select()
            .from(coffeeTypes)
            .where(
                and(
                    eq(coffeeTypes.name, coffeeType),
                    eq(coffeeTypes.size, coffeeSize),
                    eq(coffeeTypes.milkType, coffeeMilkType)
                )
            );

        let coffeeTypeId: number;

        if (!matchingCoffeeType) {
            // Coffee type not found, create a new one
            const [newCoffeeType] = await db.insert(coffeeTypes).values({
                name: coffeeType,
                size: coffeeSize,
                milkType: coffeeMilkType,
            }).returning();
            
            coffeeTypeId = newCoffeeType.id;
        } else {
            coffeeTypeId = matchingCoffeeType.id;
        }

        // Insert the new report
        const [newReport] = await db.insert(coffeeReports).values({
            venue_id: venueId,
            coffee_id: coffeeTypeId,
            price: price,
            rating: rating,
            comments: comments,
            hidden: false,
        }).returning();

        // Revalidate relevant paths to refresh data
        revalidatePath(`/venues/${venueId}`);
        revalidatePath('/venues');

        return {
            success: true,
            report: newReport,
        };
    } catch (error) {
        console.error('Error submitting coffee report:', error);
        return {
            success: false,
            error: 'Failed to submit report',
        };
    }
}

/**
 * Refreshes coffee report data for specific paths
 * @param paths Array of paths to revalidate
 */
export async function refreshReportData(paths: string[] = []) {
    try {
        // Revalidate specific paths if provided
        if (paths.length > 0) {
            paths.forEach(path => revalidatePath(path));
        } else {
            // Default paths to refresh when none specified
            revalidatePath('/venues');
            revalidatePath('/reports');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error refreshing report data:', error);
        return { success: false, error: 'Failed to refresh data' };
    }
}
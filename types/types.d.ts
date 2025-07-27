export interface MarkerData {
    venue_name: string;
    venue_id: number;
    coffee_id: number | null;
    longitude: number | string | null;
    latitude: number | string | null;
    price: number | null;
    rating: number | null;
}

export interface CoffeeTypeObject {
    id: number;
    name: string;
    milkType: string | null;
    size: string | null;
    modifier: string | null;
    created_at?: Date;
} 

export interface CoffeeReportObject {
    id: number;
    venue_id: number;
    coffee_id: number;
    price?: number | null;
    rating?: number | null;
    comments?: string | null;
    hidden: boolean;
    created_at: Date;
}





'use client';

import { FC, useEffect, useState, useCallback } from 'react';
import { CoffeeTypeObject, MarkerData } from '@/types/types';
import { CoffeeMilkType, CoffeeSize, CoffeeType, CoffeeMilkTypes, CoffeeSizes, CoffeeTypes } from '@/types/coffeeTypes';
import { getPrices } from '@/actions/prices';
import MapView from './MapView';

interface Venue {
  id: number;
  name: string;
  address: string | null;
  website: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: Date | null;
}

interface DynamicMapViewProps {
  venues: Venue[];
  coffeeTypes: CoffeeTypeObject[];
}

export const DynamicMapView: FC<DynamicMapViewProps> = ({ venues, coffeeTypes }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState<CoffeeType>('Latte');
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('Regular');
  const [selectedMilkType, setSelectedMilkType] = useState<CoffeeMilkType>('FullCream');
  const [markerData, setMarkerData] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPricesAndUpdateMarkers = useCallback(async () => {
    setLoading(true);
    try {
      // Convert enum keys to their string values
      const coffeeTypeValue = CoffeeTypes[selectedCoffeeType];
      const sizeValue = CoffeeSizes[selectedSize];
      const milkTypeValue = CoffeeMilkTypes[selectedMilkType];
      
      console.log('Fetching prices for:', { coffeeTypeValue, sizeValue, milkTypeValue });
      
      const { prices, error } = await getPrices(coffeeTypeValue, sizeValue, milkTypeValue);
      
      if (error || !prices) {
        console.error('Error fetching prices:', error);
        // Set markers with no price/rating data if there's an error
        const fallbackMarkers = venues.map((venue: Venue) => ({
          venue_name: venue.name,
          venue_id: venue.id,
          coffee_id: coffeeTypes[0]?.id || null,
          price: null,
          rating: null,
          latitude: venue.latitude ? Number(venue.latitude) : null,
          longitude: venue.longitude ? Number(venue.longitude) : null,
        }));
        setMarkerData(fallbackMarkers);
        setLoading(false);
        return;
      }

      const priceMap = new Map(
        prices.map((price) => [price.venue_id, price.price])
      );
      
      const ratingMap = new Map(
        prices.map((price) => [price.venue_id, price.rating])
      );

      const newMarkerData = venues.map((venue: Venue) => ({
        venue_name: venue.name,
        venue_id: venue.id,
        coffee_id: coffeeTypes[0]?.id || null,
        price: priceMap.get(venue.id) || null,
        rating: ratingMap.get(venue.id) || null,
        latitude: venue.latitude ? Number(venue.latitude) : null,
        longitude: venue.longitude ? Number(venue.longitude) : null,
      }));

      setMarkerData(newMarkerData);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCoffeeType, selectedSize, selectedMilkType, venues, coffeeTypes]);

  useEffect(() => {
    fetchPricesAndUpdateMarkers();
  }, [fetchPricesAndUpdateMarkers]);

  const handleCoffeeTypeChange = (value: CoffeeType) => {
    setSelectedCoffeeType(value);
  };

  const handleSizeChange = (value: CoffeeSize) => {
    setSelectedSize(value);
  };

  const handleMilkTypeChange = (value: CoffeeMilkType) => {
    setSelectedMilkType(value);
  };

  if (loading && markerData.length === 0) {
    return <div>Loading map data...</div>;
  }

  return (
    <MapView 
      markers={markerData} 
      selectedCoffeeType={selectedCoffeeType}
      selectedSize={selectedSize}
      selectedMilkType={selectedMilkType}
      onCoffeeTypeChange={handleCoffeeTypeChange}
      onSizeChange={handleSizeChange}
      onMilkTypeChange={handleMilkTypeChange}
    />
  );
};

export default DynamicMapView;

import MapView from '@/components/MapView';
import { getPrices } from '@/actions/prices';
import { getCoffeeTypes } from '@/actions/coffeeTypes';
import { getVenues } from '@/actions/venues';

export default async function Home() {
  const { coffeeTypes } = await getCoffeeTypes();
  const { prices, error } = await getPrices('Latte', 'Regular');
  const { venues, error: venuesError } = await getVenues();

  if (error || !prices || !coffeeTypes || !venues || venuesError) {
    console.error('Error fetching data:', error || venuesError);
    return <div>Error loading map data</div>;
  }

  const priceMap = new Map(
    prices.map((price) => [price.venue_id, price.price])
  );

  const markerData = venues.map((venue) => ({
    venue_name: venue.name,
    venue_id: venue.id,
    coffee_id: coffeeTypes[0]?.id, // Using the first coffee type as default
    price: priceMap.get(venue.id) || 0,
    rating: null, // Add default rating if needed
    latitude: venue.latitude,
    longitude: venue.longitude,
  }));

  return (
    <>
      <MapView markers={markerData} coffeeTypes={coffeeTypes} />
    </>
  );
}

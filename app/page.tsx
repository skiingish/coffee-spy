import DynamicMapView from '@/components/DynamicMapView';
import { getCoffeeTypes } from '@/actions/coffeeTypes';
import { getVenues } from '@/actions/venues';

export default async function Home() {
  const { coffeeTypes } = await getCoffeeTypes();
  const { venues, error: venuesError } = await getVenues();

  if (!coffeeTypes || !venues || venuesError) {
    console.error('Error fetching data:', venuesError);
    return <div>Error loading map data</div>;
  }

  return (
    <>
      <DynamicMapView venues={venues} coffeeTypes={coffeeTypes} />
    </>
  );
}

'use client';
import { FC, useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CoffeeTypeObject, MarkerData } from '@/types/types';
import { getRatingColor } from '@/utils/ratingColors';
import GlassContainer from './GlassContainer';
import MarkerDrawer from './MarkerDrawer';
import CoffeeSelector from './CoffeeSelector';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';

interface MapViewProps {
  markers: MarkerData[];
  coffeeTypes: CoffeeTypeObject[];
}

const MapView: FC<MapViewProps> = ({ markers = [] }) => {
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '100vh',
  });

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoffeeType, setSelectedCoffeeType] =
    useState<CoffeeType>('Latte');
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('Regular');
  const [selectedMilkType, setSelectedMilkType] =
    useState<CoffeeMilkType>('FullCream');

  const onCoffeeTypeChange = (value: CoffeeType) => {
    setSelectedCoffeeType(value);
  };

  const onSizeChange = (value: CoffeeSize) => {
    setSelectedSize(value);
  };

  const onMilkTypeChange = (value: CoffeeMilkType) => {
    setSelectedMilkType(value);
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: '100%',
        height: '100vh',
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (markers.length === 0) {
    return <div>No markers to display</div>;
  }

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setIsDrawerOpen(true);
  };

  return (
    <div className='min-h-screen w-full'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 144.9412986,
          latitude: -37.8623672,
          zoom: 12,
        }}
        style={dimensions}
        mapStyle='mapbox://styles/petherem/cl2hdvc6r003114n2jgmmdr24'
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            longitude={Number(marker.longitude) || 0}
            latitude={Number(marker.latitude) || 0}
          >
            <div
              className='rounded-full px-2 py-1 shadow-lg cursor-pointer transition-all duration-200 border-2'
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: getRatingColor(marker.rating),
                color: 'white',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = getRatingColor(
                  marker.rating
                );
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.color = 'white';
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              <span className='text-sm font-medium'>
                ${marker.price?.toFixed(2)}
              </span>
            </div>
          </Marker>
        ))}
        <GlassContainer className='p-4 m-2'>
          <h1 className='text-lg font-semibold'>Coffee Spotter</h1>
          <CoffeeSelector
            selectedCoffeeType={selectedCoffeeType}
            selectedMilkType={selectedMilkType}
            selectedSize={selectedSize}
            onCoffeeTypeChange={onCoffeeTypeChange}
            onMilkTypeChange={onMilkTypeChange}
            onSizeChange={onSizeChange}
          />
        </GlassContainer>
        <MarkerDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          marker={selectedMarker}
          selectedCoffeeType={{
            coffeeType: selectedCoffeeType,
            coffeeSize: selectedSize,
            coffeeMilkType: selectedMilkType,
          }}
        />
      </Map>
    </div>
  );
};

export default MapView;

// ${marker.price?.toFixed(2)}

{
  /* <div className='text-red-500 cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6'
              >
                <path
                  fillRule='evenodd'
                  d='M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
            </div> */
}

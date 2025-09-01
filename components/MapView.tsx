'use client';
import { FC, useEffect, useState } from 'react';
import CoffeeLoadingScreen from '@/components/CoffeeLoader';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerData } from '@/types/types';
import { getRatingColor } from '@/utils/ratingColors';
import GlassContainer from './GlassContainer';
import MarkerDrawer from './MarkerDrawer';
import CoffeeSelector from './CoffeeSelector';
import HelpMenu from './HelpMenu';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';
import { Coffee } from 'lucide-react';
import AdSenseFooter from '@/components/ads/AdSenseFooter';

interface MapViewProps {
  markers: MarkerData[];
  selectedCoffeeType: CoffeeType;
  selectedSize: CoffeeSize;
  selectedMilkType: CoffeeMilkType;
  onCoffeeTypeChange: (value: CoffeeType) => void;
  onSizeChange: (value: CoffeeSize) => void;
  onMilkTypeChange: (value: CoffeeMilkType) => void;
}

const MapView: FC<MapViewProps> = ({ 
  markers = [], 
  selectedCoffeeType,
  selectedSize,
  selectedMilkType,
  onCoffeeTypeChange,
  onSizeChange,
  onMilkTypeChange
}) => {
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '100vh',
  });

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (mapLoaded) return;
    const id = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 1600);
    return () => clearInterval(id);
  }, [mapLoaded]);
  const [isMounted, setIsMounted] = useState(false);

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

  // Prevent rendering Map (react-map-gl) during SSR to avoid hook/env mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (markers.length === 0) {
    return <div>No markers to display</div>;
  }

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setIsDrawerOpen(true);
  };

  const avg = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
  };

  const initialViewState = {
    longitude: avg(markers.map(m => m.longitude).filter((lng): lng is number => lng !== null).map(Number)),
    latitude: avg(markers.map(m => m.latitude).filter((lat): lat is number => lat !== null).map(Number)),
    zoom: 15,
  };

  return (
    <div className='min-h-screen w-full bg-[#0b0b0b] relative overflow-hidden'>
      {isMounted && (
        <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={initialViewState}
        style={dimensions}
        mapStyle='mapbox://styles/petherem/cl2hdvc6r003114n2jgmmdr24'
        onLoad={() => {
          // small delay so tiles render before fade
          setTimeout(() => setMapLoaded(true), 300);
        }}
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
                {marker.price ? `$${marker.price.toFixed(2)}` : <Coffee className='inline' />}
              </span>
            </div>
          </Marker>
        ))}
        <GlassContainer className='p-3 sm:p-4 max-w-[92vw] sm:max-w-md m-auto'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <span className='inline-block text-xl leading-none'>☕</span>
              <div>
                <h1 className='text-base sm:text-lg font-semibold'>Coffee Spy</h1>
                <p className='text-[10px] sm:text-xs text-white/70 -mt-0.5'>Find great coffee near you (at a reasonable price)</p>
              </div>
            </div>
    
          </div>

          <div className='my-3 h-px bg-white/15' />

          {/* <div className='mb-2 flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] sm:text-xs'>
              {CoffeeSizes[selectedSize]} {isCoffeeTypeStandard(selectedCoffeeType) ? 'Standard' : 'Specialty'} Coffee
            </span>
            <span className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] sm:text-xs'>
              {isMilkTypeStandard(selectedMilkType) ? 'Standard' : 'Alternative'} Milk
            </span>
          </div> */}

          <CoffeeSelector
            selectedCoffeeType={selectedCoffeeType}
            selectedMilkType={selectedMilkType}
            selectedSize={selectedSize}
            onCoffeeTypeChange={onCoffeeTypeChange}
            onMilkTypeChange={onMilkTypeChange}
            onSizeChange={onSizeChange}
          />
        </GlassContainer>
        {/* Footer GlassContainer for AdSense */}
        <div className='absolute inset-x-0 bottom-4 flex justify-center pointer-events-none'>
          <GlassContainer className='pointer-events-auto p-2 sm:p-3 max-w-[92vw] sm:max-w-lg'>
            <AdSenseFooter />
          </GlassContainer>
        </div>
        
        {/* Help Menu in bottom left corner */}
        <div className='absolute bottom-4 left-4 pointer-events-none'>
          <HelpMenu className='pointer-events-auto' />
        </div>
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
      )}
      {/* Unified overlay loader */}
      {!mapLoaded && (
        <div className='absolute inset-0 z-[60]'>
          <CoffeeLoadingScreen autoFade={false} message={['Checking ','Checking milk expiry','Roasting beans'][phase]} />
        </div>
      )}
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

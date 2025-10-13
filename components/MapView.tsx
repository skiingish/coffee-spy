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
import CoffeeSelectionModal from './CoffeeSelectionModal';
import HelpMenu from './HelpMenu';
import InstallPrompt from './InstallPrompt';
// coffee selection values are drawn from context
import { useCoffeeSelection } from '@/hooks/CoffeeSelectionProvider';
import { Coffee } from 'lucide-react';
import { useVenueNameVisibility } from '@/hooks/VenueNameVisibilityProvider';


interface MapViewProps {
  markers: MarkerData[];
}

const MapView: FC<MapViewProps> = ({ markers = [] }) => {
  useCoffeeSelection(); // initialize context (selection used implicitly by child components)
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '100vh',
  });

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [phase, setPhase] = useState(0);
  const { showVenueNames } = useVenueNameVisibility();

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

  // No need for local effect; context handles persistence

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
              {showVenueNames && (
                <span>
                  {' '}{marker.venue_name || 'Unknown'}
                </span>
              )}
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

          <CoffeeSelector onOpen={() => setCoffeeModalOpen(true)} />
        </GlassContainer>
        <CoffeeSelectionModal open={coffeeModalOpen} onOpenChange={setCoffeeModalOpen} />
        {/* Footer GlassContainer for Install Prompt */}
        <div className='absolute inset-x-0 bottom-4 flex justify-center pointer-events-none'>
            <InstallPrompt />
        </div>
        
        {/* Help Menu in bottom left corner */}
        <div className='absolute bottom-4 left-4 pointer-events-none'>
          <HelpMenu className='pointer-events-auto' />
        </div>
        <MarkerDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          marker={selectedMarker}
          onOpenCoffeeSelection={() => setCoffeeModalOpen(true)}
        />
        </Map>
      )}
      {/* Unified overlay loader */}
      {!mapLoaded && (
        <div className='absolute inset-0 z-[60]'>
          <CoffeeLoadingScreen autoFade={false} message={['Checking toilet paper supply','Checking milk expiry','Roasting beans'][phase]} />
        </div>
      )}
    </div>
  );
};

export default MapView;


'use client';
import { FC, useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MarkerData {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
  price?: number;
}

interface MapGLProps {
  markers?: MarkerData[];
}

const MapGL: FC<MapGLProps> = ({ markers = [] }) => {
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '100vh',
  });

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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <div className='bg-black/50 text-white rounded-full px-2 py-1 shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 hover:text-black transition-colors'>
              <span className='text-sm font-medium'>
                ${marker.price?.toFixed(2)}
              </span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapGL;

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

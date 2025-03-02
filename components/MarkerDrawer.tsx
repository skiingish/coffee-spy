import { FC } from 'react';
import { MarkerData } from '@/types/types';
import { getRatingColor } from '@/utils/ratingColors';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface MarkerDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  marker: MarkerData | null;
}

const MarkerDrawer: FC<MarkerDrawerProps> = ({
  isOpen,
  onOpenChange,
  marker,
}) => {
  if (!marker) return null;

  //  bg-[#E6D5BC]/10 // #4A381C

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className='bg-black/10 rounded-l-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        backdrop-blur-[4px]'
        side='right'
      >
        <SheetHeader>
          <SheetTitle className='text-white'>{marker.venue_name}</SheetTitle>
          <SheetDescription className='text-white'>
            Coffee price: ${marker.price?.toFixed(2)}
          </SheetDescription>
        </SheetHeader>
        <div className='py-4 text-white'>
          <div className='mb-4'>
            <h3 className='text-sm font-medium'>Rating</h3>
            <div
              className='inline-block px-2 py-1 rounded mt-1'
              style={{
                backgroundColor: getRatingColor(marker.rating),
                color: '#000',
              }}
            >
              {marker.rating || 'N/A'}/5
            </div>
          </div>

          {/* Add chart of price reports over time */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MarkerDrawer;

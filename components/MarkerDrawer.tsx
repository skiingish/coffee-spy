import { FC } from 'react';
import { MarkerData } from '@/types/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import AddCoffeeReport from './AddCoffeeReport';
import { Rating } from './ui/rating';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';

interface MarkerDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  marker: MarkerData | null;
  selectedCoffeeType: {
    coffeeType: CoffeeType;
    coffeeSize: CoffeeSize;
    coffeeMilkType: CoffeeMilkType;
  };
}

const MarkerDrawer: FC<MarkerDrawerProps> = ({
  isOpen,
  onOpenChange,
  marker,
  selectedCoffeeType,
}) => {
  if (!marker) return null;

  //  bg-[#E6D5BC]/10 // #4A381C

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className='bg-black/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        backdrop-blur-[4px]'
        side='right'
      >
        <SheetHeader className='text-left mb-4'>
          <SheetTitle className='text-white'>{marker.venue_name}</SheetTitle>
          <SheetDescription className='text-white font-medium'>
            Reported price: ${marker.price?.toFixed(2)}
          </SheetDescription>
        </SheetHeader>
        <div className='py-4 text-white'>
          <div className='mb-8'>
            <h3 className='text-sm font-medium'>Current Venue Rating</h3>
            <div className='inline-block py-1 mt-1'>
              <Rating value={marker.rating || 0} readOnly />
            </div>
          </div>

          {/* Add chart of price reports over time */}

          <div className='mt-4'>
            <h1 className='text-lg font-semibold'>Add a report</h1>
            <div className='mt-2'>
              <AddCoffeeReport
                venueId={marker.venue_id}
                selectedCoffeeType={selectedCoffeeType}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MarkerDrawer;

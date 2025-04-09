import { FC, useEffect, useState } from 'react';
import { CoffeeReportObject, MarkerData } from '@/types/types';
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
import { getReportsByVenueId } from '@/actions/report';

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

const getAvgRating = (reports: CoffeeReportObject[]) => {
  console.log('Reports:', reports);
  if (reports.length === 0) return 0;

  const validReports = reports.filter((report) => report.rating != null);
  if (validReports.length === 0) return 0;

  const totalRating = validReports.reduce(
    (acc, report) => acc + (report.rating || 0),
    0
  );
  return totalRating / validReports.length;
};

const MarkerDrawer: FC<MarkerDrawerProps> = ({
  isOpen,
  onOpenChange,
  marker,
  selectedCoffeeType,
}) => {
  const [reports, setReports] = useState<CoffeeReportObject[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && marker?.venue_id) {
      setLoading(true);
      const getReports = async () => {
        const res = await getReportsByVenueId(marker.venue_id);
        if (res.error) {
          console.error('Error fetching reports:', res.error);
          return;
        }
        if (res.reports) {
          setReports(res.reports);
        }
        setLoading(false);
      };
      getReports();
    }
  }, [marker?.venue_id, isOpen]);

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
            {loading ? (
              <div className='animate-pulse flex space-x-1 mt-2'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='h-8 w-8 rounded-full bg-white/20'
                  ></div>
                ))}
              </div>
            ) : (
              <div className='inline-block py-1 mt-1'>
                <Rating value={getAvgRating(reports) || 0} readOnly />
                <span className='text-sm font-medium ml-2'>
                  {reports.length} report
                  {reports.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Add chart of price reports over time */}

          <div className='mt-4'>
            <h1 className='text-lg font-semibold'>Add a report</h1>
            <div className='mt-2'>
              <AddCoffeeReport
                venueId={marker.venue_id}
                selectedCoffeeType={selectedCoffeeType}
                onOpenChange={onOpenChange}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MarkerDrawer;

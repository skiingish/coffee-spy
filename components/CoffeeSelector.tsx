'use client';

import { FC, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  CoffeeMilkType,
  CoffeeSize,
  CoffeeType,
  CoffeeSizes,
  getCategorizedCoffeeTypes,
  getCategorizedMilkTypes,
} from '@/types/coffeeTypes';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

interface CoffeeSelectorProps {
  selectedCoffeeType: CoffeeType;
  selectedSize: CoffeeSize;
  selectedMilkType: CoffeeMilkType;
  onCoffeeTypeChange: (value: CoffeeType) => void;
  onSizeChange: (value: CoffeeSize) => void;
  onMilkTypeChange: (value: CoffeeMilkType) => void;
}

export const CoffeeSelector: FC<CoffeeSelectorProps> = ({
  selectedCoffeeType,
  selectedSize,
  selectedMilkType,
  onCoffeeTypeChange,
  onSizeChange,
  onMilkTypeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Get categorized types for organized display
  const { standard: standardCoffees, specialty: specialtyCoffees } = getCategorizedCoffeeTypes();
  const { standard: standardMilks, alternative: alternativeMilks } = getCategorizedMilkTypes();

  const summaryText = `A ${selectedSize}, ${selectedCoffeeType} with ${selectedMilkType} Milk`;

  return (
    <div className=''>
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={toggleExpanded}
      >
        <div className='font-small text-muted capitalize'>
          {isExpanded ? 'Coffee Selection' : summaryText}
        </div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant='ghost'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className='h-4 w-4' />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='overflow-hidden'
          >
            <div className='space-y-4 mt-4 mb-2'>
              <div className='grid gap-2'>
                <Label htmlFor='coffee-type'>Coffee Type</Label>
                <Select
                  value={selectedCoffeeType}
                  onValueChange={(value) =>
                    onCoffeeTypeChange(value as CoffeeType)
                  }
                >
                  <SelectTrigger id='coffee-type'>
                    <SelectValue placeholder='Select coffee type' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='text-xs font-semibold text-muted-foreground px-2 py-1'>Standard</div>
                    {Object.keys(standardCoffees).map((type) => (
                      <SelectItem key={type} value={type}>
                        {standardCoffees[type as keyof typeof standardCoffees]}
                      </SelectItem>
                    ))}
                    <div className='text-xs font-semibold text-muted-foreground px-2 py-1 mt-2'>Specialty</div>
                    {Object.keys(specialtyCoffees).map((type) => (
                      <SelectItem key={type} value={type}>
                        {specialtyCoffees[type as keyof typeof specialtyCoffees]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='coffee-size'>Size</Label>
                <Select
                  value={selectedSize}
                  onValueChange={(value) => onSizeChange(value as CoffeeSize)}
                >
                  <SelectTrigger id='coffee-size'>
                    <SelectValue placeholder='Select size' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CoffeeSizes).map((size) => (
                      <SelectItem key={size} value={size}>
                        {CoffeeSizes[size as CoffeeSize]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='milk-type'>Milk Type</Label>
                <Select
                  value={selectedMilkType}
                  onValueChange={(value) =>
                    onMilkTypeChange(value as CoffeeMilkType)
                  }
                >
                  <SelectTrigger id='milk-type'>
                    <SelectValue placeholder='Select milk type' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='text-xs font-semibold text-muted-foreground px-2 py-1'>Standard</div>
                    {Object.keys(standardMilks).map((milk) => (
                      <SelectItem key={milk} value={milk}>
                        {standardMilks[milk as keyof typeof standardMilks]}
                      </SelectItem>
                    ))}
                    <div className='text-xs font-semibold text-muted-foreground px-2 py-1 mt-2'>Alternative</div>
                    {Object.keys(alternativeMilks).map((milk) => (
                      <SelectItem key={milk} value={milk}>
                        {alternativeMilks[milk as keyof typeof alternativeMilks]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className='grid gap-2'>
                <Checkbox id='exact-match' />
                <div className='grid gap-1.5 leading-none'>
                  <div className='flex items-center gap-2'>
                    <label
                      htmlFor='exact-match'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Exact Match
                    </label>
                    <Popover>
                      <PopoverTrigger>
                        <Info className='h-4 w-4' />
                      </PopoverTrigger>
                      <PopoverContent className='w-80 bg-black text-white'>
                        <p className='text-sm'>
                          When enabled, this will only show results that exactly
                          match your selected coffee. If disabled, it will show
                          similar matches as well.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoffeeSelector;

"use client";
import { FC } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCoffeeSelection } from '@/hooks/CoffeeSelectionProvider';
import { CoffeeSizes, CoffeeTypes, CoffeeMilkTypes } from '@/types/coffeeTypes';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CoffeeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CoffeeSelectionModal: FC<CoffeeSelectionModalProps> = ({ open, onOpenChange }) => {
  const { coffeeType, coffeeSize, coffeeMilkType, setCoffeeType, setCoffeeSize, setCoffeeMilkType } = useCoffeeSelection();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='max-h-[80vh] flex flex-col p-5 gap-5 text-white bg-black/60 backdrop-blur-md border-white/20 shadow-2xl'>
        <SheetHeader className='text-left'>
          <SheetTitle className='text-xl text-white/70 font-semibold tracking-tight'>Select Your Coffee</SheetTitle>
          
        </SheetHeader>
        <div className='space-y-5 overflow-y-auto pr-1 -mr-1 custom-scrollbar'>
          <div className='grid gap-2'>
            <Label htmlFor='coffee-type' className='text-sm font-medium text-white/90'>Coffee Type</Label>
            <Select value={coffeeType} onValueChange={(v) => setCoffeeType(v as keyof typeof CoffeeTypes)}>
              <SelectTrigger id='coffee-type' className='bg-black/40 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30'>
                <SelectValue placeholder='Coffee type' className='capitalize' />
              </SelectTrigger>
              <SelectContent className='bg-neutral-900/95 backdrop-blur-md border-white/15 text-white shadow-xl'>
                {Object.keys(CoffeeTypes).map((t) => (
                  <SelectItem key={t} value={t} className='capitalize data-[state=checked]:bg-white/10'>
                    {CoffeeTypes[t as keyof typeof CoffeeTypes]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='coffee-size' className='text-sm font-medium text-white/90'>Size</Label>
            <Select value={coffeeSize} onValueChange={(v) => setCoffeeSize(v as keyof typeof CoffeeSizes)}>
              <SelectTrigger id='coffee-size' className='bg-black/40 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30'>
                <SelectValue placeholder='Size' className='capitalize' />
              </SelectTrigger>
              <SelectContent className='bg-neutral-900/95 backdrop-blur-md border-white/15 text-white shadow-xl'>
                {Object.keys(CoffeeSizes).map((s) => (
                  <SelectItem key={s} value={s} className='capitalize data-[state=checked]:bg-white/10'>
                    {CoffeeSizes[s as keyof typeof CoffeeSizes]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='milk-type' className='text-sm font-medium text-white/90'>Milk Type</Label>
            <Select value={coffeeMilkType} onValueChange={(v) => setCoffeeMilkType(v as keyof typeof CoffeeMilkTypes)}>
              <SelectTrigger id='milk-type' className='bg-black/40 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30'>
                <SelectValue placeholder='Milk type' className='capitalize' />
              </SelectTrigger>
              <SelectContent className='bg-neutral-900/95 backdrop-blur-md border-white/15 text-white shadow-xl'>
                {Object.keys(CoffeeMilkTypes).map((m) => (
                  <SelectItem key={m} value={m} className='capitalize data-[state=checked]:bg-white/10'>
                    {CoffeeMilkTypes[m as keyof typeof CoffeeMilkTypes]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex justify-between items-center pt-3 border-t border-white/10'>
          <Button variant='ghost' size='sm' className='text-white/70 hover:text-white hover:bg-white/10' onClick={() => { setCoffeeType('Latte' as keyof typeof CoffeeTypes); setCoffeeSize('Regular' as keyof typeof CoffeeSizes); setCoffeeMilkType('FullCream' as keyof typeof CoffeeMilkTypes); }}>Reset</Button>
          <Button variant='outline' className='bg-white/10 border-white/20 hover:bg-white/20' onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CoffeeSelectionModal;

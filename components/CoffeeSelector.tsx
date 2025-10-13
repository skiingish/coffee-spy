"use client";

import { FC } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoffeeSelection } from '@/hooks/CoffeeSelectionProvider';
import { CoffeeSizes, CoffeeTypes, CoffeeMilkTypes } from '@/types/coffeeTypes';

interface CoffeeSelectorProps { onOpen?: () => void; className?: string; }

export const CoffeeSelector: FC<CoffeeSelectorProps> = ({ onOpen, className }) => {
  const { coffeeType, coffeeSize, coffeeMilkType } = useCoffeeSelection();

  const coffeeLabel = CoffeeTypes[coffeeType] || coffeeType;
  const milkLabel = CoffeeMilkTypes[coffeeMilkType] || coffeeMilkType;
  const summaryText = `${CoffeeSizes[coffeeSize]}, ${milkLabel}, ${coffeeLabel}`;

  const handleClick = () => { onOpen?.(); };

  return (
    <Button
      type='button'
      variant='outline'
      className={`w-full justify-between bg-white/5 hover:bg-white/10 border-white/15 text-sm font-medium ${className || ''}`}
      onClick={handleClick}
      aria-label='Open coffee selection'
    >
      <span className='truncate'>Searching for a <span className='font-bold italic'>{summaryText}</span></span>
      <Edit className='h-6 w-6 opacity-70' />
    </Button>
  );
};

export default CoffeeSelector;

"use client";

import { FC } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoffeeSelection } from '@/hooks/CoffeeSelectionProvider';
import { CoffeeSizes, CoffeeTypes, CoffeeMilkTypes } from '@/types/coffeeTypes';
// This component is intentionally minimal: just a trigger button. Modal handled elsewhere.

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
      <span className='truncate'>{summaryText}</span>
      <Menu className='h-4 w-4 opacity-70' />
    </Button>
  );
};

export default CoffeeSelector;

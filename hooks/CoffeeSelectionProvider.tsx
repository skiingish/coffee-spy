"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { CoffeeMilkType, CoffeeSize, CoffeeType } from '@/types/coffeeTypes';

interface CoffeeSelectionContextValue {
  coffeeType: CoffeeType;
  coffeeSize: CoffeeSize;
  coffeeMilkType: CoffeeMilkType;
  setCoffeeType: (value: CoffeeType) => void;
  setCoffeeSize: (value: CoffeeSize) => void;
  setCoffeeMilkType: (value: CoffeeMilkType) => void;
  setSelection: (v: { coffeeType?: CoffeeType; coffeeSize?: CoffeeSize; coffeeMilkType?: CoffeeMilkType }) => void;
  reset: () => void;
  loaded: boolean;
}

const DEFAULTS: { coffeeType: CoffeeType; coffeeSize: CoffeeSize; coffeeMilkType: CoffeeMilkType } = {
  coffeeType: 'Latte',
  coffeeSize: 'Regular',
  coffeeMilkType: 'FullCream',
};

const STORAGE_KEY = 'coffeeSelection';

const CoffeeSelectionContext = createContext<CoffeeSelectionContextValue | undefined>(undefined);

export const CoffeeSelectionProvider = ({ children }: { children: ReactNode }) => {
  const [coffeeType, setCoffeeType] = useState<CoffeeType>(DEFAULTS.coffeeType);
  const [coffeeSize, setCoffeeSize] = useState<CoffeeSize>(DEFAULTS.coffeeSize);
  const [coffeeMilkType, setCoffeeMilkType] = useState<CoffeeMilkType>(DEFAULTS.coffeeMilkType);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.coffeeType) setCoffeeType(parsed.coffeeType);
        if (parsed.coffeeSize) setCoffeeSize(parsed.coffeeSize);
        if (parsed.coffeeMilkType) setCoffeeMilkType(parsed.coffeeMilkType);
      }
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = useCallback((next: { coffeeType: CoffeeType; coffeeSize: CoffeeSize; coffeeMilkType: CoffeeMilkType }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loaded) return; // avoid overwriting on initial load
    persist({ coffeeType, coffeeSize, coffeeMilkType });
  }, [coffeeType, coffeeSize, coffeeMilkType, persist, loaded]);

  const setSelection: CoffeeSelectionContextValue['setSelection'] = useCallback((v) => {
    if (v.coffeeType) setCoffeeType(v.coffeeType);
    if (v.coffeeSize) setCoffeeSize(v.coffeeSize);
    if (v.coffeeMilkType) setCoffeeMilkType(v.coffeeMilkType);
  }, []);

  const reset = useCallback(() => {
    setCoffeeType(DEFAULTS.coffeeType);
    setCoffeeSize(DEFAULTS.coffeeSize);
    setCoffeeMilkType(DEFAULTS.coffeeMilkType);
  }, []);

  const value: CoffeeSelectionContextValue = {
    coffeeType,
    coffeeSize,
    coffeeMilkType,
    setCoffeeType,
    setCoffeeSize,
    setCoffeeMilkType,
    setSelection,
    reset,
    loaded,
  };

  if (!loaded) return null; // avoid flicker

  return (
    <CoffeeSelectionContext.Provider value={value}>
      {children}
    </CoffeeSelectionContext.Provider>
  );
};

export const useCoffeeSelection = () => {
  const ctx = useContext(CoffeeSelectionContext);
  if (!ctx) throw new Error('useCoffeeSelection must be used within a CoffeeSelectionProvider');
  return ctx;
};

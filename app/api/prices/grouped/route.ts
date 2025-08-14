import { NextRequest } from 'next/server';
import { getPricesGrouped } from '@/actions/prices';
import { CoffeeType, CoffeeMilkType } from '@/types/coffeeTypes';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coffeeType = searchParams.get('coffeeType') as CoffeeType | null;
  const size = searchParams.get('size');
  const milkType = searchParams.get('milkType') as CoffeeMilkType | null;
  const modifier = searchParams.get('modifier') || undefined;

  if (!coffeeType || !size || !milkType) {
    return Response.json({ prices: [], error: 'Missing parameters' }, { status: 400 });
  }

  const { prices, error } = await getPricesGrouped(coffeeType, size, milkType, modifier);
  return Response.json({ prices, error });
}

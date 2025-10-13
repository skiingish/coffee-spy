'use client';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from './ui/button';
import { NumberInput } from './ui/numberInput';
import { Rating } from './ui/rating';
import { CoffeeMilkType, CoffeeType, CoffeeSize } from '@/types/coffeeTypes';
import { submitReport } from '@/actions/report';
import { toast } from 'sonner';
import { getBlockedUntil, makeGroupKey, msToCompact, recordSubmission } from '@/utils/reviewGate';
import { isCoffeeTypeStandard, isMilkTypeStandard } from '@/types/coffeeTypes';

import { useCoffeeSelection } from '@/hooks/CoffeeSelectionProvider';

interface AddCoffeeReportProps {
  venueId?: number;
  onOpenChange?: (open: boolean) => void;
  onOpenCoffeeSelection?: () => void; // new: open global coffee selection modal
}

const formSchema = z.object({
  venueId: z.number(),
  coffeeSize: z.string(),
  coffeeMilkType: z.string(),
  coffeeType: z.string(),
  price: z
    .number()
    .min(0, {
      message: 'Price must be a positive number',
    })
    .max(100, {
      message: "Price must be less than $100, because that's ridiculous",
    }),
  rating: z.number().min(0).max(5),
});

const AddCoffeeReport: FC<AddCoffeeReportProps> = ({
  venueId = 1,
  onOpenChange,
  onOpenCoffeeSelection,
}) => {
  const { coffeeType, coffeeSize, coffeeMilkType } = useCoffeeSelection();
  // editingCoffee legacy state removed (inline editing deprecated)
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueId: venueId,
  coffeeSize: coffeeSize,
  coffeeMilkType: coffeeMilkType,
  coffeeType: coffeeType,
      price: undefined,
      rating: undefined,
    },
  });

  // Derive the current key for anti-spam gating
  const currentKey = useMemo(() => {
  const ct = (form.getValues('coffeeType') || coffeeType) as string;
  const sz = (form.getValues('coffeeSize') || coffeeSize) as string;
  const mk = (form.getValues('coffeeMilkType') || coffeeMilkType) as string;
  const coffeeGroup = isCoffeeTypeStandard(ct as CoffeeType) ? 'standard' : 'specialty';
  const milkGroup = isMilkTypeStandard(mk as CoffeeMilkType) ? 'standard' : 'alternative';
    return makeGroupKey(coffeeGroup, milkGroup, sz, { includeVenue: true, venueId });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [venueId, form.watch('coffeeType'), form.watch('coffeeMilkType'), form.watch('coffeeSize')]);

  // Check block status on mount and whenever the selection changes
  useEffect(() => {
    const until = getBlockedUntil(currentKey);
    setBlockedUntil(until);
  }, [currentKey]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Final guard: if blocked, avoid submitting
    const until = getBlockedUntil(currentKey);
    if (until && until > Date.now()) {
      toast.warning(`You've recently submitted this coffee. Try again in ${msToCompact(until - Date.now())}.`);
      setBlockedUntil(until);
      return;
    }

    // Call the server action with the form values
    submitReport({
      venueId: values.venueId,
      coffeeType: values.coffeeType as CoffeeType,
      coffeeSize: values.coffeeSize as CoffeeSize,
      coffeeMilkType: values.coffeeMilkType as CoffeeMilkType,
      price: values.price,
      rating: values.rating,
    }).then((response) => {
      if (response.success) {
        // Use the onOpenChange prop to close the drawer
        if (onOpenChange) {
          onOpenChange(false);
        }

        toast('Your coffee report has been submitted.');

        // Record this submission locally to prevent spam for TTL
        recordSubmission(currentKey);
        setBlockedUntil(getBlockedUntil(currentKey));

        form.reset();
      } else {
        console.error('Failed to submit report:', response.error);
        toast.error('Failed to submit your report.');
      }
    });
  }

  // const selectedCoffeeTypeString = `A ${selectedCoffeeType.coffeeSize}, ${selectedCoffeeType.coffeeMilkType}, ${selectedCoffeeType.coffeeType}`;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex flex-col gap-2'>
            <Button
              className='text-muted underline-offset-2 hover:underline w-fit px-0'
              variant='ghost'
              size='sm'
              type='button'
              onClick={onOpenCoffeeSelection}
              disabled={!onOpenCoffeeSelection}
            >
              Wrong coffee?
            </Button>
          </div>

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Me</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder='5.80'
                    decimalPlaces={2}
                    min={0}
                    max={100}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormDescription>
                  How much did you pay for this coffee?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='rating'
            render={({ field }) => (
              <FormItem>
                <FormLabel>And the experience was</FormLabel>
                <FormControl>
                  <div className='mt-1'>
                    <Rating
                      value={field.value}
                      onChange={field.onChange}
                      max={5}
                      allowHalf={true}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  How would you rate this coffee and venue?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center justify-between gap-3'>
            <Button type='submit' disabled={!!blockedUntil && blockedUntil > Date.now()}>
              Submit Brew
            </Button>
            {blockedUntil && blockedUntil > Date.now() && (
              <span className='text-xs text-muted-foreground'>
                You can submit again in {msToCompact(blockedUntil - Date.now())}
              </span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCoffeeReport;

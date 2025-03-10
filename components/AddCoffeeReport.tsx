'use client';
import { FC } from 'react';
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

interface AddCoffeeReportProps {
  venueId?: number;
  coffeeId?: number;
}

const formSchema = z.object({
  venueId: z.number(),
  coffeeId: z.number(),
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
  coffeeId = 1,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueId: venueId,
      coffeeId: coffeeId,
      price: undefined,
      rating: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
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
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Rating
                    value={field.value}
                    onChange={field.onChange}
                    max={5}
                    allowHalf={true}
                  />
                </FormControl>
                <FormDescription>
                  How would you rate this coffee and venue?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Submit Brew</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCoffeeReport;

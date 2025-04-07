'use client';
import { FC, useState } from 'react';
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
import {
  CoffeeMilkType,
  CoffeeType,
  CoffeeSize,
  CoffeeTypes,
  CoffeeSizes,
  CoffeeMilkTypes,
} from '@/types/coffeeTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { submitReport } from '@/actions/report';
import { toast } from 'sonner';

interface AddCoffeeReportProps {
  venueId?: number;
  selectedCoffeeType: {
    coffeeType: CoffeeType;
    coffeeSize: CoffeeSize;
    coffeeMilkType: CoffeeMilkType;
  };
  onOpenChange?: (open: boolean) => void;
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
  selectedCoffeeType,
  onOpenChange,
}) => {
  const [editingCoffee, setEditingCoffee] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueId: venueId,
      coffeeSize: selectedCoffeeType.coffeeSize,
      coffeeMilkType: selectedCoffeeType.coffeeMilkType,
      coffeeType: selectedCoffeeType.coffeeType,
      price: undefined,
      rating: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Submitting report:', values);
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

        form.reset();
      } else {
        console.error('Failed to submit report:', response.error);
        toast.error('Failed to submit your report.');
      }
    });
  }

  const selectedCoffeeTypeString = `A ${selectedCoffeeType.coffeeSize}, ${selectedCoffeeType.coffeeMilkType}, ${selectedCoffeeType.coffeeType}`;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex flex-col gap-2'>
            {!editingCoffee ? (
              <>
                <h2>{selectedCoffeeTypeString}</h2>
                <Button
                  className='text-gray-500'
                  variant='ghost'
                  size='sm'
                  type='button'
                  onClick={() => setEditingCoffee(true)}
                >
                  Wrong coffee?
                </Button>
              </>
            ) : (
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='coffeeType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coffee Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id='coffee-type'>
                          <SelectValue placeholder='Select coffee type' />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CoffeeTypes).map((type) => (
                            <SelectItem key={type} value={type}>
                              {CoffeeTypes[type as CoffeeType]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='coffeeSize'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='coffeeMilkType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milk Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id='milk-type'>
                          <SelectValue placeholder='Select milk type' />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CoffeeMilkTypes).map((milk) => (
                            <SelectItem key={milk} value={milk}>
                              {CoffeeMilkTypes[milk as CoffeeMilkType]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
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

          <Button type='submit'>Submit Brew</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCoffeeReport;

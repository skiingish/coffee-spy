export enum CoffeeTypes {
  Latte = 'latte',
  FlatWhite = 'flat white',
  Cappuccino = 'cappuccino',
  Espresso = 'espresso',
  LongBlack = 'long black',
  Mocha = 'mocha',
  Magic = 'magic',
  ColdBrew = 'cold brew',
  IcedLatte = 'iced latte',
}

export enum ExtendCoffeeTypes {
  Macchiato = 'macchiato',
  Turkish = 'turkish',
  Irish = 'irish',
  Americano = 'americano',
  Vienna = 'vienna',
  Affogato = 'affogato',
  Piccolo = 'piccolo',
  Ristretto = 'ristretto',
  Lungo = 'lungo',
  IcedMocha = 'iced mocha',
  IcedLongBlack = 'iced long black',
  IcedAmericano = 'iced americano',
  IcedTea = 'iced tea',
  ChaiLatte = 'chai latte',
  HotChocolate = 'hot chocolate',
  MatchaLatte = 'matcha latte',
  GoldenLatte = 'golden latte',
  TumericLatte = 'tumeric latte',
  BeetrootLatte = 'beetroot latte',
  ChaiTea = 'chai tea',
  EnglishBreakfast = 'english breakfast',
  EarlGrey = 'earl grey',
  GreenTea = 'green tea',
  PeppermintTea = 'peppermint tea',
  ChamomileTea = 'chamomile tea',
  RooibosTea = 'rooibos tea',
  OolongTea = 'oolong tea',
  MatchaTea = 'matcha tea',
  HerbalTea = 'herbal tea',
  FruitTea = 'fruit tea',
  WhiteTea = 'white tea',
  BlackTea = 'black tea',
  Coffee = 'coffee',
  Tea = 'tea',
  Other = 'other',
}

export type CoffeeType = keyof typeof CoffeeTypes;

// Coffee type categories
export const StandardCoffeeTypes = {
  Latte: CoffeeTypes.Latte,
  FlatWhite: CoffeeTypes.FlatWhite,
  Cappuccino: CoffeeTypes.Cappuccino,
} as const;

export const SpecialtyCoffeeTypes = {
  Espresso: CoffeeTypes.Espresso,
  LongBlack: CoffeeTypes.LongBlack,
  Mocha: CoffeeTypes.Mocha,
  Magic: CoffeeTypes.Magic,
  ColdBrew: CoffeeTypes.ColdBrew,
  IcedLatte: CoffeeTypes.IcedLatte,
} as const;

export const ExtendedSpecialtyCoffeeTypes = {
  Macchiato: ExtendCoffeeTypes.Macchiato,
  Turkish: ExtendCoffeeTypes.Turkish,
  Irish: ExtendCoffeeTypes.Irish,
  Americano: ExtendCoffeeTypes.Americano,
  Vienna: ExtendCoffeeTypes.Vienna,
  Affogato: ExtendCoffeeTypes.Affogato,
  Piccolo: ExtendCoffeeTypes.Piccolo,
  Ristretto: ExtendCoffeeTypes.Ristretto,
  Lungo: ExtendCoffeeTypes.Lungo,
  IcedMocha: ExtendCoffeeTypes.IcedMocha,
  IcedLongBlack: ExtendCoffeeTypes.IcedLongBlack,
  IcedAmericano: ExtendCoffeeTypes.IcedAmericano,
  IcedTea: ExtendCoffeeTypes.IcedTea,
  ChaiLatte: ExtendCoffeeTypes.ChaiLatte,
  HotChocolate: ExtendCoffeeTypes.HotChocolate,
  MatchaLatte: ExtendCoffeeTypes.MatchaLatte,
  GoldenLatte: ExtendCoffeeTypes.GoldenLatte,
  TumericLatte: ExtendCoffeeTypes.TumericLatte,
  BeetrootLatte: ExtendCoffeeTypes.BeetrootLatte,
  ChaiTea: ExtendCoffeeTypes.ChaiTea,
  EnglishBreakfast: ExtendCoffeeTypes.EnglishBreakfast,
  EarlGrey: ExtendCoffeeTypes.EarlGrey,
  GreenTea: ExtendCoffeeTypes.GreenTea,
  PeppermintTea: ExtendCoffeeTypes.PeppermintTea,
  ChamomileTea: ExtendCoffeeTypes.ChamomileTea,
  RooibosTea: ExtendCoffeeTypes.RooibosTea,
  OolongTea: ExtendCoffeeTypes.OolongTea,
  MatchaTea: ExtendCoffeeTypes.MatchaTea,
  HerbalTea: ExtendCoffeeTypes.HerbalTea,
  FruitTea: ExtendCoffeeTypes.FruitTea,
  WhiteTea: ExtendCoffeeTypes.WhiteTea,
  BlackTea: ExtendCoffeeTypes.BlackTea,
  Coffee: ExtendCoffeeTypes.Coffee,
  Tea: ExtendCoffeeTypes.Tea,
  Other: ExtendCoffeeTypes.Other,
} as const;

// Helper functions for categorized coffee types
export const getCategorizedCoffeeTypes = () => ({
  standard: StandardCoffeeTypes,
  specialty: SpecialtyCoffeeTypes,
});

export const getAllCategorizedCoffeeTypes = () => ({
  standard: StandardCoffeeTypes,
  specialty: { ...SpecialtyCoffeeTypes, ...ExtendedSpecialtyCoffeeTypes },
});

export const isCoffeeTypeStandard = (coffeeType: CoffeeType): boolean => {
  return Object.keys(StandardCoffeeTypes).includes(coffeeType);
};

export const isCoffeeTypeSpecialty = (coffeeType: CoffeeType): boolean => {
  return Object.keys(SpecialtyCoffeeTypes).includes(coffeeType) || 
         Object.keys(ExtendedSpecialtyCoffeeTypes).includes(coffeeType);
};

export enum CoffeeSizes {
  Small = 'small',
  Regular = 'regular',
  Large = 'large',
}

export type CoffeeSize = keyof typeof CoffeeSizes;

export enum CoffeeModifiers {
  Single = 'single',
  Double = 'double',
  Triple = 'triple',
  Quad = 'quad',
}

export type CoffeeModifier = keyof typeof CoffeeModifiers;

export enum CoffeeMilkTypes {
  FullCream = 'full cream',
  Skim = 'skim',
  Soy = 'soy',
  Almond = 'almond',
  Oat = 'oat',
}

export enum ExtendCoffeeMilkTypes {
  Coconut = 'coconut',
  Macadamia = 'macadamia',
  Rice = 'rice',
  Hemp = 'hemp',
  Cashew = 'cashew',
  Pea = 'pea',
  LactoseFree = 'lactose free',
  Other = 'other',
}

export type CoffeeMilkType = keyof typeof CoffeeMilkTypes;

// Milk type categories
export const StandardMilkTypes = {
  FullCream: CoffeeMilkTypes.FullCream,
  Skim: CoffeeMilkTypes.Skim,
} as const;

export const AlternativeMilkTypes = {
  Soy: CoffeeMilkTypes.Soy,
  Almond: CoffeeMilkTypes.Almond,
  Oat: CoffeeMilkTypes.Oat,
} as const;

export const ExtendedAlternativeMilkTypes = {
  Coconut: ExtendCoffeeMilkTypes.Coconut,
  Macadamia: ExtendCoffeeMilkTypes.Macadamia,
  Rice: ExtendCoffeeMilkTypes.Rice,
  Hemp: ExtendCoffeeMilkTypes.Hemp,
  Cashew: ExtendCoffeeMilkTypes.Cashew,
  Pea: ExtendCoffeeMilkTypes.Pea,
  LactoseFree: ExtendCoffeeMilkTypes.LactoseFree,
  Other: ExtendCoffeeMilkTypes.Other,
} as const;

// Helper functions for categorized milk types
export const getCategorizedMilkTypes = () => ({
  standard: StandardMilkTypes,
  alternative: AlternativeMilkTypes,
});

export const getAllCategorizedMilkTypes = () => ({
  standard: StandardMilkTypes,
  alternative: { ...AlternativeMilkTypes, ...ExtendedAlternativeMilkTypes },
});

export const isMilkTypeStandard = (milkType: CoffeeMilkType): boolean => {
  return Object.keys(StandardMilkTypes).includes(milkType);
};

export const isMilkTypeAlternative = (milkType: CoffeeMilkType): boolean => {
  return Object.keys(AlternativeMilkTypes).includes(milkType);
};
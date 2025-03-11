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
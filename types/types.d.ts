export interface MarkerData {
    venue_name: string;
    longitude: number | string | null;
    latitude: number | string | null;
    price: number | null;
    rating: number | null;
}

export enum CoffeeTypes {
    Latte = 'latte',
    FlatWhite = 'flat white',
    Cappuccino = 'cappuccino',
    Espresso = 'espresso',
    LongBlack = 'long black',
    Macchiato = 'macchiato',
    Mocha = 'mocha',
    Affogato = 'affogato',
    Piccolo = 'piccolo',
    Ristretto = 'ristretto',
    Lungo = 'lungo',
    Americano = 'americano',
    Vienna = 'vienna',
    Magic = 'magic',
    Turkish = 'turkish',
    Irish = 'irish',
    ColdBrew = 'cold brew',
    IcedLatte = 'iced latte',
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
    ExtraLarge = 'extra large',
}

export type CoffeeSize = keyof typeof CoffeeSizes;

export enum CoffeeModifiers {
    Single = 'single',
    Double = 'double',
    Triple = 'triple',
    Quad = 'quad',
}

export type CoffeeModifier = keyof typeof CoffeeModifiers;

export type CoffeeMilkType = 'full cream' | 'skim' | 'soy' | 'almond' | 'oat' | 'coconut' | 'macadamia' | 'rice' | 'hemp' | 'cashew' | 'pea' | 'lactose free' | 'other';

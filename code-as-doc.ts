type ProductId = string & { _brand: 'ProductId' };
const asProductId = (value: string): ProductId => value as ProductId;

type Name = string & { _brand: 'Name' };
const asName = (value: string): Name => value as Name;

type OrderId = string & { _brand: 'OrderId' };
const asOrderId = (value: string): OrderId => value as OrderId;

type Quantity = number & { _brand: 'Quantity' };

type Product = {
  id: ProductId;
  name: Name;
  price: Price;
};

type BasketItem = {
  product: Product;
  quantity: Quantity;
};

const basketItemPrice = (item: BasketItem): Price => ({
  amount: item.quantity * item.product.price.amount,
  currency: item.product.price.currency,
})

type Basket = {
  items: Array<BasketItem>;
};

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

type PendingOrder = {
  id: OrderId;
  basket: Basket;
  totalAmount: Price;
  status: 'pending'
};

type ValidateBasket = (basket: Basket) => Either<String, PendingOrder>;

const validateBasket: ValidateBasket = (basket) => {
  if (basketIsEmpty(basket)) {
    return left("there are no items in the basket");
  }

  const wrongQuantityItem = basket.items.find(item => item.quantity <= 0);
  if (!!wrongQuantityItem) {
    return left(`item ${wrongQuantityItem.product.name} has a null or negative quantity`);
  }

  const totalAmount = basket.items
    .map(basketItemPrice)
    .reduce(sum, zero(basket.items[0].product.price.currency))

  return right({
    id: asOrderId(`O-${new Date().toISOString()}`),
    basket,
    totalAmount,
    status: 'pending'
  });
};

const basketIsEmpty = (basket: Basket): boolean => basket.items.length === 0;

type Currency = 'EUR' | 'USD' | 'GBP';
type Price = { amount: number; currency: Currency };

const sum = (a: Price, b: Price): Price => ({
  amount: a.amount + b.amount,
  currency: a.currency
});
const zero = (currency: Currency): Price => ({ amount: 0, currency });


type Either<L, R> = Left<L> | Right<R>;

type Left<L> = {
  type: 'left';
  value: L;
};

type Right<R> = {
  type: 'right';
  value: R;
};

const left = <L, R>(value: L): Either<L, R> => ({
  type: 'left',
  value
});

const right = <L, R>(value: R): Either<L, R> => ({
  type: 'right',
  value
});
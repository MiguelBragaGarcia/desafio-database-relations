import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const hasCustomer = await this.customersRepository.findById(customer_id);

    if (!hasCustomer) {
      throw new AppError('This customer does not exists.');
    }

    const hasProducts = await this.productsRepository.findAllById(products);

    if (hasProducts.length !== products.length) {
      throw new AppError('There are invalid products on this list.');
    }

    const negativeQuantitie = products
      .map(product => product.quantity)
      .some(quantity => quantity < 0);

    if (negativeQuantitie) {
      throw new AppError('Negative product quantities are invalid');
    }

    const updatedListQuantity = hasProducts.map(product => {
      const productToBeUpdated = products.find(prod => prod.id === product.id);

      if (!productToBeUpdated) {
        return {
          id: product.id,
          quantity: -1,
        };
      }

      return {
        id: product.id,
        quantity: product.quantity - productToBeUpdated?.quantity,
      };
    });

    if (updatedListQuantity.some(product => product.quantity < 0)) {
      throw new AppError('This product does not have this quantity in stock.');
    }

    const formattedProductList = products.map((product, index) => {
      return {
        product_id: product.id,
        quantity: product.quantity,
        price: hasProducts[index].price,
      };
    });

    const createOrder = await this.ordersRepository.create({
      customer: hasCustomer,
      products: formattedProductList,
    });

    await this.productsRepository.updateQuantity(updatedListQuantity);

    return createOrder;
  }
}

export default CreateOrderService;

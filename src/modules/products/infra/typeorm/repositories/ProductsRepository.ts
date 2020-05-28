import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const createProduct = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    const savedProduct = await this.ormRepository.save(createProduct);

    return savedProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const hasProduct = await this.ormRepository.findOne({ where: { name } });

    return hasProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const allProductsInArrayId = await this.ormRepository.findByIds(products);

    return allProductsInArrayId;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const storedProducts = await this.ormRepository.findByIds(ids);

    const updatedProducts = storedProducts.map(storedProduct => {
      const productQuantities = products.find(
        product => product.id === storedProduct.id,
      );

      return {
        ...storedProduct,
        quantity: productQuantities?.quantity,
      };
    });

    const savedProducts = await this.ormRepository.save(updatedProducts);

    return savedProducts;
  }
}

export default ProductsRepository;

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { FilterProductDTO } from './dto/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  //filtering by name, description and category in the query
  async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(product => 
        product.name && product.name.includes(search) ||
        product.description && product.description.includes(search)
      );
    }
    

    if (category) {
      products = products.filter(product => product.category === category)
    }

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(createProductDTO: CreateProductDto): Promise<Product> {
    try {
      const newProduct = await this.productModel.create(createProductDTO);
    return newProduct.save();
    } catch (error) {
      this.handleException(error)
    }
    
  }

  async updateProduct(id: string, createProductDTO: CreateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, createProductDTO, { new: true });
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Product already exists. ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create product - check server logs`)
  }
}

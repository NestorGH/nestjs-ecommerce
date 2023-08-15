import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDTO } from './dto/filter-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async addProduct(@Body() createProductDTO: CreateProductDto) {
    const product = await this.productService.addProduct(createProductDTO);
    return product;
  }

  @Get()
  async getProducts(@Query() filterProductDTO: FilterProductDTO) {
    if (Object.keys(filterProductDTO).length) {
      const filteredProducts = await this.productService.getFilteredProducts(filterProductDTO);
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDto) {
    const product = await this.productService.updateProduct(id, createProductDTO);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}

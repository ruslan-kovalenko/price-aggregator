import { Controller, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findDiscounts(@Query('input') input: string) {
    return this.productsService.getGeneralPrices(input);
  }
}

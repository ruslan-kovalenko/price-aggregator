import { Injectable } from '@nestjs/common';
import { VarusScraper } from './varus.scraper';
import { Product } from 'src/products/types/product/product';

@Injectable()
export class VarusService {
  constructor(private readonly scraper: VarusScraper) {}

  async getCategories(input: string): Promise<Product[]> {
    return await this.scraper.scrapeCategoryPage(input);
  }
}

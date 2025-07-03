import { Injectable } from '@nestjs/common';
import { VarusScraper } from './varus.scraper';
import { Product } from 'src/products/types/product/product';
import { ScrapperHelper } from '../scrapper-helper';

@Injectable()
export class VarusService {
  constructor(private readonly scraper: VarusScraper) {}

  async getCategories(input: string): Promise<Product[]> {
    return ScrapperHelper.sortScrapped(this.scraper, input);
  }
}

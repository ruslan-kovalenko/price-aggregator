import { Injectable } from '@nestjs/common';
import { SilpoScraper } from './silpo.scraper';
import { Product } from 'src/products/types/product/product';
import { ScrapperHelper } from '../scrapper-helper';

@Injectable()
export class SilpoService {
  constructor(private readonly scraper: SilpoScraper) {}

  async getProducts(input: string): Promise<Product[]> {
    return ScrapperHelper.sortScrapped(this.scraper, input);
  }
}

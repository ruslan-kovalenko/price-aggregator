import { Injectable } from '@nestjs/common';
import { PaginatedScraperRunner } from '../paginated-scraper.runner';
import { AtbScraper } from './atb.scraper';
import { Product } from 'src/products/types/product/product';
import { ScrapperHelper } from '../scrapper-helper';

@Injectable()
export class AtbService {
  constructor(
    private readonly runner: PaginatedScraperRunner,
    private readonly scraper: AtbScraper,
  ) {}

  async getProducts(input: string): Promise<Product[]> {
    return ScrapperHelper.sortScrapped(this.scraper, input);
  }
}

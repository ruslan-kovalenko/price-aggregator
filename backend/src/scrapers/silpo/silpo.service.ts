import { Injectable } from '@nestjs/common';
import { SilpoScraper } from './silpo.scraper';
import { PaginatedScraperRunner } from 'src/scrapers/paginated-scraper.runner';
import { Product } from 'src/products/types/product/product';

@Injectable()
export class SilpoService {
  constructor(
    private readonly runner: PaginatedScraperRunner,
    private readonly scraper: SilpoScraper,
  ) {}

  async getProducts(input: string): Promise<Product[]> {
    return await this.scraper.scrapeCategoryPage(input);
  }
}

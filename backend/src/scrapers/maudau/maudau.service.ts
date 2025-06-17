import { Injectable } from '@nestjs/common';
import { MaudauScraper } from './maudau.scraper';
import { PaginatedScraperRunner } from 'src/products/paginated-scraper-runner/paginated-scraper.runner';
import { Product } from 'src/products/types/product/product';

@Injectable()
export class MaudauService {
  constructor(
    private readonly runner: PaginatedScraperRunner,
    private readonly scraper: MaudauScraper,
  ) {}

  async getProducts(input: string): Promise<Product[]> {
    return await this.runner.run(this.scraper, input);
  }
}

import { Injectable } from '@nestjs/common';
import { MaudauScraper } from './maudau.scraper';
import { PaginatedScraperRunner } from 'src/scrapers/paginated-scraper.runner';
import { Product } from 'src/products/types/product/product';
import { ScrapperHelper } from '../scrapper-helper';

@Injectable()
export class MaudauService {
  constructor(
    private readonly runner: PaginatedScraperRunner,
    private readonly scraper: MaudauScraper,
  ) {}

  async getProducts(input: string): Promise<Product[]> {
    return ScrapperHelper.sortScrapped(this.scraper, input);
  }
}

import { Injectable } from '@nestjs/common';
import { Product } from '../types/product/product';
import { ICategoryScraper } from '../../scrapers/category-scraper.interface';

@Injectable()
export class PaginatedScraperRunner {
  private readonly parallel = 5;

  async run(scraper: ICategoryScraper, input: string): Promise<Product[]> {
    const all: Product[] = [];
    let page = 1;
    let ended = false;

    while (!ended) {
      const batch = Array.from({ length: this.parallel }, (_, i) => page + i);
      const results = await Promise.all(
        batch.map((p) => scraper.scrapeCategoryPage(p, input)),
      );

      for (const products of results) {
        if (!products.length) {
          ended = true;
          break;
        }
        all.push(...products);
      }

      page += this.parallel;
    }

    return all;
  }
}

import { Injectable } from '@nestjs/common';
import { Product } from '../products/types/product/product';
import { ICategoryScraper } from './category-scraper.interface';

@Injectable()
export class ScrapperHelper {
  static async sortScrapped(
    scraper: ICategoryScraper,
    input: string,
  ): Promise<Product[]> {
    const result = await scraper.scrapeCategoryPage(input);
    const sortedByDiscount = result.sort(
      (a: Product, b: Product) => Number(a.discount) - Number(b.discount),
    );

    return sortedByDiscount;
  }
}

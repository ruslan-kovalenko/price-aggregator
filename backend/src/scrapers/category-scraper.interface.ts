import { Product } from '../products/types/product/product';

export interface ICategoryScraper {
  scrapeCategoryPage(page: number, input: string): Promise<Product[]>;
}

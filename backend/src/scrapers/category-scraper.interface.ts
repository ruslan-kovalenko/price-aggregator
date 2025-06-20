import { Product } from '../products/types/product/product';

export interface ICategoryScraper {
  scrapeCategoryPage(input: string): Promise<Product[]>;
}

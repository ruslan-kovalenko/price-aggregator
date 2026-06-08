import { Page } from 'puppeteer';
import { Product } from 'src/products/types/product/product';

export type ScraperEvaluateFn = (
  input: string,
  baseUrl: string,
) => (Product | undefined)[] | Product[];

export type WrapperArguments = {
  baseUrlName: string;
  searchParam: string;
  searchUrlPrefix: string;
  waitForSelector: string;
  afterGoto?: (page: Page) => Promise<void>;
  beforeEvaluate?: (page: Page) => Promise<void>;
  minCards?: {
    selector: string;
    count: number;
    pollIntervalMs?: number;
    maxAttempts?: number;
  };
};

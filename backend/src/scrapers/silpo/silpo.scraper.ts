import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICategoryScraper } from '../category-scraper.interface';
import puppeteer from 'puppeteer';
import { Product } from 'src/products/types/product/product';

@Injectable()
export class SilpoScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string): Promise<Product[]> {
    const baseUrl = this.configService.get<string>('SILPO_URL');
    const query = new URLSearchParams({ find: input }).toString();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = `${baseUrl}/search?${query}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('shop-silpo-common-product-card', {
      timeout: 10000,
    });

    const products = await page.evaluate(
      (input: string, baseUrl: string) => {
        const items = Array.from(
          document.querySelectorAll('shop-silpo-common-product-card'),
        );

        return items.reduce((acc, item) => {
          if (acc.length >= 10) return acc;

          const discount = item.querySelector('.product-card-price__sale');
          if (!discount) return acc;

          const titleEl = item.querySelector('.product-card__title');
          if (!titleEl || !titleEl.textContent.toLowerCase().includes(input))
            return acc;

          const discountNumber = discount.textContent
            ?.trim()
            .split('\n')[0]
            .replace('%', '')
            .trim()
            .replace(' ', '');

          const linkEl = item.querySelector('a');
          const priceEl = item
            .querySelector('.product-card-price__displayPrice')
            ?.textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();
          const oldPriceEl = item
            .querySelector('.product-card-price__displayOldPrice')
            ?.textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();

          acc.push({
            name: titleEl?.textContent?.trim() || null,
            price: parseFloat(priceEl) || null,
            oldPrice: parseFloat(oldPriceEl) || null,
            link: linkEl?.getAttribute('href')
              ? `${baseUrl}${linkEl.getAttribute('href')}`
              : null,
            discount: discountNumber,
          });

          return acc;
        }, []);
      },
      input,
      baseUrl,
    );

    return products.filter((product) => product);
  }
}

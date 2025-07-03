import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { ICategoryScraper } from '../category-scraper.interface';
import { Product } from 'src/products/types/product/product';

@Injectable()
export class VarusScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string): Promise<Product[]> {
    const baseUrl = this.configService.get<string>('VARUS_URL');
    const query = new URLSearchParams({ q: input }).toString();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = `${baseUrl}/search?${query}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.products__grid', {
      timeout: 15000,
    });

    const products = await page.evaluate(
      (input: string, baseUrl: string) => {
        const items = Array.from(document.querySelectorAll('.sf-product-card'));

        return items.map((item) => {
          const regularPrice = item.querySelector('.sf-price__regular');
          const discount = item.querySelector('.sf-product-card__badge_text');

          if (regularPrice || !discount) return;

          const titleEl = item.querySelector('.sf-product-card__title');

          if (!titleEl.textContent.toLowerCase().includes(input)) return;

          const linkEl = item.querySelector('a');

          const priceEl = item
            .querySelector('.sf-price__special')
            .textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();
          const oldPriceEl = item
            .querySelector('.sf-price__old')
            .textContent?.replace('грн', '')
            .replace(/\s/g, '')
            .trim();

          const discountNumber = discount.textContent
            ?.trim()
            .split('\n')[0]
            .replace('%', '')
            .trim();

          return {
            name: titleEl?.textContent?.trim() || null,
            link: linkEl?.getAttribute('href')
              ? `${baseUrl}${linkEl.getAttribute('href')}`
              : null,
            discount: discountNumber,
            price: parseFloat(priceEl) || null,
            oldPrice: parseFloat(oldPriceEl) || null,
          };
        });
      },
      input,
      baseUrl,
    );

    return products.filter((product) => product);
  }
}

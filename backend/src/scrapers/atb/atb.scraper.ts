import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { ICategoryScraper } from 'src/scrapers/category-scraper.interface';
import * as cheerio from 'cheerio';

@Injectable()
export class AtbScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string) {
    const baseUrl = this.configService.get<string>('ATB_URL');
    const query = new URLSearchParams({ query: input }).toString();
    const url = `${baseUrl}/sch?${query}`;
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'uk-UA,uk;q=0.9',
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.catalog-page__list', {
      timeout: 10000,
    });

    const products = await page.evaluate(
      (input: string, baseUrl: string) => {
        const items = Array.from(document.querySelectorAll('.catalog-item'));

        return items.map((item) => {
          const discount = item.querySelector('.custom-product-label');

          if (!discount) return;

          const titleEl = item.querySelector('.catalog-item__title > a');

          if (!titleEl.textContent.toLowerCase().includes(input)) return;

          const linkEl = item
            .querySelector('a.catalog-item__photo-link')
            .getAttribute('href');
          const priceEl = item
            .querySelector('.product-price__top')
            .getAttribute('value')
            .replace(/\s/g, '')
            .trim();
          const oldPriceEl = item
            .querySelector('.product-price__bottom')
            .getAttribute('value')
            .replace(/\s/g, '')
            .trim();

          const discountRaw = discount.textContent
            ?.trim()
            .split('\n')[0]
            .replace('%', '')
            .trim();
          const discountNumber = discountRaw.match(/-?\d+/);

          return {
            name: titleEl?.textContent?.trim() || null,
            price: parseFloat(priceEl) || null,
            oldPrice: parseFloat(oldPriceEl) || null,
            link: `${baseUrl}${linkEl}`,
            discount: discountNumber ? discountNumber[0] : 0,
          };
        });
      },
      input,
      baseUrl,
    );

    await browser.close();

    return products.filter((product) => product);
  }
}

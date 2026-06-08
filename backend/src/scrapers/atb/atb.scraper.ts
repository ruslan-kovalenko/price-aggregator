import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICategoryScraper } from 'src/scrapers/category-scraper.interface';
import { Product } from 'src/products/types/product/product';
import { scrapperWrapper } from '../scrapper.wrapper';

@Injectable()
export class AtbScraper implements ICategoryScraper {
  constructor(private configService: ConfigService) {}

  async scrapeCategoryPage(input: string): Promise<Product[]> {
    return scrapperWrapper(
      this.configService,
      input,
      {
        baseUrlName: 'ATB_URL',
        searchParam: 'query',
        searchUrlPrefix: 'sch',
        waitForSelector: '.catalog-page__list',
      },
      (input, baseUrl) => {
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
    );
  }
}
